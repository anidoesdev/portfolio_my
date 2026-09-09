import ContributionGraph from "./ContributionGraph";
import { getRepos } from "./githubRepos";

const USERNAME = "anidoesdev";

export default async function Contributions() {
  /* Pinned repositories exist only behind GitHub's authenticated GraphQL
     API. With GITHUB_TOKEN set this is the real pin list in pin order;
     without it, the top public repositories by stars. The heading below
     says which, so the section never claims "pinned" for a list that
     was assembled a different way. */
  const { source, repos } = await getRepos(USERNAME);

  return (
    <section id="contributions" className="py-24 px-6 section-divider band-sky">
      <div className="mx-auto max-w-5xl">

        <div className="mb-10">
          <h2 className="section-heading">GitHub Activity</h2>
        </div>

        <div className="glass-card p-6 overflow-x-auto">
          <ContributionGraph username={USERNAME} />
        </div>

        {/* Dropped entirely when the fetch failed or came back empty —
            an empty grid under a heading looks broken, and GitHub being
            briefly unreachable is not worth showing a reader. */}
        {repos.length > 0 && (
          <>
            <h3 className="repos-head">
              {source === "pinned" ? "Pinned repositories" : "Most starred repositories"}
            </h3>

            <ul className="repos">
              {repos.map((r) => (
                <li key={r.name}>
                  {/* The whole card is the link: one target, one tab
                      stop, and nothing inside it to catch a click that
                      was meant for the card. */}
                  <a
                    className="repo-card"
                    href={r.url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <span className="repo-bar">
                      <span className="name">{r.name}</span>
                      {r.stars > 0 && (
                        <span className="stars">
                          ★ {r.stars}
                          <span className="sr-only"> stars</span>
                        </span>
                      )}
                    </span>

                    <span className="repo-body">
                      <span className="repo-desc">
                        {r.description ?? "No description."}
                      </span>

                      <span className="repo-foot">
                        {r.language && (
                          <span className="repo-lang">
                            <i aria-hidden="true" />
                            {r.language}
                          </span>
                        )}
                        {r.forks > 0 && (
                          <span className="repo-forks">
                            {r.forks} fork{r.forks === 1 ? "" : "s"}
                          </span>
                        )}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}

      </div>
    </section>
  );
}
