"use client";

import { useEffect, useState } from "react";

const experiences = [
  {
    period: "June 2026 - August 2026",
    title: "Full Stack Engineer",
    org: "WREN",
    location: "United Kingdom · Remote · Full-time",
    details: [
        "Sole engineer on a contracted MVP build for a UK children's sleep product: Next.js PWA + Supabase/Postgres, shipped ahead of a 50-family validation study.",
        "Designed the data model and rules engine converting nightly parent logs into one human-reviewed weekly recommendation",
        "Enforced consent, age gating, and row-level security (RLS) at the database layer; built export, revoke, and wipe flows for UK GDPR and Children's Code compliance",
        "Built the operator review console and the app's shared design-system components"
    ],
  },

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
  {
    period: "Jul 2025 - Dec 2025",
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

/* How long after a role ends it still counts as live. */
const RECENT_MONTHS = 2;

const MONTHS = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
];

/* The closing date of a period string, as a timestamp — read off the
   same human text that is printed beside it ("Dec 2025 - May 2026"),
   for the reason isCurrent() is: a separate machine-readable field is
   one more thing that can drift out of agreement with the dates on
   screen.

   The period names a month, not a day, so this returns the *last*
   moment of that month: a role listed as ending "August 2026" was
   still running on the 31st. Null when the tail is not a month and a
   year — "Present" lands here, and isCurrent() has already caught it. */
function periodEnd(period: string): number | null {
  const tail = period.split(/[-–—]/).pop()?.trim() ?? "";
  const parsed = /^([A-Za-z]+)\s+(\d{4})$/.exec(tail);
  if (!parsed) return null;

  const month = MONTHS.indexOf(parsed[1].slice(0, 3).toLowerCase());
  if (month < 0) return null;

  /* Day 0 of the following month is the last day of this one, and the
     Date constructor rolls month 12 over into the next January on its
     own, so December needs no special case. */
  return new Date(Number(parsed[2]), month + 1, 0, 23, 59, 59, 999).getTime();
}

/* Live = still running, or finished inside the last RECENT_MONTHS.

   Both collapse into one comparison: an end date at or past the cutoff
   covers the recently-finished roles, and also covers a role whose
   listed end is still in the future, which is running now whatever the
   period text says. */
function isLive(period: string, now: number): boolean {
  if (isCurrent(period)) return true;

  const end = periodEnd(period);
  if (end === null) return false;

  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - RECENT_MONTHS);
  return end >= cutoff.getTime();
}

export default function Experience() {
  const [expanded, setExpanded] = useState<string | null>(null);

  /* Null until mounted, so the server renders the one thing that cannot
     disagree with the client: the roles whose period says "Present".
     This page is prerendered and revalidates hourly, so its HTML can be
     up to an hour older than the browser reading it — and a build from
     the far side of a month boundary would otherwise light a different
     set of nodes than hydration does. The recently-finished roles join
     in on the first client render instead. */
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => setNow(Date.now()), 0);
    return () => window.clearTimeout(timer);
  }, []);

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
            const live = now === null ? isCurrent(item.period) : isLive(item.period, now);

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
