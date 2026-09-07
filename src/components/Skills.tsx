"use client";

import { useState } from "react";

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

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/* Which categories each entry appears in. Several genuinely span more
   than one — Docker is deployment *and* infrastructure, Python is the
   backend *and* a language — and grouping made those look like
   duplication bugs. Naming them as shared turns an apparent mistake into
   the fact it actually is.

   Derived from the data, so it stays true if the lists change. */
const CATEGORIES_BY_SKILL = new Map<string, string[]>();
for (const group of skills) {
  for (const item of group.items) {
    const key = item.toLowerCase();
    CATEGORIES_BY_SKILL.set(key, [...(CATEGORIES_BY_SKILL.get(key) ?? []), group.category]);
  }
}
const SHARED = new Map(
  [...CATEGORIES_BY_SKILL].filter(([, categories]) => categories.length > 1),
);

/* Counted from the data so the header cannot drift when a category
   gains or loses an entry. */
const TOTAL = skills.reduce((n, g) => n + g.items.length, 0);

export default function Skills() {
  /* Hovering one copy of a shared entry lights the others, so "this
     appears in two places" is visible rather than only stated. Pure
     enhancement: the same fact is in the DOM as text for everyone. */
  const [linked, setLinked] = useState<string | null>(null);

  return (
    <section id="about" className="py-24 px-6 section-divider band-leaf">
      <div className="mx-auto max-w-5xl">

        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div className="max-w-xl">
            <p className="eyebrow mb-3">Toolkit</p>
            <h2 className="section-heading">Skills</h2>
          </div>
          <p className="skill-count">
            {pad(skills.length)} groups · {pad(TOTAL)} entries
            {SHARED.size > 0 && (
              <>
                {" · "}
                <span className="skill-legend">
                  <i aria-hidden="true" />
                  {pad(SHARED.size)} shared
                </span>
              </>
            )}
          </p>
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
                <span className="count">{pad(items.length)}</span>
              </h3>
              <ul className="skill-list">
                {items.map((skill) => {
                  const key = skill.toLowerCase();
                  const elsewhere = SHARED.get(key)?.filter((c) => c !== category);
                  return (
                    <li
                      key={skill}
                      className="skill-chip"
                      data-shared={Boolean(elsewhere)}
                      data-linked={linked === key}
                      onPointerEnter={elsewhere ? () => setLinked(key) : undefined}
                      onPointerLeave={elsewhere ? () => setLinked(null) : undefined}
                    >
                      {skill}
                      {elsewhere && (
                        <span className="sr-only"> — also in {elsewhere.join(", ")}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
