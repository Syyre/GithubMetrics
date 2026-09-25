# GithubMetrics

A backend API that fetches and caches GitHub user and repository metrics, built to minimize redundant calls to the GitHub REST API through a time-based PostgreSQL caching layer.

## Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** Express
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Hosting:** AWS EC2
- **Managed Database:** AWS RDS (PostgreSQL)

## Features

- Fetches GitHub user profiles and repository lists via the GitHub REST API
- Caches results in PostgreSQL, keyed by username
- Time-based cache invalidation (1 hour) — serves cached data when fresh, refetches from GitHub when stale
- Tracks per-repository language breakdowns
- Deployed on AWS EC2, with PostgreSQL hosted on AWS RDS

## API Endpoints

### Get a GitHub user

```
GET /api/github/:username
```

Returns the cached user profile if present and updated within the last hour; otherwise fetches from GitHub, stores the result, and returns it.

**Example response:**

```json
{
  "id": 1,
  "username": "Syyre",
  "name": "Mathu",
  "bio": null,
  "followers": 0,
  "following": 0,
  "public_repos": 15,
  "account_created_at": "2022-08-31 14:09:17+10",
  "email": null,
  "repositoriesUpdatedAt": null
}
```

### Get a user's repositories

```
GET /api/github/:username/repos
```

Returns the user's cached repositories (including per-language byte breakdowns) if updated within the last hour; otherwise refetches from GitHub, replaces the cached repository set, and returns the fresh data.

## Environment Variables

Create a `.env` file in the project root:

```
DATABASE_URL="postgresql://<user>:<password>@<host>:5432/<database>?sslmode=no-verify"
GITHUB_TOKEN="<your GitHub personal access token>"
```
