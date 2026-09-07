"use client";

import { useId, useRef, useState, useSyncExternalStore } from "react";
import {
  getSound,
  getSoundOnServer,
  playUnfile,
  setSound,
  subscribeSound,
} from "./unfileSound";

type Project = {
  title: string;
  /* A one-line summary. Sits at the head of the viewer pane; the
     listing shows only the file name and its status. */
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

/* Counted from the data rather than written down, so the lede and the
   window's own counter cannot drift when a project is added. */
const TOTAL = productionProjects.length;
const DEPLOYED = productionProjects.filter((p) => isLive(p.liveUrl)).length;

/* File-type colours — the only per-project styling left. The selection
   bar takes this colour and the viewer header carries it as a swatch.
   All four are dark enough to hold cloud-white text at AA. */
const TYPE_COLOUR = [
  "var(--label-a)",
  "var(--label-b)",
  "var(--label-c)",
  "var(--label-d)",
];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export default function Projects() {
  const [active, setActive] = useState(0);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  /* Sound is on by default and the choice is remembered per browser. It
     lives in an external store rather than component state so the server
     render and the hydrating client agree. */
  const sound = useSyncExternalStore(subscribeSound, getSound, getSoundOnServer);

  const tabId = (i: number) => `${baseId}-tab-${i}`;
  const panelId = (i: number) => `${baseId}-panel-${i}`;

  function open(i: number) {
    if (i === active) return;
    if (sound) playUnfile();
    setActive(i);
  }

  function toggleSound() {
    const next = !sound;
    setSound(next);
    /* Turning it on plays one, so you hear what you just enabled. */
    if (next) playUnfile();
  }

  /* Vertical listing: arrows move and open, Home/End jump to the ends. */
  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, i: number) {
    const last = TOTAL - 1;
    let next: number | null = null;

    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;

    if (next === null) return;
    e.preventDefault();
    rowRefs.current[next]?.focus();
    open(next);
  }

  const current = productionProjects[active];
  const currentLive = isLive(current.liveUrl);

  return (
    <section id="projects" className="py-24 px-6 section-divider band-paper">
      <div className="mx-auto max-w-5xl">

        <div className="max-w-xl mb-10">
          <p className="eyebrow mb-3">Selected work</p>
          <h2 className="section-heading">Projects</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-fg">
            {TOTAL} systems, end to end — retrieval, anomaly detection, model
            distillation, and multi-agent research. {DEPLOYED} deployed, all open source.
          </p>
        </div>

        {/* One application window: listing on the left, viewer on the
            right, function keys along the foot. */}
        <div className="nc">
          <div className="nc-bar">
            <span className="path">A:\PROJECTS</span>
            <span className="count">
              {pad(TOTAL)} files · {pad(DEPLOYED)} deployed
            </span>
          </div>

          <div className="nc-panes">

            {/* ---- Listing pane ---- */}
            <div className="nc-pane">
              <div className="nc-pane-head">
                <span>Name</span>
                <span className="right">Status</span>
              </div>

              <div
                role="tablist"
                aria-orientation="vertical"
                aria-label="Projects"
                className="nc-list"
              >
                {productionProjects.map((p, i) => {
                  const selected = i === active;
                  const live = isLive(p.liveUrl);
                  return (
                    <button
                      key={p.title}
                      ref={(el) => {
                        rowRefs.current[i] = el;
                      }}
                      id={tabId(i)}
                      role="tab"
                      type="button"
                      aria-selected={selected}
                      aria-controls={panelId(i)}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => open(i)}
                      onKeyDown={(e) => onKeyDown(e, i)}
                      /* An explicit name keeps the caret glyph and the
                         leader dots out of what a screen reader says. */
                      aria-label={`${p.title} — ${p.kicker}`}
                      className="nc-row"
                      style={{ ["--sticker" as string]: TYPE_COLOUR[i % TYPE_COLOUR.length] }}
                    >
                      <span className="nc-caret" aria-hidden="true">
                        &#9656;
                      </span>
                      <span className="nc-num">{pad(i + 1)}</span>
                      <span className="nc-name">{p.title.toUpperCase()}.PRJ</span>
                      <span className="nc-dots" aria-hidden="true" />
                      <span className="nc-stat" data-on={live}>
                        {live ? "Online" : "Local"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* A file manager's listing runs to the foot of its pane
                  whether or not there are files to fill it. */}
              <div className="nc-list-fill" aria-hidden="true" />
            </div>

            {/* ---- Viewer pane ---- */}
            <div className="nc-pane">
              <div className="nc-pane-head">
                <span
                  className="inline-block w-3 h-3 rounded-sm shrink-0"
                  style={{ background: TYPE_COLOUR[active % TYPE_COLOUR.length] }}
                  aria-hidden="true"
                />
                <span>{current.title.toUpperCase()}.PRJ</span>
                <span className="right">
                  {pad(active + 1)}/{pad(TOTAL)}
                </span>
              </div>

              {/* Every panel stays in the document — only the selected one
                  is shown — so all four read as text to a crawler while
                  just one YouTube frame is ever mounted. */}
              <div className="nc-view">
                {productionProjects.map((p, i) => (
                  <div
                    key={p.title}
                    id={panelId(i)}
                    role="tabpanel"
                    aria-labelledby={tabId(i)}
                    tabIndex={0}
                    hidden={i !== active}
                    className="project-panel"
                  >
                    <p className="nc-kicker">{p.kicker}</p>

                    <div className="crt-well">
                      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                        {hasDemo(p.youtubeUrl) && i === active ? (
                          <iframe
                            src={getEmbedUrl(p.youtubeUrl!)}
                            title={`${p.title} demo`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                            className="absolute inset-0 w-full h-full"
                          />
                        ) : (
                          /* No reel yet — a phosphor plate, not a dead frame */
                          <span className="crt-plate">
                            <span className="name">
                              {p.title.toUpperCase()}
                              <span className="caret" aria-hidden="true" />
                            </span>
                            <span className="sub">No reel on file</span>
                          </span>
                        )}
                        {/* pointer-events: none — a live player sits under this */}
                        <span className="crt-lines" aria-hidden="true" />
                      </div>
                    </div>

                    <div className="media-strip">
                      <span>{hasDemo(p.youtubeUrl) ? "Reel" : "No reel"}</span>
                      <span className={isLive(p.liveUrl) ? "on" : undefined}>
                        {isLive(p.liveUrl) ? "Deployed" : "Source only"}
                      </span>
                      <span className="num">{pad(p.tags.length)} subsystems</span>
                    </div>

                    <p className="mt-3 text-[0.8125rem] text-muted-fg">{p.description}</p>

                    <div className="nc-tags">
                      {p.tags.map((tag) => (
                        <span key={tag} className="nc-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ---- Function keys ----
              The CTAs live here rather than in the viewer body: in this
              metaphor the footer is where actions belong, and repeating
              them would be two sets of controls for the same two links.
              Labels only — browsers reserve the real function keys. */}
          <div className="nc-keys">
            <a
              href={current.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nc-key"
            >
              <span className="n">F4</span> Source
            </a>
            {currentLive ? (
              <a
                href={current.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="nc-key"
              >
                <span className="n">F5</span> Launch
              </a>
            ) : (
              /* Rendered as a span, not a disabled link: an anchor with no
                 href is not a link, and aria-disabled alone would leave it
                 in the tab order announcing itself as one. */
              <span className="nc-key" aria-disabled="true">
                <span className="n">F5</span> Launch
              </span>
            )}
            <button
              type="button"
              className="nc-key"
              aria-pressed={sound}
              onClick={toggleSound}
            >
              <span className="n">F9</span> {sound ? "Sound on" : "Sound off"}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
