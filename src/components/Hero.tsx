import Image from "next/image";
import { Lobster_Two } from "next/font/google";
import pixelImg from "@/images/pixel_img.jpg";
import ScrambledText from "./ScrambledText";

const lobsterTwo = Lobster_Two({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/anidoesdev",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/anidoesdev",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:anikajain1307@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
    >
      <Image
        src={pixelImg}
        alt=""
        fill
        className="object-cover object-center"
        priority
      />

      <div className="absolute inset-0 bg-[#1a281c]/75" />
      <div className="relative z-10 max-w-2xl w-full">
        <ScrambledText />

        <p className={`${lobsterTwo.className} text-lg sm:text-xl font-medium text-foreground mt-1 mb-3`}>
          AI Engineer, shipping models that matter.
        </p>
        <p className={`${lobsterTwo.className} text-sm sm:text-base leading-relaxed text-muted-fg max-w-sm mx-auto mb-8`}>
          Building Intelligent Systems!
        </p>

        {/* Social icon buttons */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {socials.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={label}
              className="icon-btn w-10 h-10 rounded-full flex items-center justify-center text-[#e3ebe6]"
            >
              {icon}
            </a>
          ))}
        </div>

        {/* CTA button */}
        <a
          href="#projects"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ background: "#1b2920", border: "1px solid #899f81", color: "#e3ebe6" }}
        >
          View my work
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      {/* Animated scroll-down arrow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#899f81"
          strokeWidth="2"
          className="w-6 h-6 opacity-60"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
