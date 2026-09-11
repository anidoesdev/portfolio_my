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

/* The share of the field placed below this rank, as a percentile. Reads
   the same way as the bar under it: more is better, so a strong result
   fills the meter rather than leaving it nearly empty the way "top 7.9%"
   did. One decimal, rounded to nearest — 92.097 is 92.1. */
function percentile(rank: number, outOf: number): number {
  return Math.round(((outOf - rank) / outOf) * 1000) / 10;
}

export default function Achievements() {
  return (
    <section id="achievements" className="py-24 px-6 section-divider band-paper section-screen">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8">
        
          <h2 className="section-heading">Achievements</h2>
        </div>

        <ul className="ach">
          {achievements.map((a) => {
            const ranked = a.rank !== undefined && a.outOf !== undefined;
            const pct = ranked ? percentile(a.rank!, a.outOf!) : null;

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
                        {pct} percentile
                      </p>

                      {/* Filled to the percentile, so the bar is long
                          because the placing is good. Decorative — the
                          figure above and the note below say it. */}
                      <div className="ach-meter" aria-hidden="true">
                        <i style={{ width: `${pct}%` }} />
                      </div>

                      {/* The rank itself, under the percentile it was
                          worked out from — the number people quote, with
                          the field it was placed in. */}
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
