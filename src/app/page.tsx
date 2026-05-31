import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Achievements from "@/components/Achievements";
import Projects from "@/components/Projects";
import Contributions from "@/components/Contributions";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Experience />
        <Skills />
        <Achievements />
        <Contributions />
        <Contact />
      </main>
    </>
  );
}
