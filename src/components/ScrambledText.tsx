"use client";

import { useEffect, useRef, useState } from "react";
import { Lobster_Two } from "next/font/google";

const lobsterTwo = Lobster_Two({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const TEXT = "Hi! I'm Anika";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";

function staticChar(i: number) {
  return CHARS[(i * 7) % CHARS.length];
}

export default function ScrambledText() {
  const [revealed, setRevealed] = useState(0);
  const [scramble, setScramble] = useState<string[] | null>(null);
  const scrambleTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    scrambleTimer.current = setInterval(() => {
      setScramble(
        Array.from({ length: TEXT.length }, () =>
          CHARS[Math.floor(Math.random() * CHARS.length)]
        )
      );
    }, 60);

    let count = 0;
    const revealNext = () => {
      count += 1;
      setRevealed(count);
      if (count < TEXT.length) {
        revealTimer.current = setTimeout(revealNext, 100);
      } else {
        clearInterval(scrambleTimer.current!);
      }
    };
    revealTimer.current = setTimeout(revealNext, 100);

    return () => {
      clearInterval(scrambleTimer.current!);
      clearTimeout(revealTimer.current!);
    };
  }, []);

  const display = TEXT.split("").map((char, i) => {
    if (i < revealed) return char;
    return scramble ? scramble[i] : staticChar(i);
  }).join("");

  return (
    <h1 className={`${lobsterTwo.className} text-5xl sm:text-7xl font-bold tracking-tight text-foreground mb-4`}>
      {display}
    </h1>
  );
}
