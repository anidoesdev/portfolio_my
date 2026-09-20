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
    <section id="contributions" className="py-24 px-6 section-divider band-sky section-screen">
      <div className="mx-auto max-w-5xl">

        <div className="mb-10">
          <h2 className="section-heading">GitHub Activity</h2>
        </div>

        <div className="glass-card contrib-card">
          {/* The same moulded title bar the repo and achievement cards
              carry, so the panel belongs to the page rather than to the
              calendar library. The handle doubles as the way out to the
              profile — the grid is the only thing on this card that
              could be mistaken for a link, and it is not one. */}
          <div className="contrib-bar">
            <span className="name">Contributions</span>
            <a
              className="who"
              href={`https://github.com/${USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              @{USERNAME}
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>

          <div className="contrib-body">
            <div className="contrib-scroll">
              <ContributionGraph username={USERNAME} />
            </div>
          </div>
        </div>

        {/* Dropped entirely when the fetch failed or came back empty —
            an empty grid under a heading looks broken, and GitHub being
            briefly unreachable is not worth showing a reader. */}
        

      </div>
    </section>
  );
}
