import type { Diagram } from "./Schematic";

/* One schematic per project, keyed by title.

   Each was drafted — the first four from the project's own written
   description, Runnel's from its repository (README, design.md and the
   source) — and then confirmed by the owner, so all are published
   without a stamp.

   The mechanism stays in place for whatever comes next: a diagram is a
   claim about work someone did, and it is the kind of claim that gets
   probed in an interview. **A new project's schematic goes into `DRAFT`
   until its owner has actually checked it** — the stamp is not
   decoration, and nobody should clear it on someone else's behalf. */

export const DRAFT = new Set<string>();

export const ARCHITECTURES: Record<string, Diagram> = {
  Papyrus: {
    w: 560,
    h: 168,
    alt:
      "A query and an ingested corpus feed two retrievers in parallel — dense vector " +
      "search and keyword search. Their results are combined by reciprocal rank fusion, " +
      "reranked by a cross-encoder, and synthesised into a grounded, cited answer.",
    boxes: [
      { id: "q", x: 6, y: 12, w: 96, h: 32, label: "Query" },
      { id: "c", x: 6, y: 72, w: 96, h: 32, label: "Corpus", sub: "ingested" },
      { id: "d", x: 134, y: 12, w: 110, h: 32, label: "Dense", sub: "vector" },
      { id: "k", x: 134, y: 72, w: 110, h: 32, label: "Keyword", sub: "sparse" },
      { id: "f", x: 276, y: 42, w: 92, h: 32, label: "RRF", sub: "fusion" },
      { id: "r", x: 400, y: 42, w: 110, h: 32, label: "Rerank", sub: "cross-enc" },
      { id: "a", x: 276, y: 120, w: 234, h: 34, label: "Answer", sub: "grounded + cited" },
    ],
    links: [
      { from: "q", to: "d" },
      { from: "c", to: "k" },
      { from: "d", to: "f" },
      { from: "k", to: "f" },
      { from: "f", to: "r" },
      { from: "r", to: "a", route: "down" },
    ],
  },

  Sentinel: {
    w: 560,
    h: 194,
    alt:
      "Three sensor streams — vibration, audio and machine logs — each go to their own " +
      "model: a variational autoencoder, a CNN over mel-spectrograms, and a text " +
      "classifier. A late-fusion ensemble combines them and SHAP explains the result. " +
      "Kafka, Triton, TimescaleDB and Evidently carry ingestion, serving, storage and " +
      "drift monitoring underneath.",
    boxes: [
      { id: "v", x: 6, y: 8, w: 108, h: 30, label: "Vibration" },
      { id: "au", x: 6, y: 52, w: 108, h: 30, label: "Audio" },
      { id: "lg", x: 6, y: 96, w: 108, h: 30, label: "Logs" },
      { id: "vae", x: 150, y: 8, w: 104, h: 30, label: "VAE" },
      { id: "cnn", x: 150, y: 52, w: 104, h: 30, label: "CNN", sub: "mel-spec" },
      { id: "txt", x: 150, y: 96, w: 104, h: 30, label: "Text clf" },
      { id: "fu", x: 292, y: 52, w: 108, h: 30, label: "Fusion", sub: "late" },
      { id: "sh", x: 428, y: 52, w: 104, h: 30, label: "SHAP" },
      { id: "k1", x: 6, y: 152, w: 126, h: 28, label: "Kafka", dim: true },
      { id: "k2", x: 146, y: 152, w: 126, h: 28, label: "Triton", dim: true },
      { id: "k3", x: 286, y: 152, w: 126, h: 28, label: "Timescale", dim: true },
      { id: "k4", x: 426, y: 152, w: 126, h: 28, label: "Evidently", dim: true },
    ],
    links: [
      { from: "v", to: "vae" },
      { from: "au", to: "cnn" },
      { from: "lg", to: "txt" },
      { from: "vae", to: "fu" },
      { from: "cnn", to: "fu" },
      { from: "txt", to: "fu" },
      { from: "fu", to: "sh" },
    ],
  },

  /* Two ways into one workflow. The assistant's path runs along the top
     and the human's along the bottom, and they meet at the workflow
     itself — the draft reaches it only through Apply, which is the claim
     the whole design rests on: the agent has no tool that writes the live
     graph, so Apply is a step only a person can take. (The approval gates
     in the code are a different mechanism — a pause before destructive
     tool calls inside the loop — and are not what this edge shows.)

     Links only run rightward or down, so the applied draft wraps down
     into the workflow rather than the canvas reaching up to it. */
  Runnel: {
    w: 560,
    h: 194,
    alt:
      "Two paths into one workflow. Along the top, a prompt goes to the assistant's " +
      "agent loop, which edits a copy-on-write draft through validated tools; the draft " +
      "only reaches the workflow once a person applies it. Along the bottom, the Vue 3 " +
      "canvas edits the same workflow directly. The engine walks the workflow graph in " +
      "dependency order across 23 node types. Underneath sit the expression language, " +
      "the Code node's vm sandbox, AES-256-GCM credential encryption and TypeORM storage.",
    boxes: [
      { id: "pr", x: 6, y: 12, w: 84, h: 32, label: "Prompt" },
      { id: "ag", x: 108, y: 12, w: 88, h: 32, label: "Agent", sub: "loop" },
      { id: "tl", x: 214, y: 12, w: 96, h: 32, label: "Tools", sub: "validated" },
      { id: "dr", x: 328, y: 12, w: 108, h: 32, label: "Draft", sub: "copy-on-write" },
      { id: "ap", x: 454, y: 12, w: 100, h: 32, label: "Apply", sub: "human only" },
      { id: "cv", x: 6, y: 104, w: 100, h: 32, label: "Canvas", sub: "Vue 3" },
      { id: "wf", x: 139, y: 104, w: 112, h: 32, label: "Workflow", sub: "graph" },
      { id: "en", x: 284, y: 104, w: 124, h: 32, label: "Engine", sub: "dep. order" },
      { id: "nd", x: 441, y: 104, w: 112, h: 32, label: "Nodes", sub: "23 types" },
      { id: "k1", x: 6, y: 156, w: 126, h: 26, label: "Expressions", dim: true },
      { id: "k2", x: 146, y: 156, w: 126, h: 26, label: "vm sandbox", dim: true },
      { id: "k3", x: 286, y: 156, w: 126, h: 26, label: "AES-256-GCM", dim: true },
      { id: "k4", x: 426, y: 156, w: 126, h: 26, label: "TypeORM", dim: true },
    ],
    links: [
      { from: "pr", to: "ag" },
      { from: "ag", to: "tl" },
      { from: "tl", to: "dr" },
      { from: "dr", to: "ap" },
      { from: "ap", to: "wf", route: "wrap", corridor: 74 },
      { from: "cv", to: "wf" },
      { from: "wf", to: "en" },
      { from: "en", to: "nd" },
    ],
  },

  Distill: {
    w: 560,
    h: 140,
    alt:
      "Scientific papers train a small base model through supervised fine-tuning and " +
      "then DPO. The result is quantised, served with vLLM, and put behind a FastAPI " +
      "gateway that constrains decoding to a schema, producing structured JSON.",
    boxes: [
      { id: "p", x: 6, y: 12, w: 96, h: 30, label: "Papers" },
      { id: "s", x: 126, y: 12, w: 76, h: 30, label: "SFT" },
      { id: "dp", x: 222, y: 12, w: 76, h: 30, label: "DPO" },
      { id: "qz", x: 318, y: 12, w: 96, h: 30, label: "Quantise" },
      { id: "vl", x: 434, y: 12, w: 110, h: 30, label: "vLLM", sub: "paged attn" },
      { id: "fa", x: 6, y: 92, w: 150, h: 32, label: "FastAPI", sub: "schema-constrained" },
      { id: "js", x: 186, y: 92, w: 130, h: 32, label: "JSON", sub: "structured" },
    ],
    links: [
      { from: "p", to: "s" },
      { from: "s", to: "dp" },
      { from: "dp", to: "qz" },
      { from: "qz", to: "vl" },
      { from: "vl", to: "fa", route: "wrap", corridor: 66 },
      { from: "fa", to: "js" },
    ],
  },

  Synthesis: {
    w: 560,
    h: 146,
    alt:
      "A question goes to a planner, which drives a retriever, a reader and a critic in " +
      "turn. The four share a common memory and tool layer. A synthesiser produces the " +
      "answer, and every decision is written to a trajectory log.",
    boxes: [
      { id: "q", x: 6, y: 12, w: 92, h: 30, label: "Question" },
      { id: "pl", x: 112, y: 12, w: 92, h: 30, label: "Planner" },
      { id: "rt", x: 218, y: 12, w: 104, h: 30, label: "Retriever" },
      { id: "rd", x: 336, y: 12, w: 88, h: 30, label: "Reader" },
      { id: "cr", x: 438, y: 12, w: 106, h: 30, label: "Critic" },
      { id: "mem", x: 218, y: 56, w: 206, h: 22, label: "Memory + tools", dim: true },
      { id: "sy", x: 6, y: 100, w: 150, h: 32, label: "Synthesiser" },
      { id: "an", x: 186, y: 100, w: 150, h: 32, label: "Answer", sub: "+ trajectory log" },
    ],
    links: [
      { from: "q", to: "pl" },
      { from: "pl", to: "rt" },
      { from: "rt", to: "rd" },
      { from: "rd", to: "cr" },
      { from: "rt", to: "mem", route: "tie" },
      { from: "rd", to: "mem", route: "tie" },
      { from: "cr", to: "sy", route: "wrap", corridor: 88 },
      { from: "sy", to: "an" },
    ],
  },
};
