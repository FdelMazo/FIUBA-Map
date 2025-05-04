export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "https://fede.dm");

  const { binId } = req.query;
  const MASTER_KEY = process.env.JSONBIN_MASTER_KEY;

  if (!binId) {
    return res.status(400).json({ error: "Missing bin id" });
  }

  if (!MASTER_KEY) {
    return res.status(500).json({ error: "Missing JSONBIN_MASTER_KEY" });
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
