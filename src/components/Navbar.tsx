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
      <ul className="retro-nav flex items-center gap-0 sm:gap-0.5 px-1.5 sm:px-2 py-1.5">
        {navLinks.map(({ label, short, href }, i) => (
          <li key={href}>
            <a
              href={href}
              aria-current={active === href ? "page" : undefined}
              className="retro-key text-[0.9375rem] px-3 sm:px-3.5 py-1 block whitespace-nowrap"
            >
              {/* Labels only. The real F-keys are reserved by browsers
                  (F1 help, F5 reload) and hijacking them would be hostile. */}
              <span className="fkey" aria-hidden="true">
                F{i + 1}
              </span>
              <span className="sm:hidden">{short}</span>
              <span className="hidden sm:inline">{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
