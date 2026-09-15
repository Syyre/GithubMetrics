import express, { type Express, type Request, type Response } from "express";

const PORT = 3000;
const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/api/github/:username", async (req: Request, res: Response) => {
  const username = req.params.username;

  const response = await fetch(`https://api.github.com/users/${username}`);

  if (!response.ok) {
    return res.status(response.status).json({ error: "User not found" });
  }

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

app.get("/api/github/:username/repos", async (req: Request, res: Response) => {
  const username = req.params.username;

  const response = await fetch(
    `https://api.github.com/users/${username}/repos`,
  );

  if (!response.ok) {
    return res.status(response.status).json({ error: "User not found" });
  }

  const data = await response.json();

  const repos = data.map((repo: any) => ({
    name: repo.name,
    description: repo.description,
    html_url: repo.html_url,
    language: repo.language,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    open_issues_count: repo.open_issues_count,
    watchers_count: repo.watchers_count,
    created_at: repo.created_at,
    updated_at: repo.updated_at,
  }));

  res.json(repos);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
