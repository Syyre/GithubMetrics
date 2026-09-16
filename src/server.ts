import express, { type Express, type Request, type Response } from "express";

const PORT = 3000;
const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// const getLanguage = async (
//   username: string,
//   repoName: string,
// ): Promise<string | null> => {
//   const response = await fetch(
//     `https://api.github.com/repos/${username}/${repoName}/languages`,
//   );

//   if (!response.ok) {
//     return null;
//   }

//   const data = await response.json();
//   console.log(data);
//   const languages = Object.keys(data);
//   return languages.length > 0 ? languages[0] : null;
// };

// console.log(
//   getLanguage("Syyre", "MovieSearcher").then((language) => {
//     console.log(`Primary language for Syyre/MovieSearcher: ${language}`);
//   }),
// );

//http://localhost:3000/api/github/Syyre
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

//http://localhost:3000/api/github/Syyre/repos
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
    created_at: repo.created_at,
    updated_at: repo.updated_at,
  }));

  res.json(repos);
});

//metrics request
app.get(
  "/api/github/:username/metrics",
  async (req: Request, res: Response) => {
    const username = req.params.username;

    const response = await fetch(
      `https://api.github.com/users/${username}/repos`,
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "User not found" });
    }

    //nameData will contain user's name and bio
    const nameData = await response.json();

    //fetch all repos and calculate user's total language percentage
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos`,
    );

    if (!reposResponse.ok) {
      return res.status(reposResponse.status).json({ error: "User not found" });
    }

    const reposData = await reposResponse.json();

    for (const repo of reposData) {
      const languagesResponse = await fetch(
        `https://api.github.com/repos/${username}/${repo.name}/languages`,
      );

      const languagesData = await languagesResponse.json();

      console.log(`Languages for ${repo.name}:`, languagesData);
    }
  },
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
