"use client";

import { useEffect, useRef } from "react";

/* A power-on self-test over the hero.

   Deliberately server-rendered and driven by CSS animation, not by
   React state: the overlay clears itself after ~1.9s even with
   JavaScript disabled, and the real hero content is always underneath
   it in the DOM, so nothing here affects what a crawler or a reader
   gets. JavaScript adds exactly two things — the skip control, and the
   rule that it only plays once per session.

   The line delays live inline because each line needs its own; the
   dismissal delay lives in `.boot` in globals.css and the two have to
   stay in step. */

const LINES: Array<{ label: string; ok?: string }> = [
  { label: "Anika Jain", ok: "Sys 1.0" },
  { label: "Memory", ok: "OK" },
  { label: "Retrieval", ok: "OK" },
  { label: "Agents", ok: "OK" },
  { label: "Ready" },
];

const SEEN_KEY = "hero-boot";

export default function HeroBoot() {
  const ref = useRef<HTMLDivElement | null>(null);

  /* Written straight to the DOM rather than through state: this is
     syncing with an external system (session storage), and a setState
     here would cost a cascading render on every page load. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    try {
      if (window.sessionStorage.getItem(SEEN_KEY) === "done") {
        el.dataset.skip = "true";
        return;
      }
      window.sessionStorage.setItem(SEEN_KEY, "done");
    } catch {
      /* private mode, blocked storage — it just plays every time */
    }
  }, []);

  return (
    <div ref={ref} className="boot" aria-hidden="true">
      {LINES.map((line, i) => (
        <p
          key={line.label}
          className="boot-line"
          style={{ animationDelay: `${0.1 + i * 0.2}s` }}
        >
          <span>{line.label}</span>
          {line.ok && (
            <>
              <span className="dots" />
              <span className="ok">{line.ok}</span>
            </>
          )}
        </p>
      ))}

      <button
        type="button"
        className="boot-skip"
        tabIndex={-1}
        onClick={() => {
          if (ref.current) ref.current.dataset.skip = "true";
        }}
      >
        Skip
      </button>
    </div>
  );
}
