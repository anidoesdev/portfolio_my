"use client";

import { useState } from "react";
import Image from "next/image";
import leavesPile from "@/images/leaves_pile.png";

const experiences = [
  {
    period: "May 2026 — Present",
    title: "Freelancer",
    org: "Acme Corp",
    location: "Remote · Full-time",
    shortDesc:
      "Lead the redesign of the customer dashboard, reducing load time by 40% and increasing engagement across key user flows.",
    details:
      "Collaborated with product and design teams to deliver the new dashboard two weeks ahead of schedule. Implemented advanced data visualisation with D3.js, optimised bundle size by 35%, and mentored two junior engineers through code reviews.",
  },
  {
    period: "Dec 2025 — May 2026",
    title: "Back-End Engineer",
    org: "Infosys",
    location: "Mysore · Full-time",
    shortDesc:
      "Built and shipped three client products end-to-end — from API design through to deployed production environments.",
    details:
      "Designed REST APIs with Node.js and Express, set up CI/CD pipelines on GitHub Actions, and integrated third-party services (Stripe, Twilio, Sendgrid). Led database migrations from MongoDB to PostgreSQL for two of the products.",
  },
];

export default function Experience() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="experience" className="py-20 px-6 section-divider section-bg">
      <div className="mx-auto max-w-5xl">

        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-fg mb-3">Career</p>
            <h2 className="section-heading text-foreground">Work Experience</h2>
          </div>
          <Image
            src={leavesPile}
            alt=""
            width={160}
            height={160}
            className="object-contain hidden sm:block"
            style={{ mixBlendMode: "multiply" }}
          />
        </div>

        <div className="max-w-2xl mx-auto">
          {experiences.map((item, idx) => {
            const isOpen = expanded === item.org;
            const isLast = idx === experiences.length - 1;
            return (
              <div key={item.org} className="flex gap-5">
                {/* Timeline spine */}
                <div className="flex flex-col items-center">
                  <i
                    className="fi fi-ss-tree text-xl leading-none"
                    style={{ color: "#4a7c3f" }}
                  />
                  {!isLast && (
                    <div
                      className="flex-1 w-px mt-2"
                      style={{ background: "rgba(131, 133, 89, 0.45)", minHeight: "2rem" }}
                    />
                  )}
                </div>

                {/* Entry card */}
                <div className="flex-1 pb-8">
                  <div className="glass-card rounded-xl overflow-hidden card-hover">
                    {/* Collapsed row — always visible, fully clickable */}
                    <button
                      onClick={() => setExpanded(isOpen ? null : item.org)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3 min-w-0">
                        <span className="text-base font-semibold text-foreground">
                          {item.title}
                        </span>
                        <span className="text-xs sm:text-sm text-muted-fg tabular-nums">
                          {item.period}
                        </span>
                      </div>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`w-4 h-4 text-muted-fg shrink-0 transition-transform duration-200 ${
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
                        maxHeight: isOpen ? "600px" : "0px",
                        transition: "max-height 0.25s ease",
                      }}
                    >
                      <div
                        className="px-5 pb-5 pt-3 border-t space-y-2"
                        style={{ borderColor: "rgba(131, 133, 89, 0.35)" }}
                      >
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <span className="font-medium" style={{ color: "#899f81" }}>
                            {item.org}
                          </span>
                          <span className="text-muted-fg">·</span>
                          <span className="text-muted-fg">{item.location}</span>
                        </div>
                        <p className="text-base leading-relaxed text-muted-fg">{item.shortDesc}</p>
                        <p className="text-base leading-relaxed text-muted-fg">{item.details}</p>
                      </div>
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
