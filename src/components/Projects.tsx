import Image from "next/image";
import treeLog from "@/images/stair_case.png";


const productionProjects = [
  {
    title: "Papyrus",
    description:
      "Built a full-stack Retrieval-Augmented Generation (RAG) system for scientific literature Q&A, enabling users to ask natural-language questions and receive cited, grounded answers backed by source documents",
    tags: ["Next.js", "TypeScript", "Prisma", "WebSocket"],
    liveUrl: "https://papyrus.anidoes.dev",
    codeUrl: "https://github.com/anidoesdev/scientific-rag-assistant.git",
    
    youtubeUrl: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
  },
  
];

function getEmbedUrl(url: string): string {
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?rel=0&modestbranding=1`;

  const longMatch = url.match(/[?&]v=([^&]+)/);
  if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}?rel=0&modestbranding=1`;

  if (url.includes("/embed/")) return url;

  return url;
}

function ProjectCard({
  title,
  description,
  tags,
  liveUrl,
  codeUrl,
  
  youtubeUrl,
}: {
  title: string;
  description: string;
  tags: string[];
  liveUrl: string;
  codeUrl: string;
  youtubeUrl?: string;
}) {
  return (
    <div className="glass-card card-hover group flex flex-col rounded-xl overflow-hidden">
      {youtubeUrl && (
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={getEmbedUrl(youtubeUrl)}
            title={`${title} demo`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 w-full h-full"
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors duration-150">
            {title}
          </h3>
          
          
        </div>

        <p className="text-sm leading-relaxed text-muted-fg flex-1 mb-3">{description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="glass-badge px-2.5 py-1 text-xs font-medium rounded-md text-muted-fg"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          {liveUrl !== "#" && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-badge flex-1 text-center py-1.5 rounded-lg text-xs font-medium text-foreground transition-all duration-150 hover:opacity-90"
            >
              Live
            </a>
          )}
          <a
            href={codeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`glass-badge ${liveUrl !== "#" ? "flex-1" : "w-full"} text-center py-1.5 rounded-lg text-xs font-medium text-muted-fg hover:text-foreground transition-all duration-150`}
          >
            Code
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-20 px-6 section-divider section-bg">
      <div className="mx-auto max-w-5xl">

        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="section-heading text-foreground">Projects</h2>
          </div>
          <Image
            src={treeLog}
            alt=""
            width={170}
            height={170}
            className="object-contain hidden sm:block"
            style={{ mixBlendMode: "multiply" }}
          />
        </div>

        {/* Production projects */}
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-fg mb-4"></p>
          <div className="grid sm:grid-cols-2 gap-3">
            {productionProjects.map((p) => (
              <ProjectCard key={p.title} {...p} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
