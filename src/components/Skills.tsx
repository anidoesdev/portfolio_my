import Image from "next/image";
import booksBunch from "@/images/books_bunch.png";

const skills = [
  {
    category: "AI / ML / DL",
    items: ["PyTorch", "TensorFlow", "Transformers", "LangChain", "OpenAI API", "Scikit-learn"],
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Python", "FastAPI", "Express", "REST APIs"],
  },
  {
    category: "Database & Cloud",
    items: ["PostgreSQL", "MongoDB", "Redis", "AWS", "Docker", "Vercel"],
  },
  {
    category: "Languages",
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

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-8">
          {skills.map(({ category, items }) => (
            <div key={category}>
              <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2">{category}</h3>
              <div className="border-t mb-3" style={{ borderColor: "rgba(131, 133, 89, 0.5)" }} />
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className="glass-badge px-2.5 sm:px-3 py-1 text-xs font-medium rounded-md text-muted-fg cursor-default"
                  >
                    {skill}
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
