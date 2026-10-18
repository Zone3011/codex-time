import { Navigation } from "@/components/navigation";
import { ExperienceProvider } from "@/components/showcase/experience-context";
import { HeroArtwork } from "@/components/showcase/hero";
import { PhysicsPlayground } from "@/components/showcase/physics";
import { SkillsExplorer } from "@/components/showcase/skills";
import { WorldExperience } from "@/components/showcase/world";
import { StoryLine } from "@/components/showcase/story";
import { ContactActions } from "@/components/showcase/contact";
import { Companion } from "@/components/showcase/companion";
import { profile } from "@/content/portfolio";

function Chapter({
  number,
  children,
  engine,
}: {
  number: string;
  children: React.ReactNode;
  engine: string;
}) {
  return (
    <div className="chapter-label">
      <span>
        <i>{number}</i>
        {children}
      </span>
      <span className="engine-tag">
        {engine} <span aria-hidden="true">↗</span>
      </span>
    </div>
  );
}
export default function Home() {
  return (
    <ExperienceProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
      <main id="main">
        <section
          className="hero section-pad"
          id="home"
          aria-labelledby="hero-title"
        >
          <Chapter number="01" engine="GSAP">
            A small introduction
          </Chapter>
          <div className="hero-layout">
            <div className="hero-copy">
              <p className="eyebrow">NIRAV PATEL / DEVELOPER</p>
              <h1 id="hero-title">
                The web.
                <br />
                With a little
                <br />
                <em>wonder.</em>
                <span className="title-spark" aria-hidden="true">
                  ✳
                </span>
              </h1>
              <p className="hero-description">
                Hi, I’m Nirav. I work with web and mobile technologies.
                <br />
                This is my space to make the browser a little less ordinary.
              </p>
              <a className="pill-link" href="#play">
                Come explore <span aria-hidden="true">↘</span>
              </a>
            </div>
            <HeroArtwork />
          </div>
          <div className="hero-foot">
            <span>NOT JUST A PAGE. A PLACE TO PLAY.</span>
            <span>
              Six experiments. One curious browser.{" "}
              <span aria-hidden="true">↓</span>
            </span>
          </div>
        </section>
        <section
          className="play-section section-pad"
          id="play"
          aria-labelledby="play-title"
        >
          <Chapter number="02" engine="Matter.js">
            A little less serious
          </Chapter>
          <div className="section-intro">
            <h2 id="play-title">
              Ideas need
              <br />
              <em>room to play.</em>
            </h2>
            <p>
              A small experiment in gravity.
              <br />
              Give these shapes a nudge and see what happens.
            </p>
          </div>
          <PhysicsPlayground />
          <div className="section-caption">
            <span>NOT A PROJECT. JUST A PLAYGROUND.</span>
            <span>Drag inside the frame · Scroll outside it</span>
          </div>
        </section>
        <section
          className="skills-section section-pad"
          id="skills"
          aria-labelledby="skills-title"
        >
          <Chapter number="03" engine="Motion">
            The tools behind the ideas
          </Chapter>
          <div className="section-intro">
            <h2 id="skills-title">
              Different tools.
              <br />
              <em>More possibilities.</em>
            </h2>
            <p>
              These are the technologies I work with.
              <br />
              Pick one. Take a closer look.
            </p>
          </div>
          <SkillsExplorer />
        </section>
        <section
          className="world-section section-pad"
          id="world"
          aria-labelledby="world-title"
        >
          <Chapter number="04" engine="Three.js + React Three Fiber">
            A change of dimension
          </Chapter>
          <div className="world-heading">
            <p className="eyebrow">SOME THINGS NEED A LITTLE DEPTH.</p>
            <h2 id="world-title">
              Beyond
              <br />
              <em>the flat.</em>
            </h2>
            <p>
              Light, geometry, and a living surface.
              <br />
              An experiment you can turn in your hands.
            </p>
          </div>
          <WorldExperience />
        </section>
        <section
          className="story-section section-pad"
          id="about"
          aria-labelledby="about-title"
        >
          <Chapter number="05" engine="Anime.js">
            The person behind the play
          </Chapter>
          <div className="section-intro">
            <h2 id="about-title">
              Hi again.
              <br />
              <em>I’m Nirav.</em>
            </h2>
            <p>
              A developer, currently working.
              <br />
              This space grows as I have more to share.
            </p>
          </div>
          <div className="story-track">
            <StoryLine />
            <article>
              <span className="story-node">↗</span>
              <p className="eyebrow">WHERE I AM</p>
              <h3>Working & building.</h3>
              <p>
                My toolkit spans WordPress, PHP, Flutter, .NET, and Next.js. Web
                and mobile, with room to explore.
              </p>
            </article>
            <article>
              <span className="story-node">✳</span>
              <p className="eyebrow">WHAT’S HERE</p>
              <h3>A space of my own.</h3>
              <p>
                This portfolio is my first public entry here. These experiments
                show what a website can feel like.
              </p>
            </article>
            <article>
              <span className="story-node">…</span>
              <p className="eyebrow">WHAT’S NEXT</p>
              <h3>An open chapter.</h3>
              <p>
                No public project case studies yet. I’ll add real work and the
                stories behind it when I can share them.
              </p>
            </article>
          </div>
          <p className="story-signature">
            A little more me, with every update. <span>Nirav</span>
          </p>
        </section>
        <section
          className="contact-section section-pad"
          id="contact"
          aria-labelledby="contact-title"
        >
          <Chapter number="06" engine="canvas-confetti">
            The beginning of a conversation
          </Chapter>
          <div className="contact-layout">
            <div>
              <p className="eyebrow">YOU MADE IT. THANKS FOR EXPLORING.</p>
              <h2 id="contact-title">
                Good things
                <br />
                start with
                <br />
                <em>a hello.</em>
              </h2>
            </div>
            <div className="contact-right">
              <div className="contact-flower" aria-hidden="true">
                ✳
              </div>
              <p>
                A question, an idea, or just a hello?
                <br />
                My inbox is open.
              </p>
              <ContactActions />
            </div>
          </div>
          <footer>
            <a className="wordmark" href="#home" aria-label="Back to top">
              {profile.initials}
              <span>✳</span>
            </a>
            <p>
              © {new Date().getFullYear()} {profile.name}. Made to be explored.
            </p>
            <a href="#home">Back to the beginning ↑</a>
          </footer>
        </section>
      </main>
      <Companion />
    </ExperienceProvider>
  );
}
