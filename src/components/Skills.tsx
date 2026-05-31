import Image from "next/image";
import booksBunch from "@/images/books_bunch.png";

const skills = [
  {
    category: "AI / ML / DL",
    items: [
      { name: "PyTorch", level: "Advanced" },
      { name: "TensorFlow", level: "Intermediate" },
      { name: "Transformers", level: "Advanced" },
      { name: "LangChain", level: "Advanced" },
      { name: "OpenAI API", level: "Expert" },
      { name: "Scikit-learn", level: "Advanced" },
    ],
  },
  {
    category: "Frontend",
    items: [
      { name: "React", level: "Advanced" },
      { name: "Next.js", level: "Advanced" },
      { name: "TypeScript", level: "Intermediate" },
      { name: "Tailwind CSS", level: "Advanced" },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", level: "Intermediate" },
      { name: "Python", level: "Expert" },
      { name: "FastAPI", level: "Advanced" },
      { name: "Express", level: "Intermediate" },
      { name: "REST APIs", level: "Advanced" },
    ],
  },
  {
    category: "Database & Cloud",
    items: [
      { name: "PostgreSQL", level: "Intermediate" },
      { name: "MongoDB", level: "Intermediate" },
      { name: "Redis", level: "Familiar" },
      { name: "AWS", level: "Familiar" },
      { name: "Docker", level: "Intermediate" },
      { name: "Vercel", level: "Advanced" },
    ],
  },
  {
    category: "Languages",
    items: [
      { name: "Python", level: "Expert" },
      { name: "TypeScript", level: "Intermediate" },
      { name: "JavaScript", level: "Advanced" },
      { name: "SQL", level: "Intermediate" },
      { name: "C++", level: "Familiar" },
      { name: "Java", level: "Familiar" },
    ],
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

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-8">
          {skills.map(({ category, items }) => (
            <div key={category}>
              <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2">{category}</h3>
              <div className="border-t mb-3" style={{ borderColor: "rgba(131, 133, 89, 0.5)" }} />
              <div className="flex flex-wrap gap-2">
                {items.map(({ name, level }) => (
                  <span
                    key={name}
                    className="relative group glass-badge px-2.5 sm:px-3 py-1 text-xs font-medium rounded-md text-muted-fg group-hover:text-foreground transition-colors duration-150 cursor-default"
                  >
                    {name}
                    <span
                      className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10"
                      style={{ background: "#1b2920", color: "#e3ebe6", border: "1px solid #899f81" }}
                    >
                      {level}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
