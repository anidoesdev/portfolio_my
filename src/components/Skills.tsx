/* Every entry lives in exactly one group.

   Three used to appear twice, and the three-way call went:
     Python     → Languages, not Backend  (Backend keeps its frameworks)
     TypeScript → Languages, not Frontend (Frontend keeps its libraries)
     Docker     → MLOps & Deployment, not Database & Cloud

   The rule behind those: a language belongs under Languages, and a tool
   belongs where it does its work. Move any of them if you would rather
   they sat elsewhere — just do not put one in two places, because the
   duplication is what this list was flattened to remove. */
const skills = [
  {
    category: "AI / ML / DL",
    icon: "fi-ss-brain",
    items: ["PyTorch", "TensorFlow", "Transformers", "LangChain", "OpenAI API", "Scikit-learn"],
  },
  {
    category: "Frontend",
    icon: "fi-ss-browser",
    items: ["React", "Next.js", "Tailwind CSS"],
  },
  {
    category: "Backend",
    icon: "fi-ss-database",
    items: ["Node.js", "FastAPI", "Express", "REST APIs"],
  },
  {
    category: "Database & Cloud",
    icon: "fi-ss-cloud",
    items: ["PostgreSQL", "MongoDB", "Redis", "AWS", "Vercel"],
  },
  {
    category: "MLOps & Deployment",
    icon: "fi-ss-gears",
    items: [
      "Docker",
      "CI/CD for ML",
      "Model Serving (vLLM, TorchServe)",
      "MLflow",
      "Weights & Biases",
    ],
  },
  {
    category: "Languages",
    icon: "fi-ss-terminal",
    items: ["Python", "TypeScript", "JavaScript", "SQL", "C++", "Java"],
  },
];

export default function Skills() {
  return (
    <section id="about" className="py-24 px-6 section-divider band-leaf">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8">
          <h2 className="section-heading">Skills</h2>
        </div>

        {/* One bevelled group per category, each with a real heading.
            The flat version had no headings at all, so a screen reader
            got the whole list with nothing to say what anything belonged
            to. The category icon survives in the group header, which is
            where it was doing its work anyway. */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map(({ category, icon, items }) => (
            <section key={category} className="skill-group">
              <h3 className="skill-head">
                <i className={`fi ${icon}`} aria-hidden="true" />
                <span className="name">{category}</span>
              </h3>
              <ul className="skill-list">
                {items.map((skill) => (
                  <li key={skill} className="skill-chip">
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
