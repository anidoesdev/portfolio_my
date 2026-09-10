import Image from "next/image";
import meadow from "@/images/img1.jpg";
import HeroBoot from "./HeroBoot";

const jumpLinks = [
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#about" },
];

/* The plate.

   Every value here is already stated somewhere further down the page —
   the four fields are the four project subjects, the stack entries are
   in Skills, the handle is the one Contributions reads from. Nothing in
   this list is a claim the rest of the site does not already make and
   let a reader check.

   Fields rather than sentences because a hero is the one place a reader
   has no context yet: "AI Engineer" answers a question, "passionate
   about building" answers none. */
const plate = [
  {
    term: "Field",
    detail: "Retrieval · Anomaly detection · Distillation · Multi-agent",
  },
  {
    term: "Stack",
    detail: "Python · PyTorch · FastAPI · Docker",
  },
  {
    term: "Source",
    detail: "github.com/anidoesdev",
    href: "https://github.com/anidoesdev",
  },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="hero-close relative min-h-screen flex items-center px-6 overflow-hidden"
    >
      {/* Edge to edge. The artwork is **portrait** (~9:16) and the hero
          is landscape, so `cover` scales it until the width fills and
          then shows a horizontal band of it — on a 1920x1080 screen
          that band is about a third of the picture-s height.

          Which third is the whole question. Centred, it lands on empty
          sky and cuts off just above the cottage; held at 68% it keeps
          the cottage, the path and the meadow, which is the half of
          this painting worth showing. */}
      <Image
        src={meadow}
        alt=""
        fill
        sizes="100vw"
        quality={90}
        placeholder="blur"
        preload
        className="object-cover hero-field"
        style={{ objectPosition: "center 68%" }}
      />

      {/*
        Two stacked layers, painted top-down:
          1. a soft centre pool, guaranteeing text contrast over the bright
             clouds without flattening the corners of the artwork
          2. the flat dim itself

        The cream fade that used to head this list is gone. It painted a
        flat #f4ead6 over the foot of the photograph to dissolve into the
        page, but the page paper is not flat — the body carries three
        fixed washes — so it ended brighter than the paper it met and the
        join read as a bright line. The dissolve is a mask now, shared
        with the photograph above; see .hero-close in globals.css.
      */}
      <div
        className="absolute inset-0 hero-dim"
        style={{
          background: [
            "radial-gradient(ellipse 72% 58% at 50% 46%, rgba(22,40,28,0.50), rgba(22,40,28,0) 72%)",
            "linear-gradient(180deg, rgba(33,64,45,0.56) 0%, rgba(33,64,45,0.44) 42%, rgba(33,64,45,0.5) 72%, rgba(33,64,45,0.22) 92%, rgba(33,64,45,0) 100%)",
          ].join(", "),
        }}
      />

      {/* Plays once per session, clears itself in ~1.9s with or without
          JavaScript, and never runs under prefers-reduced-motion. The
          hero content below is always in the DOM underneath it. */}
      <HeroBoot />

      {/* Left-aligned, not centred. A centred stack is the one hero
          layout every portfolio already has, and ranged-left is what
          lets the plate below read as a column of fields rather than
          six lines of poetry. */}
      <div className="relative z-10 mx-auto w-full max-w-2xl">

        <h1 className="slate-name">Anika Jain</h1>

        <p className="slate-lede">
          I build intelligent systems — retrieval, agents, and the messy
          plumbing that gets them into production.
        </p>

        {/* A definition list, so each label is bound to its value for a
            screen reader rather than the two just happening to sit on
            the same line. */}
        <dl className="slate">
          {plate.map(({ term, detail, href }) => (
            <div key={term} className="slate-row">
              <dt>{term}</dt>
              <dd>
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {detail}
                  </a>
                ) : (
                  detail
                )}
              </dd>
            </div>
          ))}
        </dl>

        {/* Three keys, no icons. Each one used to carry a down-arrow
            that said only what its label already said, and a fourth
            bounced underneath saying it a fifth time. */}
        <nav aria-label="Jump to section" className="slate-jump">
          <ul>
            {jumpLinks.map(({ label, href }) => (
              <li key={href}>
                <a href={href} className="glass-btn">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
