import Image from "next/image";
import Visitors from "./Visitors";
import footer from "@/images/footer.jpg";

const EMAIL = "anikajain1307@gmail.com";

/* The handle is shown, not hidden behind a word like "GitHub". A reader
   who wants to check where a link goes before clicking it can read it
   off the page. The service itself is named by its logo; `label` is
   what a screen reader says in the logo's place. */
const ICONS = {
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3 6 9 7 9-7" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.913 1.637-1.548 3.37-1.548 3.601 0 4.267 2.37 4.267 4.892v6.299zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  ),
};

const channels = [
  { icon: ICONS.mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
  { icon: ICONS.github, label: "GitHub", value: "github.com/anidoesdev", href: "https://github.com/anidoesdev" },
  { icon: ICONS.linkedin, label: "LinkedIn", value: "linkedin.com/in/anidoesdev", href: "https://linkedin.com/in/anidoesdev" },
  { icon: ICONS.x, label: "X", value: "x.com/anidoesdev", href: "https://x.com/anidoesdev" },
];

export default function Contact() {
  /* Server component, so this is the build's year and never a hydration
     mismatch. The page revalidates hourly, so it cannot go stale. */
  const year = new Date().getFullYear();

  return (
    <section id="contact" className="contact-close section-screen">
      {/* Dusk over still water, and the last thing on the page. It is
          no longer the hero's photograph mirrored, so the mirroring
          went with it — flipping an image that is not a reflection of
          anything else is just a flipped image. */}
      <Image
        src={footer}
        alt=""
        fill
        sizes="100vw"
        className="contact-field"
      />
      <div className="contact-dim" aria-hidden="true" />
      <div className="contact-scan" aria-hidden="true" />

      <div className="contact-inner">
        {/* Not decoration: it says who and what, which is exactly what a
            contact heading says, in the register the rest of the site
            has been speaking in since the boot sequence. */}

        <h2 className="contact-title">Let&apos;s Connect</h2>

        <p className="contact-lede">
          Taking on freelance work: AI agents, automation workflows and
          full-stack web apps, from idea to launch. Also open to full-time
          roles. My inbox is open and I answer everything.
        </p>

        {/* A readout, not a row of pills. The logos sit in a fixed-width
            column, so the values line up without a table or a grid hack. */}
        <ul className="contact-rows">
          {channels.map(({ icon, label, value, href }) => (
            <li key={label} className="contact-row">
              <span className="k" role="img" aria-label={label} title={label}>
                {icon}
              </span>
              <a
                className="v"
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {value}
              </a>
            </li>
          ))}
        </ul>

        {/* Two ways to act on the page, in the order they are usually
            wanted: write to me, or read what I have done. The résumé is
            the quieter of the pair — outlined rather than lit, so the
            two do not compete for the same attention. */}
        <div className="contact-actions">
          <a className="contact-cta" href={`mailto:${EMAIL}`}>
            Say hello
            <span className="arrow" aria-hidden="true">▸</span>
          </a>

          {/* Served from `public/`, and named for what it is: that file
              name is what ends up in the reader's downloads folder. */}
          <a
            className="contact-cta"
            data-tone="ghost"
            href="/anika-jain-resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Résumé
            <span className="arrow" aria-hidden="true">↗</span>
          </a>
        </div>

        {/* Three lines, quietest last: what this is, how many people
            have seen it, and the cursor the page ends on. The framework
            credit that used to sit here said what it was built *with*;
            this says what was actually done, which is the part a reader
            of a portfolio is being asked to judge. */}
        <div className="contact-foot">
          <p className="foot-line">
            © {year} Anika Jain - designed and built from scratch
          </p>

          {/* Renders nothing at all until it has a real number. */}
          <Visitors />

          <p className="foot-sign">
            <span className="prompt" aria-hidden="true">&gt;</span>
            end of transmission
            <span className="caret" aria-hidden="true" />
          </p>
        </div>
      </div>
    </section>
  );
}
