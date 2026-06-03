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
    <section id="contributions" className="py-20 px-6 section-divider section-bg">
      <div className="mx-auto max-w-5xl">

        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-fg mb-3">Open Source</p>
            <h2 className="section-heading text-foreground">GitHub Activity</h2>
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
          className="bglass-card rounded-xl p-6 overflow-x-auto"
        >
          <GitHubCalendar
            username="anidoesdev"
            blockSize={11}
            blockMargin={4}
            fontSize={11}
            colorScheme="light"
            theme={{
              light: ["rgba(131, 133, 89, 0.18)", "#c8d4a8", "#8aaa60", "#4a7030", "#2e4820"],
            }}
          />
        </div>

      </div>
    </section>
  );
}
