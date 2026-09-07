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

export default function Experience() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="experience" className="py-24 px-6 section-divider band-sky">
      <div className="mx-auto max-w-5xl">

        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="eyebrow mb-3">Where I&apos;ve been</p>
            <h2 className="section-heading">Work Experience</h2>
          </div>
          
        </div>

        <div className="max-w-4xl mx-auto">
          {experiences.map((item, idx) => {
            const isOpen = expanded === item.org;
            const isLast = idx === experiences.length - 1;
            return (
              <div key={item.org} className="flex gap-4">
                {/* The log's left rule: a phosphor pip per entry on a
                    dashed spine. */}
                <div className="flex flex-col items-center mt-2.5">
                  <span className="log-pip shrink-0" aria-hidden="true" />
                  {!isLast && <div className="log-spine flex-1 mt-1.5" />}
                </div>

                {/* Entry — no box */}
                <div className="flex-1 pb-8">
                  {/* One log line: timestamp, role, leader dots, employer,
                      and the open/closed marker a console would use. */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : item.org)}
                    aria-expanded={isOpen}
                    className="log-row"
                  >
                    <span className="log-stamp">{item.period}</span>
                    <span className="log-name">{item.title}</span>
                    <span className="log-dots" aria-hidden="true" />
                    <span className="log-status">{item.org}</span>
                    <span className="log-toggle" aria-hidden="true">
                      {isOpen ? "[-]" : "[+]"}
                    </span>
                  </button>

                  {/* Expanded content */}
                  <div
                    className="overflow-hidden"
                    style={{
                      maxHeight: isOpen ? "2000px" : "0px",
                      transition: "max-height 0.25s ease",
                    }}
                  >
                    <div className="mt-2.5 space-y-1.5">
                      {/* The employer has moved up onto the log line
                          itself, so this carries only the location. */}
                      <p className="log-detail">{item.location}</p>
    
                      {item.details.length > 0 && (
                        <ul className="space-y-1.5">
                          {item.details.map((point, i) => (
                            <li key={i} className="log-detail">
                              {point}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
