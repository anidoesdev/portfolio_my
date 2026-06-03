"use client";

import { useState } from "react";
import Image from "next/image";
import leavesPile from "@/images/leaves_pile.png";

const experiences = [
  {
    period: "May 2026 — Present",
    title: "Open Source Contributer",
    org: "Hugging Face",
    location: "Remote",
    details: [],
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
    <section id="experience" className="py-20 px-6 section-divider section-bg">
      <div className="mx-auto max-w-5xl">

        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="section-heading text-foreground">Work Experience</h2>
          </div>
          <Image
            src={leavesPile}
            alt=""
            width={130}
            height={130}
            className="object-contain hidden sm:block"
            style={{ mixBlendMode: "multiply" }}
          />
        </div>

        <div className="max-w-4xl mx-auto">
          {experiences.map((item, idx) => {
            const isOpen = expanded === item.org;
            const isLast = idx === experiences.length - 1;
            return (
              <div key={item.org} className="flex gap-5">
                {/* Timeline spine */}
                <div className="flex flex-col items-center mt-1">
                  <i
                    className="fi fi-ss-tree text-xl leading-none"
                    style={{ color: "#4a7c3f" }}
                  />
                  {!isLast && (
                    <div
                      className="flex-1 w-px mt-1"
                      style={{ background: "rgba(131, 133, 89, 0.45)", minHeight: "2rem" }}
                    />
                  )}
                </div>

                {/* Entry — no box */}
                <div className="flex-1 pb-10">
                  <button
                    onClick={() => setExpanded(isOpen ? null : item.org)}
                    className="w-full flex items-start justify-between gap-4 text-left"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3 min-w-0">
                      <span className="text-xl font-semibold text-foreground">
                        {item.title}
                      </span>
                      <span className="text-base text-muted-fg tabular-nums">
                        {item.period}
                      </span>
                    </div>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`w-4 h-4 text-muted-fg shrink-0 mt-1 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Expanded content */}
                  <div
                    className="overflow-hidden"
                    style={{
                      maxHeight: isOpen ? "2000px" : "0px",
                      transition: "max-height 0.25s ease",
                    }}
                  >
                    <div className="mt-3 space-y-2">
                      <div className="flex flex-wrap items-center gap-2 text-base">
                        <span className="font-medium" style={{ color: "#899f81" }}>
                          {item.org}
                        </span>
                        <span className="text-muted-fg">·</span>
                        <span className="text-muted-fg">{item.location}</span>
                      </div>
    
                      {item.details.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-lg leading-relaxed text-muted-fg">
                          {item.details.map((point, i) => (
                            <li key={i}>{point}</li>
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
