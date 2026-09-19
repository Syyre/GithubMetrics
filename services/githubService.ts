import "dotenv/config";
import { db } from "../src/prisma/db";
const GITHUB_API_BASE_URL = "https://api.github.com";

const ONE_HOUR_IN_MS = 60 * 60 * 1000;

async function githubFetch(endpoint: string) {
  const response = await fetch(`${GITHUB_API_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed with status ${response.status}`);
  }

  return response.json();
}

export async function getUser(username: string) {
  const exisitingUser = await db.orm.public.User.where({
    username: username,
  }).first();

  if (exisitingUser) {
    const lastUpdated = new Date(exisitingUser.UpdatedAt).getTime();
    const isOld = Date.now() - lastUpdated > ONE_HOUR_IN_MS;

    // If the user exists and is not old, return the existing user without timestamps
    if (!isOld) {
      const { CreatedAt, UpdatedAt, ...userWithoutTimestamps } = exisitingUser;
      return userWithoutTimestamps;
    }
    const githubUser = await githubFetch(`/users/${username}`);

    //update user if older than hour
    const updated = await db.orm.public.User.where({
      username: username,
    }).update({
      name: githubUser.name,
      bio: githubUser.bio,
      followers: githubUser.followers,
      following: githubUser.following,
      public_repos: githubUser.public_repos,
      account_created_at: githubUser.created_at,
      email: githubUser.email,
    });
    const { CreatedAt, UpdatedAt, ...userWithoutTimestamps } = updated!;
    return userWithoutTimestamps;
  }

  const githubUser = await githubFetch(`/users/${username}`);

  const newUser = await db.orm.public.User.create({
    username: githubUser.login,
    name: githubUser.name,
    bio: githubUser.bio,
    followers: githubUser.followers,
    following: githubUser.following,
    public_repos: githubUser.public_repos,
    account_created_at: githubUser.created_at,
    email: githubUser.email,
  });
  const { CreatedAt, UpdatedAt, ...userWithoutTimestamps } = newUser;
  return userWithoutTimestamps;
}

export async function getUserRepos(username: string) {
  return githubFetch(`/users/${username}/repos`);
}

export async function getLanguages(owner: string, repo: string) {
  return githubFetch(`/repos/${owner}/${repo}/languages`);
}

export async function getTotalCommits(username: string) {
  const since = new Date();
  since.setDate(since.getDate() - 30); // 30 days ago
  const sinceStr = since.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  const query = `author:${username} author-date:>=${sinceStr}`;
  const data = await githubFetch(
    `/search/commits?q=${encodeURIComponent(query)}`,
  );
  return data.total_count;
}
