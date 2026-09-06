import Image from "next/image";
import meadow from "@/images/img.jpg";

const jumpLinks = [
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#about" },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
    >
      <Image
        src={meadow}
        alt=""
        fill
        sizes="100vw"
        placeholder="blur"
        preload
        className="object-cover object-center"
      />

      {/*
        Three stacked layers, painted top-down:
          1. cream fade at the foot, so the hero dissolves into the page
          2. a soft centre pool, guaranteeing text contrast over the bright
             clouds without flattening the corners of the artwork
          3. the flat dim itself
      */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "linear-gradient(180deg, rgba(250,247,234,0) 80%, rgba(250,247,234,0.30) 92%, rgba(250,247,234,0.96) 100%)",
            "radial-gradient(ellipse 72% 58% at 50% 46%, rgba(16,34,24,0.50), rgba(16,34,24,0) 72%)",
            "linear-gradient(180deg, rgba(33,64,45,0.56) 0%, rgba(33,64,45,0.44) 42%, rgba(33,64,45,0.5) 72%, rgba(33,64,45,0.22) 92%, rgba(33,64,45,0) 100%)",
          ].join(", "),
        }}
      />

      <div className="relative z-10 w-full max-w-2xl">
        <p className="eyebrow justify-center mb-5">AI Engineer</p>

        <h1 className="display text-5xl sm:text-7xl text-foreground mb-3">
          Hi, I&apos;m Anika
        </h1>

        <p
          className="display text-xl sm:text-3xl mb-4"
          style={{ color: "#e6ecb4" }}
        >
          Shipping models that matter.
        </p>

        <p className="text-sm sm:text-base leading-relaxed text-muted-fg max-w-md mx-auto mb-10">
          Building intelligent systems — retrieval, agents, and the messy plumbing
          that gets them into production.
        </p>

        <nav aria-label="Jump to section">
          <ul className="flex flex-wrap items-center justify-center gap-3">
            {jumpLinks.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className="glass-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold"
                >
                  {label}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-3.5 h-3.5 opacity-75"
                  >
                    <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Sits above the cream fade so it stays legible; the shadow covers it
          on the frames where the fade has already lightened the backdrop. */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,253,246,0.9)"
          strokeWidth="2.5"
          className="w-6 h-6"
          style={{ filter: "drop-shadow(0 2px 5px rgba(16,34,24,0.75))" }}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
