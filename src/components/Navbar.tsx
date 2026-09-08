"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  getSound,
  getSoundOnServer,
  playUnfile,
  setSound,
  subscribeSound,
} from "./unfileSound";

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
  /* On by default and remembered per browser. An external store
     rather than component state, so the server render and the
     hydrating client agree on a value localStorage only has on one
     of them. */
  const sound = useSyncExternalStore(subscribeSound, getSound, getSoundOnServer);
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

  function toggleSound() {
    const next = !sound;
    setSound(next);
    /* Turning it on plays one, so you hear the thing you just
       enabled. Turning it off is silent, which is the point. This is
       why the button carries `data-no-click`: the global listener
       would otherwise sound the click that switches sound off. */
    if (next) playUnfile();
  }

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
        {navLinks.map(({ label, short, href }) => (
          <li key={href}>
            <a
              href={href}
              aria-current={active === href ? "page" : undefined}
              className="retro-key text-[0.9375rem] px-3 sm:px-3.5 py-1 block whitespace-nowrap"
            >
              <span className="sm:hidden">{short}</span>
              <span className="hidden sm:inline">{label}</span>
            </a>
          </li>
        ))}

        {/* Sits on the same key rail as the links, behind a hairline so
            it reads as a switch rather than a seventh destination.
            Icon only — the label is on the button, not beside it. */}
        <li className="nav-sep" aria-hidden="true" />
        <li>
          <button
            type="button"
            data-no-click
            onClick={toggleSound}
            aria-pressed={sound}
            aria-label="Click sound"
            title={sound ? "Click sound on" : "Click sound off"}
            className="retro-key nav-sound px-2.5 sm:px-3 py-1 block"
          >
            <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" focusable="false">
              {/* Straight edges only, no arcs — the same drawing
                  language as the architecture schematics. */}
              <path d="M2.5 6h2.2L8 3.2v9.6L4.7 10H2.5z" fill="currentColor" />
              {sound ? (
                <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square">
                  <path d="M10.4 5.6 12.4 8l-2 2.4" />
                  <path d="M13 3.8 15 8l-2 4.2" />
                </g>
              ) : (
                <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="square">
                  <path d="M10.8 5.8 14.4 10.2" />
                  <path d="M14.4 5.8 10.8 10.2" />
                </g>
              )}
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
}
