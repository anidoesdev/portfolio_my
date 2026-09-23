"use client";

import { useEffect, useRef, useState } from "react";

/* The visitor count, as an odometer.

   The count has to live somewhere outside this repo — a number that
   survives a deploy is state, and a statically rendered page has none.
   It is kept by a hosted counter (abacus), which is free, needs no
   account and sends `access-control-allow-origin: *`, so the browser can
   read it directly.

   All three parts are environment-overridable because that service is
   someone's side project with no uptime promise: if it goes away, point
   `NEXT_PUBLIC_VISITS_HOST` at anything that answers
   `/hit/<ns>/<key>` and `/get/<ns>/<key>` with `{"value": n}`.

   Worth knowing: the counter is public and unauthenticated. Anyone who
   finds the URL can inflate it, and it counts page loads by bots too.
   It is a piece of the page's character, not analytics. */
const HOST =
  process.env.NEXT_PUBLIC_VISITS_HOST ?? "https://abacus.jasoncameron.dev";
const NAMESPACE = process.env.NEXT_PUBLIC_VISITS_NAMESPACE ?? "anidoes-dev";
const KEY = process.env.NEXT_PUBLIC_VISITS_KEY ?? "visits";

/* One increment per browser session, not per page load. `hit` raises the
   count and returns it; `get` only reads. Without this, scrolling away
   and coming back would count as another person. */
const COUNTED = "anidoes:visit-counted";

export default function Visitors() {
  const [count, setCount] = useState<number | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    /* Strict Mode runs effects twice in development, and the first of
       those two runs is the one that would increment. */
    if (ran.current) return;
    ran.current = true;

    let alive = true;
    let counted = false;
    /* Private windows and blocked site data throw on access rather than
       returning null, so this cannot be a bare read. */
    try {
      counted = sessionStorage.getItem(COUNTED) === "1";
    } catch {}

    fetch(`${HOST}/${counted ? "get" : "hit"}/${NAMESPACE}/${KEY}`, {
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { value?: number } | null) => {
        if (!alive || typeof data?.value !== "number") return;
        setCount(data.value);
        try {
          sessionStorage.setItem(COUNTED, "1");
        } catch {}
      })
      /* A counter that cannot be read renders nothing at all. The one
         thing it must never do is show a number it made up. */
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, []);

  if (count === null) return null;

  /* Padded to four so the row keeps its width as the count climbs, and
     so it reads as a mechanical counter rather than a tally. */
  const digits = String(count).padStart(4, "0").split("");

  return (
    <p className="visits">
      <span className="odometer" aria-hidden="true">
        {digits.map((d, i) => (
          <span key={i} className="digit">
            {d}
          </span>
        ))}
      </span>
      {/* The digits are cells to look at; this is the number to hear. */}
      <span className="sr-only">{count}</span>
      <span className="label">people have wandered through</span>
    </p>
  );
}
