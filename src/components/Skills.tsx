/* Every entry lives in exactly one group.

   Three used to appear twice, and the three-way call went:
     Python     → Languages, not Backend  (Backend keeps its frameworks)
     TypeScript → Languages, not Frontend (Frontend keeps its libraries)
     Docker     → MLOps & Deployment, not Database & Cloud

   The rule behind those: a language belongs under Languages, and a tool
   belongs where it does its work. Move any of them if you would rather
   they sat elsewhere — just do not put one in two places, because the
   duplication is what this list was flattened to remove. */

/* Ordered as a spec sheet is: what it is written in first, then what it
   is built with, then what runs it, then what ships it. */
const skills = [
  {
    category: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "SQL", "C++", "Java"],
  },
  {
    category: "AI / ML / DL",
    items: ["PyTorch", "TensorFlow", "Transformers", "LangChain", "OpenAI API", "Scikit-learn"],
  },
  {
    category: "Backend",
    items: ["Node.js", "FastAPI", "Express", "REST APIs"],
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS"],
  },
  {
    category: "Database & Cloud",
    items: ["PostgreSQL", "MongoDB", "Redis", "AWS", "Vercel"],
  },
  {
    category: "MLOps & Deployment",
    items: [
      "Docker",
      "CI/CD for ML",
      "Model Serving (vLLM, TorchServe)",
      "MLflow",
      "Weights & Biases",
    ],
  },
];

const TOTAL = skills.reduce((n, g) => n + g.items.length, 0);

export default function Skills() {
  return (
    <section id="about" className="py-24 px-6 section-divider band-leaf section-screen">
      <div className="mx-auto max-w-5xl">

        <div className="mb-10">
          <h2 className="section-heading">Skills</h2>
        </div>

        {/* A spec sheet — the page every machine shipped with.

            Three versions of this section drew each of the 29 entries as
            its own bordered object: pills, then chips in a rack, then
            keycaps on a deck. Any of those is ~45 decorated elements in
            one screen, and that is what made it look busy — not the
            arrangement, the boxing. Nothing here has a border. The type
            does the work.

            Unpanelled on purpose, like the quest log. Achievements and
            the repo board are both bevelled-panel grids, so a third
            frame in the same stretch is what stops the reader telling
            these sections apart.

            A <dl>: each category is a term and its entries are its
            definition, which binds them properly for a screen reader.
            The <h3> inside the <dt> keeps the headings navigable too —
            an early flat version had neither, so 29 items arrived with
            nothing to say what any of them belonged to. */}
        <dl className="spec">
          {skills.map(({ category, items }) => (
            <div key={category} className="spec-row">
              <dt className="spec-term">
                <h3>{category}</h3>
              </dt>
              <dd className="spec-def">
                <ul>
                  {items.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>

      </div>
    </section>
  );
}
