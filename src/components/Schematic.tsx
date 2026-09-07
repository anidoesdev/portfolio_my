"use client";

import { useEffect, useRef, useState } from "react";

/* Architecture schematics, and the animation that runs them.

   Each project's pipeline as a labelled block diagram, drawn as inline
   SVG in the same line-and-bevel language as the rest of the section —
   and then *executed*: a pulse travels every link in dependency order
   while each box lights as the signal reaches it.

   The animation is not decoration laid over a picture. The picture is
   already a graph, so the run order is derived from it: `depthOf` walks
   the links to find how many hops each box sits from an input, and that
   number becomes the box's light delay and its outgoing links' pulse
   delay. Move a box, add a stage, and the timing follows on its own.

   Coordinates are in viewBox units and the viewBox is ~560 wide, which
   is close to 1:1 with the rendered width of the diagram column. That is
   deliberate: label text is sized in viewBox units, so a much wider
   viewBox would shrink it below legibility. */

export type Box = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  /* Supporting infrastructure rather than a step in the flow. Dim boxes
     never light: nothing flows through them. */
  dim?: boolean;
};

export type Link = {
  from: string;
  to: string;
  /* h    — left to right, elbowing at the midpoint if the rows differ
     down — straight down from one box into the one below it
     wrap — down, back across, and into the start of the next row
     tie  — a dashed connection with no arrow, for shared state */
  route?: "h" | "down" | "wrap" | "tie";
  /* wrap only: the y of the corridor it travels back along */
  corridor?: number;
};

export type Diagram = {
  w: number;
  h: number;
  /* A plain-language reading of the diagram, for anyone who cannot see
     it. The boxes carry SVG <text>, but their arrangement is the
     meaning and that does not survive being read out. */
  alt: string;
  boxes: Box[];
  links: Link[];
};

/* One hop per step. Distill and Synthesis are the deepest at six hops,
   so a full run is about 2.8s. */
const STEP = 0.38;
const PULSE = 0.5;

const cx = (b: Box) => b.x + b.w / 2;
const cy = (b: Box) => b.y + b.h / 2;
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

function path(boxes: Record<string, Box>, link: Link): string {
  const a = boxes[link.from];
  const b = boxes[link.to];
  if (!a || !b) return "";

  const route = link.route ?? "h";

  if (route === "down" || route === "tie") {
    /* Drop from the lower edge of the upper box into the upper edge of
       the lower one, at an x both boxes actually span. */
    const [top, bottom] = a.y <= b.y ? [a, b] : [b, a];
    const x = clamp(cx(top), bottom.x + 8, bottom.x + bottom.w - 8);
    return `M ${x} ${top.y + top.h} L ${x} ${bottom.y}`;
  }

  if (route === "wrap") {
    const corridor = link.corridor ?? (a.y + a.h + b.y) / 2;
    const x2 = clamp(cx(b), b.x + 8, b.x + b.w - 8);
    return `M ${cx(a)} ${a.y + a.h} L ${cx(a)} ${corridor} L ${x2} ${corridor} L ${x2} ${b.y}`;
  }

  /* Left to right. Straight if the rows line up, elbowed if not. */
  const y1 = cy(a);
  const y2 = cy(b);
  const x1 = a.x + a.w;
  const x2 = b.x;
  if (Math.abs(y1 - y2) < 1) return `M ${x1} ${y1} L ${x2} ${y2}`;
  const mid = (x1 + x2) / 2;
  return `M ${x1} ${y1} L ${mid} ${y1} L ${mid} ${y2} L ${x2} ${y2}`;
}

/* How many hops each box sits from an input. Ties are excluded — a
   shared memory layer is not a stage in the flow — and a `seen` guard
   keeps a cycle from recursing forever if one is ever added. */
function depthOf(diagram: Diagram): Record<string, number> {
  const parents: Record<string, string[]> = {};
  for (const b of diagram.boxes) parents[b.id] = [];
  for (const l of diagram.links) {
    if (l.route === "tie") continue;
    parents[l.to]?.push(l.from);
  }

  const memo: Record<string, number> = {};
  const seen = new Set<string>();

  function walk(id: string): number {
    if (memo[id] !== undefined) return memo[id];
    if (seen.has(id)) return 0;
    seen.add(id);
    const up = parents[id] ?? [];
    const d = up.length === 0 ? 0 : Math.max(...up.map(walk)) + 1;
    memo[id] = d;
    return d;
  }

  for (const b of diagram.boxes) walk(b.id);
  return memo;
}

/* How long a full run of this diagram takes, in seconds. Exported so the
   folder can time its auto-advance off the animation actually finishing
   rather than off a number typed in two places. */
export function runDuration(diagram: Diagram): number {
  const depths = Object.values(depthOf(diagram));
  const deepest = depths.length ? Math.max(...depths) : 0;
  return deepest * STEP + PULSE;
}

export default function Schematic({
  diagram,
  runId = 0,
}: {
  diagram: Diagram;
  /* Bumped when the folder opens, and by its RUN control, to replay. */
  runId?: number;
}) {
  const ref = useRef<SVGSVGElement | null>(null);
  const [autoId, setAutoId] = useState(0);

  /* Run once, the first time the diagram is properly on screen. Nothing
     animates on page load for a folder nobody has opened yet. */
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            io.disconnect();
            setAutoId(1);
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const byId: Record<string, Box> = {};
  for (const b of diagram.boxes) byId[b.id] = b;
  const depth = depthOf(diagram);

  const armed = runId > 0 || autoId > 0;
  /* Remounting is what restarts the CSS animations: without a fresh
     element the delays have already elapsed and a replay does nothing. */
  const runKey = `${runId}:${autoId}`;
  const arrowId = `schem-arrow-${diagram.w}-${diagram.h}`;

  return (
    <svg
      ref={ref}
      className="schem-svg"
      viewBox={`0 0 ${diagram.w} ${diagram.h}`}
      role="img"
      aria-label={diagram.alt}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker
          id={arrowId}
          viewBox="0 0 8 8"
          refX="7"
          refY="4"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L8 4 L0 8 z" className="schem-arrow" />
        </marker>
      </defs>

      <g key={runKey} className={armed ? "schem-run" : undefined}>
        {diagram.links.map((l, i) => {
          const d = path(byId, l);
          const tie = l.route === "tie";
          const delay = `${(depth[l.from] ?? 0) * STEP}s`;
          return (
            <g key={`${l.from}-${l.to}-${i}`}>
              <path
                d={d}
                className={tie ? "schem-tie" : "schem-link"}
                markerEnd={tie ? undefined : `url(#${arrowId})`}
              />
              {/* The travelling pulse. `pathLength="1"` normalises every
                  path to the same length, so one dash pattern works on a
                  short hop and a long wrap alike. */}
              {!tie && (
                <path
                  d={d}
                  pathLength={1}
                  className="schem-pulse"
                  style={{ ["--delay" as string]: delay, ["--dur" as string]: `${PULSE}s` }}
                />
              )}
            </g>
          );
        })}

        {diagram.boxes.map((b) => (
          <g
            key={b.id}
            className={b.dim ? "schem-box schem-box-dim" : "schem-box"}
            style={{ ["--delay" as string]: `${(depth[b.id] ?? 0) * STEP}s` }}
          >
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="2" />
            <text x={cx(b)} y={b.sub ? b.y + b.h / 2 - 1 : cy(b) + 5} className="schem-label">
              {b.label}
            </text>
            {b.sub && (
              <text x={cx(b)} y={b.y + b.h / 2 + 11} className="schem-sub">
                {b.sub}
              </text>
            )}
          </g>
        ))}
      </g>
    </svg>
  );
}
