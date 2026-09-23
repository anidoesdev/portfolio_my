import Image from "next/image";
import Visitors from "./Visitors";
import footer from "@/images/footer.jpg";

const EMAIL = "anikajain1307@gmail.com";

/* The handle is shown, not hidden behind a word like "GitHub". A reader
   who wants to check where a link goes before clicking it can read it
   off the page. */
const channels = [
  { key: "MAIL", value: EMAIL, href: `mailto:${EMAIL}` },
  { key: "GITHUB", value: "github.com/anidoesdev", href: "https://github.com/anidoesdev" },
  { key: "LINKEDIN", value: "linkedin.com/in/anidoesdev", href: "https://linkedin.com/in/anidoesdev" },
  { key: "TWITTER", value: "twitter.com/anidoesdev", href: "https://twitter.com/anidoesdev" },
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
          Have a project in mind, or just want to talk? My inbox is open and I
          answer everything.
        </p>

        {/* A readout, not a row of pills. The keys are a fixed 9ch, which
            is one wider than LINKEDIN, so the values line up into a
            column without a table or a grid hack. */}
        <ul className="contact-rows">
          {channels.map(({ key, value, href }) => (
            <li key={key} className="contact-row">
              <span className="k">{key}</span>
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
