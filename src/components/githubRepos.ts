/* Fetching the repositories shown under the contribution graph.

   The pinned repositories on a GitHub profile are **only** available
   through the authenticated GraphQL API — REST does not expose them at
   all. So there are two paths:

     with GITHUB_TOKEN    the actual pins, in the order they are pinned
     without              the top public repositories by stars

   The fallback exists so the section works before anyone sets a token
   up, and the result says which source it came from so the heading can
   describe what it is actually showing rather than claiming "pinned"
   for a list that is not.

   Every failure — no network, rate limit, bad token, malformed payload —
   returns an empty result. A portfolio must not fail to build because
   GitHub was briefly unreachable. */

export type Repo = {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  language: string | null;
};

export type RepoResult = {
  source: "pinned" | "top" | "none";
  repos: Repo[];
};

const EMPTY: RepoResult = { source: "none", repos: [] };

/* Rebuilt hourly. Star counts move slowly and a portfolio is not a
   dashboard; this keeps the page static while staying roughly current. */
const REVALIDATE = 3600;
const TIMEOUT_MS = 6000;
const LIMIT = 6;

type GraphQLRepo = {
  name?: unknown;
  description?: unknown;
  url?: unknown;
  stargazerCount?: unknown;
  forkCount?: unknown;
  primaryLanguage?: { name?: unknown } | null;
};

type RestRepo = {
  name?: unknown;
  description?: unknown;
  html_url?: unknown;
  stargazers_count?: unknown;
  forks_count?: unknown;
  language?: unknown;
  fork?: unknown;
};

const str = (v: unknown): string | null => (typeof v === "string" && v ? v : null);
const num = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) ? v : 0);

async function fetchPinned(user: string, token: string): Promise<RepoResult> {
  const query = `
    query($login: String!) {
      user(login: $login) {
        pinnedItems(first: ${LIMIT}, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              url
              stargazerCount
              forkCount
              primaryLanguage { name }
            }
          }
        }
      }
    }`;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login: user } }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    next: { revalidate: REVALIDATE },
  });
  if (!res.ok) return EMPTY;

  const json = await res.json();
  const nodes: unknown = json?.data?.user?.pinnedItems?.nodes;
  if (!Array.isArray(nodes)) return EMPTY;

  const repos = nodes
    .filter((n): n is GraphQLRepo => Boolean(n) && typeof n === "object")
    .map((n) => ({
      name: str(n.name) ?? "",
      description: str(n.description),
      url: str(n.url) ?? "",
      stars: num(n.stargazerCount),
      forks: num(n.forkCount),
      language: str(n.primaryLanguage?.name),
    }))
    .filter((r) => r.name && r.url);

  return repos.length ? { source: "pinned", repos } : EMPTY;
}

async function fetchTop(user: string): Promise<RepoResult> {
  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=updated`,
    {
      headers: { Accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: REVALIDATE },
    },
  );
  if (!res.ok) return EMPTY;

  const json: unknown = await res.json();
  if (!Array.isArray(json)) return EMPTY;

  const repos = (json as RestRepo[])
    /* Forks are someone else's work with your name on the URL. */
    .filter((r) => r.fork !== true)
    .map((r) => ({
      name: str(r.name) ?? "",
      description: str(r.description),
      url: str(r.html_url) ?? "",
      stars: num(r.stargazers_count),
      forks: num(r.forks_count),
      language: str(r.language),
    }))
    .filter((r) => r.name && r.url)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, LIMIT);

  return repos.length ? { source: "top", repos } : EMPTY;
}

export async function getRepos(user: string): Promise<RepoResult> {
  const token = process.env.GITHUB_TOKEN;

  if (token) {
    try {
      const pinned = await fetchPinned(user, token);
      if (pinned.repos.length) return pinned;
    } catch {
      /* fall through to the public list rather than showing nothing */
    }
  }

  try {
    return await fetchTop(user);
  } catch {
    return EMPTY;
  }
}
