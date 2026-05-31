"use client";

import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Projects", href: "#projects" },
  { label: "Work", href: "#experience" },
  { label: "Skills", href: "#about" },
  { label: "Achievements", href: "#achievements" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("#hero");

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));

    const handleScroll = () => {
      const trigger = window.scrollY + window.innerHeight * 0.4;
      const sections = ids
        .map((id) => ({ id, el: document.getElementById(id) }))
        .filter((s): s is { id: string; el: HTMLElement } => s.el !== null)
        .sort((a, b) => a.el.offsetTop - b.el.offsetTop);

      let current = sections[0]?.id ?? ids[0];
      for (const { id, el } of sections) {
        if (el.offsetTop <= trigger) current = id;
      }
      setActive(`#${current}`);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <ul
        className="flex items-center gap-0.5 px-2 py-1.5 rounded-xl"
        style={{
          background: "rgba(26,40,28,0.88)",
          border: "1px solid #899f81",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        {navLinks.map(({ label, href }) => (
          <li key={href}>
            <a
              href={href}
              className={`text-sm px-3 py-1.5 rounded-lg transition-all duration-150 block ${
                active === href
                  ? "font-semibold bg-white/15 text-white"
                  : "opacity-60 hover:opacity-90 text-[#e3ebe6]"
              }`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
