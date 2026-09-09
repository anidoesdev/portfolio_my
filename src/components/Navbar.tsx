"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  getSound,
  getSoundOnServer,
  playUnfile,
  setSound,
  subscribeSound,
} from "./unfileSound";

/* The tone of each mark, stepped along one ramp rather than picked six
   separate times: deep blue at the head of the page, through meadow, to
   forest at the foot. Colour therefore says *how far down the page you
   are*, which is the only thing a position scale has to communicate —
   six unrelated hues would have looked livelier and meant nothing.

   `tone` is the light-ground value and `lit` the dark-ground one. Home
   is dark blue on cream and white on the hero — the two ends of the
   page are the two dark sections, so both take a pale mark, and Home
   reads the way Contact does at the other end.

   Every light-ground tone clears 4.2:1 on cream, which a 3px mark needs
   to be seen at all. */
const navLinks = [
  { label: "Home",       href: "#hero",         tone: "#1d4450", lit: "#fffdf6" },
  { label: "Projects",   href: "#projects",     tone: "#4b7962", lit: "#9ed3b4" },
  { label: "Experience", href: "#experience",   tone: "#5a7338", lit: "#bcd98a" },
  { label: "Skills",     href: "#about",        tone: "#617023", lit: "#cfe07a" },
  { label: "Awards",     href: "#achievements", tone: "#415828", lit: "#dfe6a0" },
  { label: "Contact",    href: "#contact",      tone: "#21402d", lit: "#eef2cf" },
];

/* The two sections that run light-on-dark. The scale flips its whole
   palette over these rather than hiding, so it is on the page the
   entire way down. */
const DARK_GROUND = new Set(["#hero", "#contact"]);

export default function Navbar() {
  const [active, setActive] = useState("#hero");
  /* On by default and remembered per browser. An external store
     rather than component state, so the server render and the
     hydrating client agree on a value localStorage only has on one
     of them. */
  const sound = useSyncExternalStore(subscribeSound, getSound, getSoundOnServer);

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
    /* A scale down the right edge instead of a bar across the foot.

       Six marks, one per section, the one you are in longer and lit in
       its own tone. Hovering the scale brings the names in from the
       right; leaving it takes them away again.

       Two deviations from a plain reveal-on-hover. The **active** name
       stays out at rest — a rail of unlabelled marks tells a reader the
       page has six parts and then refuses to say which one they are
       reading. And the scale never hides: over the hero and Contact it
       flips to a light palette instead. */
    <nav
      aria-label="Sections"
      className="scale"
      data-ground={DARK_GROUND.has(active) ? "dark" : "light"}
    >
      <ul className="scale-list">
        {navLinks.map(({ label, href, tone, lit }) => (
          <li key={href}>
            <a
              href={href}
              aria-current={active === href ? "page" : undefined}
              className="scale-item"
              style={{ ["--tone" as string]: tone, ["--lit" as string]: lit }}
            >
              {/* Sits outside the rail's own width, so the strip the
                  pointer has to find stays narrow and the names cost
                  the layout nothing. */}
              <span className="scale-name">{label}</span>
              <span className="scale-mark" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
