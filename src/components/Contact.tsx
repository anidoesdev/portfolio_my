import Image from "next/image";
import meadow from "@/images/img.jpg";

const socials = [
  { label: "GitHub", href: "https://github.com/anidoesdev" },
  { label: "LinkedIn", href: "https://linkedin.com/in/anidoesdev" },
  { label: "Twitter", href: "https://twitter.com/anidoesdev" },
  { label: "Email", href: "mailto:anikajain1307@gmail.com" },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative pt-28 pb-36 px-6 overflow-hidden"
    >
      {/* Same meadow, mirrored — the page opens and closes on the same field */}
      <Image
        src={meadow}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-bottom scale-x-[-1]"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(250,247,234,1) 0%, rgba(250,247,234,0.72) 16%, rgba(250,247,234,0.14) 52%, rgba(250,247,234,0.30) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-xl">
        <div className="art-panel rounded-[2rem] px-7 py-10 sm:px-12 sm:py-12 text-center">
          <p className="eyebrow justify-center mb-4">Contact</p>

          <h2 className="section-heading mb-4">{"Let's Connect"}</h2>

          <p className="text-muted-fg leading-relaxed mb-9 max-w-sm mx-auto text-[15px]">
            Have a project in mind or just want to chat? My inbox is always open —
            I&apos;ll get back to you.
          </p>

          <a
            href="mailto:anikajain1307@gmail.com"
            className="btn-primary inline-flex items-center gap-2 px-7 py-2.5 rounded-full text-sm font-semibold"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Say Hello
          </a>

          <div
            className="mt-11 flex flex-wrap justify-center gap-3"
            style={{ borderTop: "1px solid var(--border)", paddingTop: "1.75rem" }}
          >
            {socials.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="glass-badge px-3.5 py-1.5 rounded-full text-xs font-medium"
              >
                {label}
              </a>
            ))}
          </div>

          <p className="mt-8 text-xs text-muted-fg" style={{ opacity: 0.7 }}>
            {`© ${new Date().getFullYear()} Anika Jain — Built with Next.js & Tailwind CSS`}
          </p>
        </div>
      </div>
    </section>
  );
}
