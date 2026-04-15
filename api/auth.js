export default function handler(req, res) {
  res.status(200).json({ message: "OAuth proxy running" });
}
