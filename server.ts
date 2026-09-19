import express, { type Express, type Request, type Response } from "express";
import "dotenv/config";
import {
  getUser,
  getUserRepos,
  getLanguages,
  getTotalCommits,
} from "./services/githubService.ts";

const PORT = 3000;
const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

//http://localhost:3000/api/github/Syyre
app.get("/api/github/:username", async (req: Request, res: Response) => {
  const username = req.params.username;
  if (typeof username !== "string" || username.trim() === "") {
    return res.status(400).json({ error: "Invalid username" });
  }

  const data = await getUser(username);

  res.json(data);
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
// app.get(
//   "/api/github/:username/metrics",
//   async (req: Request, res: Response) => {
//     const languageTotals: Record<string, number> = {};
//     const username = req.params.username;
//     let starCount = 0;
//     let totalForks = 0;
//     let totalWatchers = 0;
//     if (typeof username !== "string" || username.trim() === "") {
//       return res.status(400).json({ error: "Invalid username" });
//     }

//     const userData = await getUser(username);
//     const reposData = await getUserRepos(username);
//     const totalCommits = await getTotalCommits(username);

//     for (const repo of reposData) {
//       starCount += repo.stargazers_count;
//       totalForks += repo.forks_count;
//       totalWatchers += repo.watchers_count;
//       const languageData = await getLanguages(username, repo.name);

//       for (const [language, bytes] of Object.entries(languageData)) {
//         languageTotals[language] =
//           (languageTotals[language] || 0) + Number(bytes);
//       }
//     }

//     const totalBytes = Object.values(languageTotals).reduce(
//       (acc, bytes) => acc + bytes,
//       0,
//     );

//     const languagePercentages = Object.fromEntries(
//       Object.entries(languageTotals).map(([language, bytes]) => [
//         language,
//         Number((bytes / totalBytes) * 100).toFixed(2),
//       ]),
//     );
//     res.json({
//       username: userData.login,
//       bio: userData.bio,
//       total_public_repos: userData.public_repos,
//       total_commits_last_30_days: totalCommits,
//       total_stars: starCount,
//       total_forks: totalForks,
//       total_watchers: totalWatchers,
//       languages: { ...languagePercentages },
//     });
//   },
// );

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
