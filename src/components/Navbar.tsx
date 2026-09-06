"use client";

import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home",         short: "Home",     href: "#hero" },
  { label: "Projects",     short: "Projects",  href: "#projects" },
  { label: "Work",         short: "Work",      href: "#experience" },
  { label: "Skills",       short: "Skills",    href: "#about" },
  { label: "Achievements", short: "Awards",    href: "#achievements" },
  { label: "Contact",      short: "Contact",   href: "#contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("#hero");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));

    const handleScroll = () => {
      // Hidden for the whole hero, then slides in as the next section arrives.
      const hero = document.getElementById("hero");
      const heroBottom = hero
        ? hero.offsetTop + hero.offsetHeight
        : window.innerHeight;
      setVisible(window.scrollY > heroBottom - 140);

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
    <nav
      inert={!visible}
      aria-hidden={!visible}
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-1.5rem)] overflow-x-auto transition-[opacity,transform] duration-300 ease-out ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8 pointer-events-none"
      }`}
    >
      <ul
        className="flex items-center gap-0 sm:gap-0.5 px-1.5 sm:px-2 py-1.5 rounded-full"
        style={{
          background: "rgba(255,253,246,0.82)",
          border: "1px solid rgba(97,112,35,0.30)",
          backdropFilter: "blur(16px) saturate(1.1)",
          WebkitBackdropFilter: "blur(16px) saturate(1.1)",
          boxShadow: "0 18px 40px -18px rgba(33,64,45,0.55)",
        }}
      >
        {navLinks.map(({ label, short, href }) => (
          <li key={href}>
            <a
              href={href}
              className={`text-xs sm:text-sm px-3 sm:px-3.5 py-1.5 rounded-full transition-all duration-150 block whitespace-nowrap ${
                active === href
                  ? "font-semibold text-[#fffdf6] bg-[var(--meadow-deep)] shadow-[0_6px_14px_-8px_rgba(33,64,45,0.9)]"
                  : "text-[var(--muted-fg)] hover:text-[var(--terracotta)] hover:bg-[rgba(181,86,24,0.10)]"
              }`}
            >
              <span className="sm:hidden">{short}</span>
              <span className="hidden sm:inline">{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
