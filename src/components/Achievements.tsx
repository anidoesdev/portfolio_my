type Achievement = {
  label: string;
  /* Set when the achievement is a placing, so the card can work out
     where that sits rather than leaving a bare number to be read. */
  rank?: number;
  outOf?: number;
  scope?: string;
  issuer?: string;
  detail: string;
};

/* The GATE result was a sentence — "All India Rank 5472 out of 69242" —
   with its two most useful numbers buried in it. Structured here so the
   card can derive the percentile from them; nothing was added or
   changed, only pulled apart. */
const achievements: Achievement[] = [
  {
    label: "GATE",
    rank: 5472,
    outOf: 69242,
    scope: "All India",
    detail: "Data Science and Artificial Intelligence (DA)",
  },
  {
    label: "Agents Course",
    issuer: "Hugging Face",
    detail: "Completed",
  },
];

/* Thousands separators, done by hand. `toLocaleString()` reads the
   runtime's locale, which is not guaranteed to be the same in Node as in
   the browser — a number that groups differently on the server than on
   the client is a hydration mismatch. */
function group(n: number): string {
  const s = String(n);
  let out = "";
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 === 0) out += ",";
    out += s[i];
  }
  return out;
}

/* Where a rank sits in the field, as a percentage. One decimal: 7.9%
   says something 5472 does not, and the raw numbers stay on the card
   underneath for anyone who wants to check the arithmetic. */
function topPercent(rank: number, outOf: number): number {
  return Math.round((rank / outOf) * 1000) / 10;
}

export default function Achievements() {
  return (
    <section id="achievements" className="py-24 px-6 section-divider band-paper">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8">
          <p className="eyebrow mb-3">Highlights</p>
          <h2 className="section-heading">Achievements</h2>
        </div>

        <ul className="ach">
          {achievements.map((a) => {
            const ranked = a.rank !== undefined && a.outOf !== undefined;
            const pct = ranked ? topPercent(a.rank!, a.outOf!) : null;

            return (
              <li key={a.label} className="ach-card">
                <div className="ach-bar">
                  <span className="name">{a.label}</span>
                  <span className="tag">{ranked ? "Ranked" : "Complete"}</span>
                </div>

                <div className="ach-body">
                  {ranked ? (
                    <>
                      <p className="ach-figure">
                        Top {pct}%
                        <span className="sr-only">
                          {" "}
                          of {group(a.outOf!)} candidates
                        </span>
                      </p>

                      {/* The filled slice is the percentile itself, so the
                          bar is short precisely because the placing is
                          good. Decorative — the numbers below say it. */}
                      <div className="ach-meter" aria-hidden="true">
                        <i style={{ width: `${pct}%` }} />
                      </div>

                      <p className="ach-note">
                        {a.scope} rank <b>{group(a.rank!)}</b> of {group(a.outOf!)}
                      </p>
                    </>
                  ) : (
                    <p className="ach-figure">{a.issuer}</p>
                  )}

                  <p className="ach-detail">{a.detail}</p>
                </div>
              </li>
            );
          })}
        </ul>

      </div>
    </section>
  );
}
