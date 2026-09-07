import Image from "next/image";
import treasure from "@/images/treasure.png";

const achievements = [
  {
    stat: "",
    label: "GATE",
    description: "All India Rank 5472 out of 69242 in Data Science and Artificial Intelligence (DA) branch. ",
  },
  {
    stat: "",
    label: "Agents Course",
    description: "Successfully Completed Agents Course by Hugging Face",
  },
  
];

export default function Achievements() {
  return (
    <section id="achievements" className="py-24 px-6 section-divider band-paper">
      <div className="mx-auto max-w-5xl">

        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="eyebrow mb-3">Highlights</p>
            <h2 className="section-heading">Achievements</h2>
          </div>
          <Image
            src={treasure}
            alt=""
            width={130}
            height={130}
            className="object-contain hidden sm:block"
            style={{ mixBlendMode: "multiply" }}
          />
        </div>

        {/* A power-on self-test: label, leader dots, status. The
            description follows as console output on the next line. */}
        <ul className="grid grid-cols-1 gap-3 max-w-3xl mx-auto">
          {achievements.map(({ stat, label, description }) => (
            <li key={label} className="glass-card px-5 py-4">
              <p className="log-row">
                <span className="log-name">
                  {stat} {label}
                </span>
                <span className="log-dots" aria-hidden="true" />
                <span className="log-status">Pass</span>
              </p>
              <p className="log-detail mt-1.5">{description}</p>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}
