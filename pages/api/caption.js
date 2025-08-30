export default function handler(req, res) {
  if (req.method === "POST") {
    res.status(200).json({ caption: "✅ API working on Vercel" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
