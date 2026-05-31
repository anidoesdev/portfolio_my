import Image from "next/image";
import treasure from "@/images/treasure.png";

const achievements = [
  {
    stat: "",
    label: "GATE",
    description: "All India Rank 5472 out of 69242 in Data Science and Artificial Intelligence (DA) branch. ",
  },
  
];

export default function Achievements() {
  return (
    <section id="achievements" className="py-20 px-6 section-divider section-bg">
      <div className="mx-auto max-w-5xl">

        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-fg mb-3">Highlights</p>
            <h2 className="section-heading text-foreground">Achievements</h2>
          </div>
          <Image
            src={treasure}
            alt="Treasure"
            width={160}
            height={160}
            className="object-contain"
            style={{ mixBlendMode: "multiply" }}
          />
        </div>

        <ul className="flex flex-col items-center gap-4 max-w-2xl mx-auto">
          {achievements.map(({ stat, label, description }) => (
            <li key={label} className="flex items-center gap-3">
              <i
                className="fi fi-ss-gem text-xl leading-none shrink-0"
                style={{ color: "#50c878" }}
              />
              <p className="text-lg text-foreground">
                <span className="font-semibold">{stat} {label}</span>
                <span className="text-muted-fg"> : {description}</span>
              </p>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}
