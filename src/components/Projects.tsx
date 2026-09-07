"use client";

import { useState, useSyncExternalStore } from "react";
import Schematic from "./Schematic";
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
  /* A one-line summary, under the name in each row. */
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

/* One colour per project, on its index chip. */
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
  /* The only state in the section. There is no selection: every project
     is on screen at once, and a reader who never clicks still sees all
     four and how each one is built. */
  const [demo, setDemo] = useState<string | null>(null);

  /* Sound is on by default and the choice is remembered per browser. It
     lives in an external store rather than component state so the server
     render and the hydrating client agree. */
  const sound = useSyncExternalStore(subscribeSound, getSound, getSoundOnServer);

  function toggleDemo(title: string) {
    if (sound) playUnfile();
    setDemo((open) => (open === title ? null : title));
  }

  function toggleSound() {
    const next = !sound;
    setSound(next);
    /* Turning it on plays one, so you hear what you just enabled. */
    if (next) playUnfile();
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

        {/* Plain articles with real headings — no tablist, no roving
            tabindex, no panels. Everything is visible without clicking,
            which is also the simplest thing for a crawler to read. */}
        <div className="flex flex-col gap-6">
          {productionProjects.map((p, i) => {
            const live = isLive(p.liveUrl);
            const reel = hasDemo(p.youtubeUrl);
            const open = demo === p.title;
            const diagram = ARCHITECTURES[p.title];
            const panelId = `demo-${p.title.toLowerCase()}`;

            return (
              <article
                key={p.title}
                className="proj"
                style={{ ["--sticker" as string]: TYPE_COLOUR[i % TYPE_COLOUR.length] }}
              >
                <div className="proj-bar">
                  <span className="proj-num">{pad(i + 1)}</span>
                  <span className="proj-file">{p.title.toUpperCase()}.PRJ</span>
                  <span className="proj-dots" aria-hidden="true" />
                  <span className="proj-stat" data-on={live}>
                    {live ? "Online" : "Local"}
                  </span>
                </div>

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
                      {reel && (
                        <button
                          type="button"
                          className="proj-key"
                          aria-expanded={open}
                          aria-controls={panelId}
                          onClick={() => toggleDemo(p.title)}
                        >
                          {open ? "Hide demo" : "Demo"}
                        </button>
                      )}
                    </div>
                  </div>

                  {diagram && (
                    <figure className="proj-schem">
                      {DRAFT.has(p.title) && (
                        <figcaption className="schem-draft">Draft</figcaption>
                      )}
                      <Schematic diagram={diagram} />
                    </figure>
                  )}
                </div>

                {/* Mounted only while open, so no project loads a YouTube
                    player a reader did not ask for. */}
                {reel && open && (
                  <div className="crt-well" id={panelId}>
                    <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                      <iframe
                        src={getEmbedUrl(p.youtubeUrl!)}
                        title={`${p.title} demo`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        className="absolute inset-0 w-full h-full"
                      />
                      {/* pointer-events: none — the player sits under this */}
                      <span className="crt-lines" aria-hidden="true" />
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
