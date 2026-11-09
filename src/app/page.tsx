import { SwarmHeader } from "@/components/showcase/swarm-header";
import { ExperienceBook } from "@/components/showcase/experience-book";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SwarmHeader />
      <main id="main" tabIndex={-1} aria-label="Portfolio content">
        <ExperienceBook />
      </main>
    </>
  );
}
