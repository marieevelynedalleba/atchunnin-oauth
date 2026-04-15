export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = "https://atchunnin-oauth.vercel.app/api/callback";

  if (!clientId) {
    return res.status(500).send("Missing GITHUB_CLIENT_ID");
  }

  const state = Math.random().toString(36).substring(2);
  const scope = "repo";

  const url =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&state=${encodeURIComponent(state)}`;

  res.redirect(url);
}
