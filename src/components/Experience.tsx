"use client";

import { useState } from "react";

type Detail = string | { client: string; points: string[] };

const experiences: {
  period: string;
  title: string;
  org: string;
  location: string;
  details: Detail[];
}[] = [
  {
    period: "Sep 2026 – Present",
    title: "Freelance Web & AI Automation Engineer",
    org: "Self-employed",
    location: "Remote · Freelance",
    details: [
      {
        client: "Australian Client (Confidential)",
        points: [
          "Optimising an AI agent inside a production web application for reliability, accuracy and cost.",
        ],
      },
      {
        client: "Mystical Numbers · India",
        points: [
          "Designed and built the business website from scratch, with SEO and mobile-first design.",
          "Built a paid registration funnel: ad → landing page → Razorpay payment → instant WhatsApp group access, with the post-payment flow automated via n8n/Make and Meta Pixel tracking.",
        ],
      },
    ],
  },

  {
    period: "May 2026 – Present",
    title: "Open Source Contributor",
    org: "Hugging Face · TRL",
    location: "Remote",
    details: ["Fixed the _get_train_sampler docstring in TRL's GRPOTrainer to document the behaviour when num_iterations > 1, resolving an open issue."],
  },

  {
    period: "Jun 2026 – Aug 2026",
    title: "Full Stack Engineer",
    org: "WREN",
    location: "United Kingdom · Remote · Full-time",
    details: [
        "Sole engineer on a contracted MVP build for a UK children's sleep product: Next.js PWA + Supabase/Postgres, shipped ahead of a 50-family validation study.",
        "Designed the data model and rules engine converting nightly parent logs into one human-reviewed weekly recommendation.",
        "Enforced consent, age gating, and row-level security (RLS) at the database layer; built export, revoke, and wipe flows for UK GDPR and Children's Code compliance.",
        "Built the operator review console and the app's shared design-system components."
    ],
  },
  
  {
    period: "Dec 2025 – May 2026",
    title: "Data Science Trainee",
    org: "Infosys",
    location: "Mysore · Full-time",
    details: [
        "Tuned loss functions and optimizers for custom machine learning models, grounded in the underlying linear algebra, calculus and probability, to improve accuracy over standard baselines.",
        "Trained and evaluated deep learning models in PyTorch and TensorFlow, optimising the training loop to cut training time on large datasets.",
        "Built an end-to-end AI research pipeline that processes unstructured scientific data and automates pattern extraction, reducing manual analysis.",
        "Implemented graph-based neural network architectures directly from research papers for highly relational data.",
        "Built data ingestion and feature engineering workflows, and ran model evaluation, hyperparameter tuning and ablation studies to set reliable baselines.",
    ],
  },
  {
    period: "Jul 2025 – Dec 2025",
    title: "Full Stack Engineer",
    org: "TripHexa",
    location: "Remote · Full-time",
    details: [
        "Took the product from zero to a working MVP in 3 months, owning the organizer dashboard, data model, and deployment pipeline.",
        "Designed a Trip Template + Cohorts data model enabling organizers to manage dozens of departures, prices, and occupancies per template with zero data duplication.",
        "Built a custom abstraction layer over Firebase/Firestore providing ACID-like transactional guarantees and schema validation on a NoSQL store (no ORM available).",
        "Shipped lead capture, booking, and payment flows that replaced manual spreadsheet workflows and readied the product for Razorpay and WhatsApp integrations.",
        "Built a reusable Next.js + Tailwind component library, cutting new dashboard view delivery from days to hours.",
    ],
  },
];

/* A role that has not ended yet, read off the period rather than stored
   separately so it cannot contradict the dates printed beside it.

   There used to be an 'Active' chip in the meta line saying the same
   thing a few pixels away from the dates that already said it. */
function isCurrent(period: string): boolean {
  return /present|current/i.test(period);
}

export default function Experience() {
  const [expanded, setExpanded] = useState<string | null>(null);


  return (
    <section id="experience" className="py-24 px-6 section-divider band-sky section-screen" data-align="top">
      <div className="mx-auto max-w-5xl">

        <div className="mb-12">
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
            const live = isCurrent(item.period);

            return (
              <li key={item.org} className="quest-item" data-open={isOpen} data-live={live}>
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
                    </span>
                  </span>

                  {/* A plus that becomes a minus: the upright stroke
                      collapses on open. Drawn rather than typed — the
                      caret was a VT323 glyph, so its weight and its
                      position on the line were whatever the face
                      decided, and it could not be aligned with anything
                      around it. */}
                  <span className="quest-toggle" aria-hidden="true">
                    <svg viewBox="0 0 16 16" focusable="false">
                      <path d="M3.5 8h9" />
                      <path className="bar" d="M8 3.5v9" />
                    </svg>
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
                        {item.details.map((point, i) =>
                          typeof point === "string" ? (
                            <li key={i} className="log-detail">
                              {point}
                            </li>
                          ) : (
                            /* One client per group: the name is the
                               highlight, its points sit indented below. */
                            <li key={i} className="log-client">
                              <span className="log-client-name">{point.client}</span>
                              <ul className="log-client-points">
                                {point.points.map((sub, j) => (
                                  <li key={j} className="log-detail">
                                    {sub}
                                  </li>
                                ))}
                              </ul>
                            </li>
                          )
                        )}
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
