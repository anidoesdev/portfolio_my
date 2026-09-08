"use client";

import { useState } from "react";

const experiences = [
  {
    period: "May 2026 — Present",
    title: "Open Source Contributer",
    org: "Hugging Face",
    location: "Remote",
    details: ["The docstring of _get_train_sampler in GRPOTrainer comment to mention num_iterations > 1 fixed the existing issue."],
  },
  {
    period: "Dec 2025 - May 2026",
    title: "Data Science Trainee",
    org: "Infosys",
    location: "Mysore · Full-time",
    details: [
        "Engineered and optimized machine learning architectures by applying foundational mathematical principles (linear algebra, multivariate calculus, and probability), enabling the custom tuning of loss functions and optimizers that improved model accuracy by 15% over standard baselines.",
        "Architected, trained, and evaluated complex deep learning models using PyTorch and TensorFlow, specifically optimizing forward and backward passes to reduce training times by 30% and maximize computational efficiency on datasets exceeding 500GB.",
        "Spearheaded the development of an end-to-end AI research pipeline designed to process and synthesize massive, unstructured scientific data, automating the extraction of latent patterns and reducing manual analysis time by 40%.",
        "Implemented advanced neural network architectures, including graph-based models, directly from research papers, mathematically verifying adjacency matrices to accurately capture non-linear relationships and boost predictive performance by 22% on highly relational data.",
        "Constructed robust data ingestion and feature engineering workflows, resolving bottlenecks in data preprocessing to decrease data pipeline latency by 45% and accelerate model convergence during training.",
        "Conducted rigorous model evaluation, hyperparameter optimization, and ablation studies, establishing highly reliable baselines and improving overall inference accuracy by 18% for downstream analytical tasks.",
    ],
  },
];

/* A role that has not ended yet, read off the period rather than stored
   separately so it cannot contradict the dates printed beside it. */
function isCurrent(period: string): boolean {
  return /present|current/i.test(period);
}

export default function Experience() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="experience" className="py-24 px-6 section-divider band-sky">
      <div className="mx-auto max-w-5xl">

        <div className="mb-12">
          <p className="eyebrow mb-3">Where I&apos;ve been</p>
          <h2 className="section-heading">Work Experience</h2>
        </div>

        {/* Role and employer carry the entry; the dates and place sit
            under them as a quiet readout. Everything except the detail
            lines is on screen without opening anything.

            No panel here, unlike Projects and Skills — the air between
            entries is what makes the hierarchy readable, and a box would
            take it back. */}
        <ol className="quest">
          {experiences.map((item) => {
            const isOpen = expanded === item.org;
            const current = isCurrent(item.period);

            return (
              <li key={item.org} className="quest-item" data-open={isOpen} data-current={current}>
                <span className="quest-node" aria-hidden="true" />

                <button
                  onClick={() => setExpanded(isOpen ? null : item.org)}
                  aria-expanded={isOpen}
                  className="quest-head"
                >
                  <span className="quest-lines">
                    <span className="quest-title">
                      {item.title}
                      {/* Colour and the @ carry the employer, not italics:
                          VT323 has no italic face, so an <em> here would
                          be a synthesised slant across a bitmap font. */}
                      <span className="quest-org">@ {item.org}</span>
                    </span>

                    <span className="quest-meta">
                      <span className="date">{item.period}</span>
                      <span aria-hidden="true"> · </span>
                      {item.location}
                      {current && <span className="quest-active">Active</span>}
                    </span>
                  </span>

                  <span className="quest-caret" aria-hidden="true">
                    ▾
                  </span>
                </button>

                {item.details.length > 0 && (
                  /* Grid rows rather than a max-height guess: 0fr to 1fr
                     animates to the content's real height, so a long
                     entry is never clipped by a cap set too low nor left
                     lagging behind one set too high. */
                  <div className="quest-body">
                    <div>
                      <ul className="quest-out">
                        {item.details.map((point, i) => (
                          <li key={i} className="log-detail">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>

      </div>
    </section>
  );
}
