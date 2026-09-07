/* Architecture schematics.

   Each project's pipeline as a labelled block diagram, drawn as inline
   SVG in the same line-and-bevel language as the rest of the section.

   Diagrams are data, not hand-written SVG: a list of boxes with grid
   coordinates and a list of links between them. Three routes cover
   every connection here — a left-to-right elbow, a straight drop, and
   a wrap back to the start of the next row — which is what keeps the
   diagrams editable without redrawing paths by hand.

   Coordinates are in viewBox units and the viewBox is ~560 wide, which
   is close to 1:1 with the rendered width of the viewer pane. That is
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
  /* Supporting infrastructure rather than a step in the flow */
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

export default function Schematic({ diagram }: { diagram: Diagram }) {
  const byId: Record<string, Box> = {};
  for (const b of diagram.boxes) byId[b.id] = b;

  return (
    <svg
      className="schem-svg"
      viewBox={`0 0 ${diagram.w} ${diagram.h}`}
      role="img"
      aria-label={diagram.alt}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker
          id="schem-arrow"
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

      {diagram.links.map((l, i) => (
        <path
          key={`${l.from}-${l.to}-${i}`}
          d={path(byId, l)}
          className={l.route === "tie" ? "schem-tie" : "schem-link"}
          markerEnd={l.route === "tie" ? undefined : "url(#schem-arrow)"}
        />
      ))}

      {diagram.boxes.map((b) => (
        <g key={b.id} className={b.dim ? "schem-box schem-box-dim" : "schem-box"}>
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
    </svg>
  );
}
