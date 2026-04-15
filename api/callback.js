export default async function handler(req, res) {
  const code = req.query.code;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!code) {
    return res.status(400).send("Missing code");
  }

  if (!clientId || !clientSecret) {
    return res.status(500).send("Missiang GitHub OAuth environment variables");
  }

  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).send(`OAuth error: ${tokenData.error_description || tokenData.error}`);
    }

    const accessToken = tokenData.access_token;

    const html = `
<!doctype html>
<html>
  <body>
    <script>
      window.opener.postMessage(
        'authorization:github:success:${accessToken}',
        '*'
      );
      window.close();
    </script>
    Connexion réussie. Vous pouvez fermer cette fenêtre.
  </body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(html);
  } catch (error) {
    return res.status(500).send("OAuth callback failed");
  }
}
