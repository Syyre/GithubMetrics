import express, { type Express, type Request, type Response } from "express";
import "dotenv/config";
import {
  getUser,
  getUserRepos,
  getLanguages,
} from "./services/githubService.ts";

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
  if (typeof username !== "string" || username.trim() === "") {
    return res.status(400).json({ error: "Invalid username" });
  }

  const data = await getUser(username);

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
  if (typeof username !== "string" || username.trim() === "") {
    return res.status(400).json({ error: "Invalid username" });
  }

  const data = await getUserRepos(username);

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
    const languageTotals: Record<string, number> = {};
    const username = req.params.username;
    if (typeof username !== "string" || username.trim() === "") {
      return res.status(400).json({ error: "Invalid username" });
    }

    //userData has user name and bio
    const userData = await getUser(username);

    //fetch all repos and calculate user's total language percentage
    const reposData = await getUserRepos(username);

    for (const repo of reposData) {
      const languageData = await getLanguages(username, repo.name);

      for (const [language, bytes] of Object.entries(languageData)) {
        languageTotals[language] =
          (languageTotals[language] || 0) + Number(bytes);
      }
    }

    const totalBytes = Object.values(languageTotals).reduce(
      (acc, bytes) => acc + bytes,
      0,
    );

    const languagePercentages = Object.fromEntries(
      Object.entries(languageTotals).map(([language, bytes]) => [
        language,
        Number((bytes / totalBytes) * 100).toFixed(2),
      ]),
    );
    res.json({
      username: userData.login,
      bio: userData.bio,
      public_repos: userData.public_repos,
      ...languagePercentages,
    });
  },
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
