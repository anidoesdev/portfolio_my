"use client";

import { useEffect } from "react";
import { getSound, playUnfile } from "./unfileSound";

/* Every control on the site clicks, handled in one place.

   Delegated from the document rather than wired into each component:
   the alternative is an onClick on every button, link and tab in the
   project, which is a line to forget on the next one added. This
   listens in the capture phase, so a handler that stops propagation
   (the folder tabs do) cannot silence it.

   Opt a control out with `data-no-click` — on the element or any
   ancestor. The sound toggle in the navbar uses it, because it manages
   its own feedback. */

const INTERACTIVE = [
  "button",
  "a[href]",
  "summary",
  '[role="button"]',
  '[role="tab"]',
  'input[type="button"]',
  'input[type="submit"]',
].join(",");

function target(from: EventTarget | null): HTMLElement | null {
  if (!(from instanceof Element)) return null;
  const el = from.closest<HTMLElement>(INTERACTIVE);
  if (!el) return null;
  if (el.closest("[data-no-click]")) return null;
  /* A control that cannot be activated should not sound like it was.
     `aria-disabled` matters as much as `disabled` here: the project keys
     use it with `pointer-events: none`, and nothing else marks them. */
  if (el.hasAttribute("disabled")) return null;
  if (el.getAttribute("aria-disabled") === "true") return null;
  return el;
}

export default function ClickSound() {
  useEffect(() => {
    /* Pointer *down*, not click. The keys press in on :active, and a
       sound that arrived on release would lag the visual by the length
       of the press. */
    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      if (!target(e.target)) return;
      if (getSound()) playUnfile();
    };

    /* Keyboard activation never fires a pointer event, so it is handled
       separately — otherwise tabbing through the site is silent while
       clicking through it is not. */
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key !== "Enter" && e.key !== " ") return;
      const el = target(e.target);
      if (!el) return;
      /* Space scrolls a link rather than following it; only Enter
         activates one, so only Enter should sound. */
      if (e.key === " " && el.tagName === "A") return;
      if (getSound()) playUnfile();
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, []);

  return null;
}
