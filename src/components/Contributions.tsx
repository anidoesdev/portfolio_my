"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import woodLog from "@/images/wood_log.png";

const GitHubCalendar = dynamic(
  () => import("react-github-calendar").then((m) => m.GitHubCalendar),
  { ssr: false }
);

export default function Contributions() {
  return (
    <section id="contributions" className="py-24 px-6 section-divider band-sky">
      <div className="mx-auto max-w-5xl">

        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="eyebrow mb-3">Open source</p>
            <h2 className="section-heading">GitHub Activity</h2>
          </div>
          <Image
            src={woodLog}
            alt=""
            width={130}
            height={130}
            className="object-contain hidden sm:block"
            style={{ mixBlendMode: "multiply" }}
          />
        </div>

        <div
          className="glass-card rounded-2xl p-6 overflow-x-auto"
        >
          <GitHubCalendar
            username="anidoesdev"
            blockSize={11}
            blockMargin={4}
            fontSize={11}
            colorScheme="light"
            theme={{
              light: ["rgba(97, 112, 35, 0.12)", "#dde3ad", "#b6c05a", "#84913a", "#4a5620"],
            }}
          />
        </div>

      </div>
    </section>
  );
}
