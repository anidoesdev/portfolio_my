import Image from "next/image";
import booksBunch from "@/images/books_bunch.png";

const skills = [
  {
    category: "AI / ML / DL",
    icon: "fi-ss-brain",
    items: ["PyTorch", "TensorFlow", "Transformers", "LangChain", "OpenAI API", "Scikit-learn"],
  },
  {
    category: "Frontend",
    icon: "fi-ss-browser",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    category: "Backend",
    icon: "fi-ss-database",
    items: ["Node.js", "Python", "FastAPI", "Express", "REST APIs"],
  },
  {
    category: "Database & Cloud",
    icon: "fi-ss-cloud",
    items: ["PostgreSQL", "MongoDB", "Redis", "AWS", "Docker", "Vercel"],
  },
  {
    category: "MLOps & Deployment",
    icon: "fi-ss-gears",
    items: ["Docker", "CI/CD for ML", "Model Serving (vLLM, TorchServe)", "MLflow", "Weights & Biases"],
  },
  {
    category: "Languages",
    icon: "fi-ss-terminal",
    items: ["Python", "TypeScript", "JavaScript", "SQL", "C++", "Java"],
  },
];

export default function Skills() {
  return (
    <section id="about" className="py-20 px-6 section-divider section-bg">
      <div className="mx-auto max-w-5xl">

        <div className="flex items-center justify-between mb-10">
          <h2 className="section-heading text-foreground">Skills</h2>
          <Image
            src={booksBunch}
            alt=""
            width={130}
            height={130}
            className="object-contain hidden sm:block"
            style={{ mixBlendMode: "multiply" }}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5 max-w-3xl mx-auto">
          {skills.flatMap(({ category, icon, items }) =>
            items.map((skill) => (
              <span
                key={`${category}-${skill}`}
                className="glass-badge flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full text-muted-fg cursor-default"
              >
                <i className={`fi ${icon} text-sm leading-none`} style={{ color: "#4a7c3f" }} />
                {skill}
              </span>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
