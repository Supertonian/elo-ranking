export default function handler(req, res) {
  if (req.method === "POST") {
    const { challenge } = req.body;

    if (challenge) {
      res.status(200).json({ challenge });
    } else {
      res.status(400).json({ error: "Missing challenge parameter" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
