"use client";

import dynamic from "next/dynamic";

/* react-github-calendar fetches from the browser and renders nothing on
   the server, so it is loaded client-side only. That keeps it out of the
   server bundle and off the critical path — and it is the only reason
   this file is a Client Component; everything else in the section is
   static server output. */
const GitHubCalendar = dynamic(
  () => import("react-github-calendar").then((m) => m.GitHubCalendar),
  { ssr: false },
);

export default function ContributionGraph({ username }: { username: string }) {
  return (
    <GitHubCalendar
      username={username}
      blockSize={11}
      blockMargin={4}
      fontSize={11}
      colorScheme="light"
      /* Five steps of the meadow ramp, so the grid reads as part of the
         page rather than GitHub's green dropped into it.

         The first ramp had #dde3ad at level 1, which composited to within
         a hair of the empty cell — a day with commits looked like a day
         without. Empty is now *lighter* (0.10) so it recedes, and every
         filled step is darker, which widens the one boundary that
         actually carries meaning. Consecutive steps sit at roughly even
         luminance ratios (~1.6x), so no two levels collapse into each
         other further up the scale either. */
      theme={{
        light: ["rgba(97, 112, 35, 0.10)", "#aebb63", "#86953a", "#5e6c22", "#38460f"],
      }}
    />
  );
}
