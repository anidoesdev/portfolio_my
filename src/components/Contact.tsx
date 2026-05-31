import Image from "next/image";
import pixelImg from "@/images/pixel_img.jpg";

const socials = [
  { label: "GitHub", href: "https://github.com/anidoesdev" },
  { label: "LinkedIn", href: "https://linkedin.com/in/anidoesdev" },
  { label: "Twitter", href: "https://twitter.com/anidoesdev" },
  { label: "Email", href: "mailto:anikajain1307@gmail.com" },
];

export default function Contact() {
  return (
    <section id="contact" className="relative pt-20 pb-32 px-6 section-divider overflow-hidden">
      <Image
        src={pixelImg}
        alt=""
        fill
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-[#1a281c]/75" />
      <div className="relative z-10 mx-auto max-w-xl text-center">

        <p className="text-xs font-medium uppercase tracking-widest text-muted-fg mb-3">Contact</p>
        <h2 className="section-heading text-foreground mb-4">
          {"Let's Connect"}
        </h2>
        <p className="text-muted-fg leading-relaxed mb-10 max-w-sm mx-auto text-[15px]">
          Have a project in mind or just want to chat? My inbox is always open — I&apos;ll get back to you.
        </p>

        <a
          href="mailto:anikajain1307@gmail.com"
          className="inline-flex items-center gap-2 px-7 py-2.5 rounded-lg text-sm font-medium text-foreground transition-all duration-150 hover:opacity-90"
          style={{ background: "#1b2920", border: "1px solid #899f81" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          Say Hello
        </a>

        <div
          className="mt-12 flex justify-center gap-6"
          style={{ borderTop: "1px solid #1b2920", paddingTop: "2rem" }}
        >
          {socials.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-sm text-muted-fg hover:text-foreground transition-colors duration-150"
            >
              {label}
            </a>
          ))}
        </div>

        <p className="mt-10 text-xs text-muted-fg" style={{ opacity: 0.5 }}>
          © {new Date().getFullYear()} Anika Jain — Built with Next.js & Tailwind CSS
        </p>

      </div>
    </section>
  );
}
