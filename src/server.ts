import express, { type Express, type Request, type Response } from "express";

const PORT = 3000;
const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/api/github/:username", async (req: Request, res: Response) => {
  const username = req.params.username;

  const response = await fetch(`https://api.github.com/users/${username}`);

  const data = await response.json();

  res.json({
    username: data.login,
    name: data.name,
    bio: data.bio,
    public_repos: data.public_repos,
    followers: data.followers,
    following: data.following,
    created_at: data.created_at,
    email: data.email,
    location: data.location,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
