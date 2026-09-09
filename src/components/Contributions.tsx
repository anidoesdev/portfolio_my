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
        

      </div>
    </section>
  );
}
