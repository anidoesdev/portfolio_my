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
         page rather than GitHub's green dropped into it. */
      theme={{
        light: ["rgba(97, 112, 35, 0.12)", "#dde3ad", "#b6c05a", "#84913a", "#4a5620"],
      }}
    />
  );
}
