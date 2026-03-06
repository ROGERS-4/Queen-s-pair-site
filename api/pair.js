// api/pair.js
export default function handler(req, res) {
  if (req.method === "POST") {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone number required" });

    const code = Math.floor(10000000 + Math.random() * 90000000); // 8-digit code
    return res.status(200).json({ phone, code });
  }
  res.status(405).json({ error: "Method not allowed" });
}