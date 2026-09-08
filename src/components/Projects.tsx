"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Schematic, { runDuration } from "./Schematic";
import { ARCHITECTURES, DRAFT } from "./architectures";
import {
  getSound,
  getSoundOnServer,
  playUnfile,
  setSound,
  subscribeSound,
} from "./unfileSound";

type Project = {
  title: string;
  /* A one-line summary, under the name in the open folder. */
  kicker: string;
  description: string;
  tags: string[];
  liveUrl: string;
  codeUrl: string;
  youtubeUrl?: string;
};

const productionProjects: Project[] = [
  {
    title: "Papyrus",
    kicker: "Cited answers from scientific papers",
    description:
      "Built a full-stack Retrieval-Augmented Generation (RAG) system for scientific literature Q&A, enabling users to ask natural-language questions and receive cited, grounded answers backed by source documents.Combines dense vector search and keyword retrieval through reciprocal rank fusion, reranks candidates with an LLM relevance scorer, and synthesizes grounded answers with inline citations.",
    tags: ["Reciprocal Rank Fusion (RRF)", "Document Ingestion Pipelines", "Production RAG", "Cross-Encoder Reranking"],
    liveUrl: "https://papyrus.anidoes.dev",
    codeUrl: "https://github.com/anidoesdev/scientific-rag-assistant.git",
    youtubeUrl: "https://youtu.be/x2GqQqP2aSU",
  },
  {
    title: "Sentinel",
    kicker: "Anomaly detection on factory sensors",
    description:
      "Real-time anomaly detection across vibration, audio, and log streams from industrial equipment. Fuses a VAE on time-series sensors, a CNN on mel-spectrograms, and a text classifier on machine logs into a late-fusion ensemble with SHAP explanations. Kafka ingestion, Triton serving, TimescaleDB storage, and Evidently drift monitoring.",
    tags: ["Anomaly Detection", "Variational Autoencoder (VAE)", "Convolutional Neural Networks", "Apache Kafka", "Time-Series Databases"],
    liveUrl: "https://sentinel.anidoes.dev",
    codeUrl: "https://github.com/anidoesdev/Sentinel.git",
    youtubeUrl: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
  },
  {
    title: "Distill",
    kicker: "A small model that beats frontier APIs",
    description:
      "Fine-tuned a small language model with SFT and DPO to extract structured JSON from scientific papers - authors, methodology, datasets, findings, limitations. Quantized and served with vLLM behind a FastAPI gateway with schema-constrained decoding. Outperforms frontier APIs on accuracy while cutting cost-per-call by an order of magnitude.",
    tags: ["Fine-Tuning", "Qwen 2.5", "TRL", "Paged Attention", "MLOps"],
    liveUrl: "",
    codeUrl: "https://github.com/anidoesdev/distill.git",
    youtubeUrl: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
  },
  {
    title: "Synthesis",
    kicker: "Five agents researching together",
    description:
      "A multi-agent system that answers complex research questions across scientific literature. Five specialized agents - planner, retriever, reader, critic, synthesizer - collaborate through structured memory and tool use, with every decision logged to a custom trajectory viewer. Includes a 50-question eval harness with LLM-as-judge scoring and a hallucination-guard pipeline.",
    tags: ["Multi-Agent Systems", "Agentic AI", "Hallucination Detection", "Distributed Tracing"],
    liveUrl: "",
    codeUrl: "https://github.com/anidoesdev/synthesis.git",
    youtubeUrl: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
  },
];

function hasDemo(url?: string): boolean {
  return Boolean(url) && !url!.includes("YOUR_VIDEO_ID");
}

function isLive(url: string): boolean {
  return Boolean(url) && url !== "#";
}

function getEmbedUrl(url: string): string {
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?rel=0&modestbranding=1`;

  const longMatch = url.match(/[?&]v=([^&]+)/);
  if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}?rel=0&modestbranding=1`;

  if (url.includes("/embed/")) return url;

  return url;
}

/* Counted from the data rather than written down, so the lede cannot
   drift out of step when a project is added. */
const TOTAL = productionProjects.length;
const DEPLOYED = productionProjects.filter((p) => isLive(p.liveUrl)).length;

/* One colour per folder, on its name tag's top strip. */
const TYPE_COLOUR = [
  "var(--label-a)",
  "var(--label-b)",
  "var(--label-c)",
  "var(--label-d)",
];

/* How long the finished diagram sits before the demo takes over, added
   to the animation's own run time. Papyrus runs for ~2s, so a 1s hold
   puts the whole sequence at about 3 seconds. Deeper pipelines still
   get proportionally longer — the hold is a pause, not the total. */
const HOLD = 1;

/* Length of the slide, in ms. Must stay in step with @keyframes
   stageSlideIn / stageSlideOut in globals.css, which is how long the two
   layers are both on screen for. */
const SWAP_MS = 380;

/* What each dot goes to, in order. Also the accessible names for them. */
const STAGES = ["architecture diagram", "demo video"];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export default function Projects() {
  const [active, setActive] = useState(0);
  /* Each folder is a two-stage sequence: 0 is the running schematic,
     1 is the demo video, and the video replaces the diagram in the same
     frame. Stage resets whenever a different folder is opened. */
  const [stage, setStage] = useState(0);
  /* Cancels the countdown that is running right now. It is *not* a
     permanent opt-out: returning to the diagram, or replaying it, arms a
     fresh countdown, so the swap follows the animation every time the
     animation runs. Interacting only cancels the pass in flight. */
  const [paused, setPaused] = useState(false);
  /* Per-project counter that replays that project's pipeline animation. */
  const [runs, setRuns] = useState<Record<string, number>>({});
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  /* True while the stage is mid-swap. The content changes at the pinch
     point, where nothing is visible, so the diagram never dissolves
     into the video — and the iframe's own first paint is hidden too. */
  const [swapping, setSwapping] = useState(false);
  /* The stage on its way out. Both stages are on screen together for the
     length of the slide, which is what lets the outgoing one actually
     travel rather than just disappearing. */
  const [leaving, setLeaving] = useState<number | null>(null);
  /* 1 slides the new content in from the right; -1 reverses it. */
  const [dir, setDir] = useState(1);
  const swapTimers = useRef<number[]>([]);
  /* Read inside swapTo, which is stable so the auto-advance effect does
     not restart every render. */
  const activeRef = useRef(0);
  const swappingRef = useRef(false);
  const stageRef = useRef(0);
  const [inView, setInView] = useState(false);
  const baseId = useId();

  /* Sound is on by default and the choice is remembered per browser. It
     lives in an external store rather than component state so the server
     render and the hydrating client agree. */
  const sound = useSyncExternalStore(subscribeSound, getSound, getSoundOnServer);

  /* The auto-advance is gated on the folder actually being on screen.
     Without this the first folder starts its countdown at page load and
     swaps the diagram out before anyone has scrolled to Projects. */
  useEffect(() => {
    const el = bodyRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Hold the finished diagram for a beat, then show the demo. The delay
     is the animation's own length plus a pause, so a deeper pipeline
     gets proportionally longer rather than being cut off by a fixed
     clock. */
  const current = productionProjects[active];
  const currentReel = hasDemo(current.youtubeUrl);
  const currentDiagram = ARCHITECTURES[current.title];

  activeRef.current = active;
  swappingRef.current = swapping;
  stageRef.current = stage;

  /* The single way the stage ever changes, whether a reader pressed a
     control or the countdown ran out.

     The new stage is mounted immediately and the old one is kept beside
     it for the length of the slide, so the two genuinely pass each other.
     Both layers are direct children of `.stage` with stable keys, which
     is what stops React unmounting and remounting the iframe mid-slide —
     that would refetch the video every time you stepped back. */
  const swapTo = useCallback((next: number, direction?: number) => {
    if (swappingRef.current) return;
    const from = stageRef.current;
    if (from === next) return;

    const apply = () => {
      setStage(next);
      if (next === 0) bump(productionProjects[activeRef.current].title);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply();
      return;
    }

    /* The arrows wrap, so which way the slide travels is not always
       implied by which stage is arriving — the right arrow moves forward
       even when it is going back to stage 0. Callers that know their
       direction say so; the rest derive it. */
    setDir(direction ?? (next > from ? 1 : -1));
    setLeaving(from);
    apply();
    setSwapping(true);
    swapTimers.current.push(
      window.setTimeout(() => {
        setSwapping(false);
        setLeaving(null);
      }, SWAP_MS + 20),
    );
  }, []);

  useEffect(() => {
    /* Captured rather than read in the cleanup: the ref object outlives
       the effect, and the lint rule is right that reading `.current`
       later is a different value than the one this effect saw. */
    const timers = swapTimers.current;
    return () => {
      for (const t of timers) window.clearTimeout(t);
    };
  }, []);

  const countdownMs = currentDiagram ? (runDuration(currentDiagram) + HOLD) * 1000 : 0;
  /* Whether a countdown is running right now. Drives the progress line
     under the stage, so the advance is something you can see coming and
     stop, rather than something that happens to you. */
  const counting = !paused && stage === 0 && inView && currentReel && Boolean(currentDiagram);

  useEffect(() => {
    if (paused || stage !== 0 || !inView || !currentReel || !currentDiagram) return;
    /* Never move content on its own for anyone who asked for less motion. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const t = window.setTimeout(() => swapTo(1), countdownMs);
    return () => window.clearTimeout(t);
  }, [paused, stage, inView, currentReel, currentDiagram, countdownMs, swapTo]);

  const tabId = (i: number) => `${baseId}-tab-${i}`;
  const panelId = (i: number) => `${baseId}-panel-${i}`;

  function bump(title: string) {
    setRuns((r) => ({ ...r, [title]: (r[title] ?? 0) + 1 }));
  }

  /* Opening a folder runs its pipeline. The animation is the reward for
     the click, so it should not need a second one. Stage and hold both
     reset: a freshly opened folder starts at its diagram and is free to
     advance again. */
  /* Clicking a name tag always restarts that folder's sequence: the
     diagram runs from the beginning and a fresh countdown is armed, so
     the jump to the demo follows every click and not only the first.

     There is deliberately no `i === active` early return. Clicking the
     folder you are already in is a request to play it again, and
     returning early there was why a second click did nothing. */
  function open(i: number) {
    if (sound) playUnfile();
    setPaused(false);

    if (i !== active) {
      /* A different folder: reset outright. Any swap still in flight
         belongs to the folder being left, so it is cancelled rather
         than allowed to finish over the new one. */
      for (const t of swapTimers.current) window.clearTimeout(t);
      swapTimers.current = [];
      setSwapping(false);
      setLeaving(null);
      setActive(i);
      setStage(0);
      bump(productionProjects[i].title);
      return;
    }

    if (stage !== 0) {
      /* Same folder, currently showing the demo: slide back, which
         replays the diagram on the way in. */
      swapTo(0);
      return;
    }

    /* Same folder, already on the diagram: just run it again. */
    bump(productionProjects[i].title);
  }

  /* Both arrows always move: right is forward, left is back, and with
     two stages either lands on the other one. Nothing is ever disabled,
     which is what makes a control that only appears when you reach for
     it safe — reaching for one and finding it dead is worse than a loop.
     It also means focus never sits on a control the press just killed,
     so the focus juggling this used to need is gone. */
  function step(direction: number) {
    goStage(stage === 0 ? 1 : 0, direction);
  }

  function goStage(next: number, direction?: number) {
    /* Returning to the diagram restarts its animation, so it arms a new
       countdown — that is what makes the swap follow every run rather
       than only the first. Going the other way there is nothing left to
       count down to. */
    setPaused(next === 1);
    if (sound) playUnfile();
    swapTo(next, direction);
  }

  function run(title: string) {
    /* Replaying the animation arms a countdown too: the swap is what
       happens when the pipeline finishes, however it was started. */
    setPaused(false);
    if (sound) playUnfile();
    bump(title);
  }

  function toggleSound() {
    const next = !sound;
    setSound(next);
    /* Turning it on plays one, so you hear what you just enabled. */
    if (next) playUnfile();
  }

  /* Horizontal tablist: left/right move and open, Home/End jump. */
  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, i: number) {
    const last = TOTAL - 1;
    let next: number | null = null;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;

    if (next === null) return;
    e.preventDefault();
    tabRefs.current[next]?.focus();
    open(next);
  }

  return (
    <section id="projects" className="py-24 px-6 section-divider band-paper">
      <div className="mx-auto max-w-5xl">

        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div className="max-w-xl">
            <p className="eyebrow mb-3">Selected work</p>
            <h2 className="section-heading">Projects</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-fg">
              {TOTAL} systems, end to end — retrieval, anomaly detection, model
              distillation, and multi-agent research. {DEPLOYED} deployed, all open source.
            </p>
          </div>

          <button
            type="button"
            className="audio-toggle"
            aria-pressed={sound}
            onClick={toggleSound}
          >
            <span className="pip" aria-hidden="true" />
            {sound ? "Sound on" : "Sound off"}
          </button>
        </div>

        {/* Name tags along the top, one folder body below. Every tag is
            legible at once — which is the thing the buried pile got
            wrong — and opening one is a single click. */}
        <div
          role="tablist"
          aria-label="Projects"
          className="fold-tabs"
        >
          {productionProjects.map((p, i) => {
            const selected = i === active;
            const live = isLive(p.liveUrl);
            return (
              <button
                key={p.title}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={tabId(i)}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={panelId(i)}
                tabIndex={selected ? 0 : -1}
                onClick={() => open(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="fold-tab"
                style={{ ["--sticker" as string]: TYPE_COLOUR[i % TYPE_COLOUR.length] }}
              >
                <span className="fold-num">{pad(i + 1)}</span>
                {p.title}
                <span
                  className="pip"
                  data-on={live}
                  title={live ? "Deployed" : "Source only"}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>

        {/* Pressing something cancels the countdown in flight. Merely
            hovering no longer does: moving the cursor onto the diagram to
            look at it is the most natural thing to do while waiting, and
            cancelling on that made the jump fire only when the reader
            happened to keep their mouse still.

            These fire on pointerdown, before the click handlers below, so
            a press of Back or Run still re-arms afterwards. Capture
            phase, so it fires however deep the target is. */}
        <div
          ref={bodyRef}
          className="fold-body"
          onPointerDownCapture={() => setPaused(true)}
          onFocusCapture={() => setPaused(true)}
          onKeyDownCapture={() => setPaused(true)}
        >
          {productionProjects.map((p, i) => {
            const live = isLive(p.liveUrl);
            const reel = hasDemo(p.youtubeUrl);
            const diagram = ARCHITECTURES[p.title];
            const onDemo = i === active && stage === 1;

            return (
              <div
                key={p.title}
                id={panelId(i)}
                role="tabpanel"
                aria-labelledby={tabId(i)}
                tabIndex={0}
                hidden={i !== active}
              >
                <div className="proj-body">
                  {/* First in the DOM so the heading leads; moved to the
                      right column visually at lg. */}
                  <div className="proj-text">
                    <h3 className="proj-name">{p.title}</h3>
                    <p className="proj-kicker">{p.kicker}</p>
                    <p className="proj-desc">{p.description}</p>

                    <div className="proj-tags">
                      {p.tags.map((tag) => (
                        <span key={tag} className="proj-tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="proj-actions">
                      <a
                        href={p.codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="proj-key"
                      >
                        Source
                      </a>
                      {live && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="proj-key"
                        >
                          Launch
                        </a>
                      )}
                      {diagram && !onDemo && (
                        <button
                          type="button"
                          className="proj-key proj-run"
                          onClick={() => run(p.title)}
                        >
                          Run
                          <span className="sr-only"> the {p.title} pipeline animation</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {diagram && (
                    <div className="proj-stage">
                      {/* One frame, two stages. It is a fixed 16:9 so the
                          diagram and the video are exactly the same size —
                          otherwise advancing would jolt the page. */}
                      <div
                        className="stage"
                        data-swapping={i === active && swapping}
                        style={{ ["--dir" as string]: String(dir) }}
                      >
                        {/* Keyed siblings, not nested branches: React
                            keeps the iframe alive across the slide. */}
                        {i === active && (stage === 1 || leaving === 1) && (
                          <div
                            key="demo"
                            className="stage-inner"
                            data-dir={stage === 1 ? "in" : "out"}
                          >
                            <div className="stage-video">
                              <iframe
                                src={getEmbedUrl(p.youtubeUrl!)}
                                title={`${p.title} demo`}
                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                loading="lazy"
                                className="absolute inset-0 w-full h-full"
                              />
                              {/* pointer-events: none — the player is under this */}
                              <span className="crt-lines" aria-hidden="true" />
                            </div>
                          </div>
                        )}

                        {i === active && reel && (
                          <>
                            {/* Faded rather than hidden. An iframe swallows
                                pointer events, so hover over the video
                                stage can never reach this element — if
                                these were hidden until hover they would
                                be unreachable there. Fading the chrome
                                and leaving the glyph solid keeps them
                                legible without being loud. */}
                            <button
                              type="button"
                              className="stage-arrow"
                              data-side="left"
                              onClick={() => step(-1)}
                              aria-label={`Previous — ${onDemo ? "architecture diagram" : "demo video"}`}
                            >
                              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                  d="M15 5l-7 7 7 7"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>

                            <button
                              type="button"
                              className="stage-arrow"
                              data-side="right"
                              onClick={() => step(1)}
                              aria-label={`Next — ${onDemo ? "architecture diagram" : "demo video"}`}
                            >
                              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                  d="M9 5l7 7-7 7"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </>
                        )}

                        {(i !== active || stage === 0 || leaving === 0) && (
                          <div
                            key="diagram"
                            className="stage-inner"
                            data-dir={i !== active || stage === 0 ? "in" : "out"}
                          >
                            <figure className="stage-schem">
                              {DRAFT.has(p.title) && (
                                <figcaption className="schem-draft">Draft</figcaption>
                              )}
                              <Schematic diagram={diagram} runId={runs[p.title] ?? 0} />
                            </figure>
                          </div>
                        )}
                      </div>

                      {/* The progress line only exists while a countdown is
                          actually running, so it disappears the instant the
                          reader takes over. */}
                      {i === active && counting && (
                        <div className="stage-timer" aria-hidden="true">
                          <i style={{ ["--ms" as string]: `${countdownMs}ms` }} />
                        </div>
                      )}

                      {/* A two-step nav on a one-step folder is two dead
                          controls. Projects without a reel say so instead. */}
                      {reel ? (
                      <div className="stage-nav">
                          <span className="stage-dots">
                            {STAGES.map((label, n) => {
                              const here = (onDemo ? 1 : 0) === n;
                              return (
                                <button
                                  key={label}
                                  type="button"
                                  className="stage-dot"
                                  data-on={here}
                                  aria-current={here ? "true" : undefined}
                                  aria-label={`Show the ${label}`}
                                  onClick={() => !here && goStage(n)}
                                />
                              );
                            })}
                          </span>
                          <span className="sr-only" aria-live="polite">
                            Step {onDemo ? 2 : 1} of 2: {onDemo ? "demo" : "diagram"}
                          </span>
                        </div>
                      ) : (
                        <p className="stage-note">No demo reel on file yet.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
