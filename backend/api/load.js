export default async function handler(req, res) {
  if (process.env.NODE_ENV === "development") {
    res.setHeader("Access-Control-Allow-Origin", "*");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "https://fede.dm");
  }

  const MASTER_KEY = process.env.JSONBIN_MASTER_KEY;
  const BINS_LIST_ID = process.env.JSONBIN_LIST_BIN_ID;

  const { key } = req.query;

  if (!key) {
    return res.status(400).json({ error: "Missing key" });
  }

  if (!MASTER_KEY || !BINS_LIST_ID) {
    return res
      .status(500)
      .json({ error: "Missing JSONBIN environment variables" });
  }

  const binId = await fetch(`https://api.jsonbin.io/v3/b/${BINS_LIST_ID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Bin-Meta": "false",
      "X-Master-Key": MASTER_KEY,
    },
  })
    .then((res) => res.json())
    .then((res) => res[key] || null);

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
