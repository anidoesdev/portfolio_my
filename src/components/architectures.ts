import type { Diagram } from "./Schematic";

/* One schematic per project, keyed by title.

   Each was drafted from the project's own written description and then
   confirmed by the owner, so all four are published without a stamp.

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
