export const config = { runtime: "edge" };

const JSONBIN_API = "https://api.jsonbin.io/v3/b";
const JSONBIN_INDEX_BIN = "6a95c0eff5f4af5e2958dca2";
const JSONBIN_MASTER_KEY = process.env.JSONBIN_MASTER_KEY!;

interface DBRecord {
  padron: string;
  ultimaCarrera: string;
  carreras: Record<string, unknown>;
}

type Body =
  | { action: "login"; padron: string; binId?: string }
  | { action: "create"; padron: string; record: DBRecord }
  | { action: "save"; padron: string; binId: string; record: DBRecord };

const isAllowedOrigin = (origin: string) =>
  origin.startsWith("https://fede.dm") ||
  origin.startsWith("http://localhost:");

const corsHeadersFor = (origin: string) => ({
  "Access-Control-Allow-Origin": isAllowedOrigin(origin)
    ? origin
    : "https://fede.dm",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
});

const jsonbinreq = (path: string, init?: RequestInit) => {
  return fetch(`${JSONBIN_API}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": JSONBIN_MASTER_KEY,
      ...(init?.headers || {}),
    },
  });
};

// A diferencia de ensureOk, no tira: readBin necesita distinguir "no existe" (404, devolver
// null) de "se rompio la red" (throw), asi que no puede compartir el throw-on-!ok de abajo.
const readBin = async (binId: string) => {
  const res = await jsonbinreq(`/${binId}/latest`);
  if (!res.ok) {
    return null;
  }
  const { record } = await res.json();
  return record;
};

const readIndex = async () => {
  const index = await readBin(JSONBIN_INDEX_BIN);
  if (!index) {
    throw new Error("could not read JSONBin index");
  }
  return index as Record<string, string>;
};

const ensureOk = (res: Response, message: string) => {
  if (!res.ok) throw new Error(message);
  return res;
};

const writeIndex = async (
  index: Record<string, string>,
  newEntry: { padron: string; binId: string },
) => {
  const updated = { ...index, [newEntry.padron]: newEntry.binId };
  if (Object.keys(updated).length < Object.keys(index).length) {
    throw new Error("index update would remove entries");
  }

  ensureOk(
    await jsonbinreq(`/${JSONBIN_INDEX_BIN}`, {
      method: "PUT",
      body: JSON.stringify(updated),
    }),
    "could not write to JSONBin index",
  );
};

const isValidRecord = (record: unknown, padron: string): record is DBRecord => {
  return (
    !!record &&
    typeof record === "object" &&
    (record as DBRecord).padron === padron &&
    typeof (record as DBRecord).ultimaCarrera === "string" &&
    typeof (record as DBRecord).carreras === "object"
  );
};

// Usado por los dos caminos de login (binId cacheado, o el que sale del indice):
// lee un bin y lo devuelve solo si de verdad es del padron pedido.
const tryLogin = async (binId: string, padron: string) => {
  const record = await readBin(binId);
  return record && isValidRecord(record, padron) ? { binId, record } : null;
};

export default async function handler(req: Request): Promise<Response> {
  const origin = req.headers.get("origin") ?? req.headers.get("referer") ?? "";
  const corsHeaders = corsHeadersFor(origin);
  const jsonres = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (!isAllowedOrigin(origin)) {
    return new Response("Forbidden", { status: 403, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return jsonres({ error: "bad request" }, 400);
  }

  if (!body?.padron || typeof body.padron !== "string") {
    return jsonres({ error: "bad request" }, 400);
  }

  try {
    if (body.action === "login") {
      const cached = body.binId && (await tryLogin(body.binId, body.padron));
      if (cached) return jsonres({ status: "ok", ...cached });

      const index = await readIndex();
      const binId = index[body.padron];
      const found = binId && (await tryLogin(binId, body.padron));
      if (!found) return jsonres({ status: "notfound" });
      return jsonres({ status: "ok", ...found });
    }

    if (body.action === "create") {
      if (!isValidRecord(body.record, body.padron)) {
        return jsonres({ error: "bad request" }, 400);
      }

      const index = await readIndex();
      if (index[body.padron]) {
        return jsonres({ error: "padron already registered" }, 409);
      }

      const createRes = ensureOk(
        await jsonbinreq("", {
          method: "POST",
          headers: { "X-Bin-Name": body.padron },
          body: JSON.stringify(body.record),
        }),
        "could not create new bin",
      );

      const { metadata } = await createRes.json();
      const binId = metadata.id as string;

      await writeIndex(index, { padron: body.padron, binId });
      return jsonres({ status: "ok", binId, record: body.record });
    }

    if (body.action === "save") {
      if (!body.binId || !isValidRecord(body.record, body.padron)) {
        return jsonres({ error: "bad request" }, 400);
      }

      ensureOk(
        await jsonbinreq(`/${body.binId}`, {
          method: "PUT",
          body: JSON.stringify(body.record),
        }),
        "could not save record",
      );
      return jsonres({ status: "ok" });
    }

    return jsonres({ error: "unknown action" }, 400);
  } catch (err) {
    return jsonres({ error: (err as Error).message }, 500);
  }
}
