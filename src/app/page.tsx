import { Navigation } from "@/components/navigation";
import { ExperienceProvider } from "@/components/showcase/experience-context";
import { Journey } from "@/components/showcase/journey";
import { PageMotion } from "@/components/showcase/page-motion";
import { Toolkit } from "@/components/showcase/toolkit";
import { LabControls } from "@/components/showcase/lab-controls";
import { ContactActions } from "@/components/showcase/contact";
import { profile } from "@/content/portfolio";
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow">
      <span />
      {children}
    </p>
  );
}
export default function Home() {
  return (
    <ExperienceProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Journey />
      <Navigation />
      <PageMotion>
        <main id="main">
          <section
            className="chapter intro-section"
            id="home"
            aria-labelledby="hero-title"
          >
            <div className="intro-copy">
              <div className="intro-reveal">
                <Eyebrow>Developer / Web & mobile</Eyebrow>
              </div>
              <h1 id="hero-title" className="intro-reveal">
                Nirav
                <br />
                Patel<span>.</span>
              </h1>
              <p className="intro-description intro-reveal">
                A personal space for code,
                <br />
                curiosity, and what comes next.
              </p>
              <div className="intro-actions intro-reveal">
                <a className="button-primary" href="#world">
                  Explore my world <span aria-hidden="true">↗</span>
                </a>
                <a className="quiet-link" href="#about">
                  Meet the person <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>
            <div className="intro-bottom">
              <span className="chapter-stamp">PERSONAL PORTFOLIO / N—P</span>
              <span className="scroll-note">
                <i />
                Scroll. There’s more beneath the surface.
              </span>
              <span className="small-coordinate" aria-hidden="true">
                01 — 05
              </span>
            </div>
            <span className="scene-label" aria-hidden="true">
              <i />A CONNECTION TAKING SHAPE
            </span>
          </section>
          <section
            className="chapter about-section"
            id="about"
            aria-labelledby="about-title"
          >
            <div className="about-layout">
              <div className="about-space" aria-hidden="true">
                <span className="scene-coordinate">
                  A DIFFERENT
                  <br />
                  PERSPECTIVE.
                </span>
              </div>
              <div className="about-copy">
                <div data-reveal>
                  <Eyebrow>A little about me</Eyebrow>
                  <h2 id="about-title">
                    Behind every
                    <br />
                    interface,
                    <br />
                    <span>a person.</span>
                  </h2>
                </div>
                <div className="about-note glass" data-reveal>
                  <div className="note-heading">
                    <span className="live-dot" />
                    Currently working. Still exploring.
                  </div>
                  <p>
                    I’m Nirav, a developer working with web and mobile
                    technologies. This is my own corner of the internet—a place
                    to explore, build, and share more as I go.
                  </p>
                  <p>
                    WordPress, PHP, Flutter, .NET, and Next.js are part of my
                    toolkit. The rest of the story is still taking shape.
                  </p>
                  <div className="note-signature">
                    <span>Nirav Patel</span>
                    <span aria-hidden="true">↗</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section
            className="chapter toolkit-section"
            id="skills"
            aria-labelledby="skills-title"
          >
            <div className="section-heading" data-reveal>
              <div>
                <Eyebrow>Tools, thoughtfully chosen</Eyebrow>
                <h2 id="skills-title">
                  Different tools.
                  <br />
                  <span>Connected thinking.</span>
                </h2>
              </div>
              <p>
                Web, mobile, and what sits between.
                <br />
                Take a closer look at what I work with.
              </p>
            </div>
            <div data-reveal>
              <Toolkit />
            </div>
            <div className="section-foot">
              <span>THE TOOLKIT</span>
              <span>Choose a technology to explore ↗</span>
            </div>
          </section>
          <section
            className="chapter lab-section"
            id="world"
            aria-labelledby="world-title"
          >
            <div className="lab-heading" data-reveal>
              <Eyebrow>A space to experiment</Eyebrow>
              <h2 id="world-title">
                A little less ordinary.
                <br />
                <span>A little more possible.</span>
              </h2>
              <p>What happens when a browser becomes a place to explore?</p>
            </div>
            <div className="lab-stage" aria-hidden="true">
              <span className="lab-cross cross-a">+</span>
              <span className="lab-cross cross-b">+</span>
              <span className="lab-caption">
                LIVE GEOMETRY / REAL CONNECTIONS
              </span>
            </div>
            <div className="lab-bottom">
              <div className="lab-note" data-reveal>
                <span className="experiment-index">EXPERIMENT / 001</span>
                <h3>Connected matter.</h3>
                <p>
                  An original experiment in geometry, light, and motion.
                  <br />
                  Made for this portfolio. Yours to play with.
                </p>
              </div>
              <LabControls />
            </div>
            <div className="project-note" data-reveal>
              <span className="project-note-dot" />
              <p>
                My public work starts here. Real project stories will follow
                when I have work I can share.
              </p>
            </div>
          </section>
          <section
            className="chapter contact-section"
            id="contact"
            aria-labelledby="contact-title"
          >
            <div className="contact-copy">
              <div data-reveal>
                <Eyebrow>Every connection starts somewhere</Eyebrow>
                <h2 id="contact-title">
                  Your next idea.
                  <br />
                  <span>Our first hello.</span>
                </h2>
                <p>
                  A question, an idea, or just a conversation?
                  <br />
                  My inbox is open.
                </p>
              </div>
              <div data-reveal>
                <ContactActions />
              </div>
            </div>
            <footer>
              <a className="wordmark" href="#home" aria-label="Back to top">
                np
                <span className="brand-dot" />
              </a>
              <p>
                © {new Date().getFullYear()} {profile.name}
              </p>
              <span>Built with curiosity. Made to be explored.</span>
              <a href="#home">
                Back to the surface <span aria-hidden="true">↑</span>
              </a>
            </footer>
          </section>
        </main>
      </PageMotion>
    </ExperienceProvider>
  );
}
