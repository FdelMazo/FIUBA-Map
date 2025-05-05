// This is simply a proxy to the jsonbin.io API,
// as to not expose the API keys on the client side.

// On jsonbin we have every user key mapped to a bin id under a list bin
// This route gets the key by param, fetches the bin id from the list bin,
// and then fetches the bin data from the user bin.
//
// Optionally, we can bypass the bin lookup by getting the bin id from the query,
// and therefore save a request.
export default async function handler(req, res) {
  if (process.env.NODE_ENV === "development") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "https://fede.dm");
  }

  const MASTER_KEY = process.env.JSONBIN_MASTER_KEY;
  const BINS_LIST_ID = process.env.JSONBIN_LIST_BIN_ID;

  const { key, binId: queryBinId } = req.query;

  if (!key) {
    return res.status(400).json({ error: "Missing key" });
  }

  if (!MASTER_KEY || !BINS_LIST_ID) {
    return res
      .status(403)
      .json({ error: "Missing JSONBIN environment variables" });
  }

  let binId = queryBinId;
  if (!binId) {
    binId = await fetch(`https://api.jsonbin.io/v3/b/${BINS_LIST_ID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Bin-Meta": "false",
        "X-Master-Key": MASTER_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => res[key] || null);
  }

  if (!binId) {
    return res.status(404).json({ error: "User map not found" });
  }

  const url = `https://api.jsonbin.io/v3/b/${binId}`;
  const response = await fetch(url, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "X-Bin-Meta": "false",
      "X-Master-Key": MASTER_KEY,
    },
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
