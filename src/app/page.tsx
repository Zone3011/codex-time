import { Navigation } from "@/components/navigation";
import { Motion } from "@/components/motion";
import { profile, projects, skills } from "@/content/portfolio";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow">
      <span className="tiny-square" />
      {children}
    </p>
  );
}

export default function Home() {
  return (
    <Motion>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="shell" id="home">
        <Navigation />
        <main id="main">
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-top" data-intro>
              <span className="eyebrow">Developer & creative thinker</span>
              <span className="edition">PORTFOLIO / IN PROGRESS</span>
            </div>
            <h1 id="hero-title" data-intro>
              Good ideas.
              <br />
              <span>Beautifully</span> built<span className="blue-dot">.</span>
            </h1>
            <div className="hero-bottom" data-intro>
              <p>
                I turn complex problems into clear,
                <br className="desktop-break" /> considered digital experiences.
                <br />
                <span>Where engineering meets a good eye.</span>
              </p>
              <a className="round-link" href="#work">
                <span>Explore the work</span>
                <span className="circle-arrow" aria-hidden="true">
                  ↓
                </span>
              </a>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="art-label">IDEA → INTERFACE</div>
              <div className="code-sculpture">
                <span>〈</span>
                <i>✳</i>
                <span>〉</span>
              </div>
              <div className="art-bottom">
                <span>Built with intention.</span>
                <span>Designed to feel right. ↗</span>
              </div>
            </div>
          </section>
          <section
            className="work section"
            id="work"
            aria-labelledby="work-title"
          >
            <div className="section-heading">
              <div>
                <SectionLabel>Selected explorations</SectionLabel>
                <h2 id="work-title">
                  A few things
                  <br />
                  taking shape.
                </h2>
              </div>
              <p>
                Ideas made tangible.
                <br />
                Illustrative concepts, ready for your real work.
              </p>
            </div>
            <div className="projects">
              {projects.map((project, index) => (
                <article className="project" key={project.name}>
                  <div
                    className={"project-art " + project.style}
                    aria-hidden="true"
                  >
                    <span className="project-art-top">
                      {project.name}
                      <span>
                        CONCEPT / {String(index + 1).padStart(2, "0")}
                      </span>
                    </span>
                    <span className="project-glyph">{project.glyph}</span>
                    <span className="project-note">{project.note}</span>
                  </div>
                  <div className="project-title">
                    <h3>{project.name}</h3>
                    <span className="pill">Concept</span>
                  </div>
                  <p className="project-category">{project.category}</p>
                  <p>{project.description}</p>
                  <ul className="tags" aria-label="Technologies">
                    {project.stack.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <details>
                    <summary>
                      About this concept <span aria-hidden="true">+</span>
                    </summary>
                    <p>
                      This is an illustrative portfolio placeholder, not a
                      completed client project. Replace it with a real case
                      study, your contribution, and verified outcomes before
                      publishing.
                    </p>
                  </details>
                </article>
              ))}
            </div>
          </section>
          <section
            className="about section"
            id="about"
            aria-labelledby="about-title"
          >
            <div>
              <SectionLabel>A little about me</SectionLabel>
              <h2 id="about-title">
                Curiosity is
                <br />
                part of the stack.
              </h2>
              <div className="about-signature" aria-hidden="true">
                hello<span>↗</span>
              </div>
            </div>
            <div className="about-copy">
              <p className="large-copy">
                A space for the person
                <br />
                behind the pixels.
              </p>
              <p>
                I’m {profile.name}. This portfolio is a starting point for
                sharing what I build, how I think, and the details I care about.
              </p>
              <p>
                Replace this introduction with your background, interests, and
                approach to building software. Keep it personal, specific, and
                true to you.
              </p>
              <a className="text-link" href="#contact">
                Start a conversation <span aria-hidden="true">↗</span>
              </a>
            </div>
          </section>
          <section className="skills section" aria-labelledby="skills-title">
            <SectionLabel>Tools & approach</SectionLabel>
            <h2 id="skills-title">The building blocks.</h2>
            <p className="section-intro">
              The technologies behind this site and areas to personalize with
              your own expertise.
            </p>
            <div className="skill-grid">
              {skills.map((skill) => (
                <div key={skill.title}>
                  <h3>{skill.title}</h3>
                  <ul>
                    {skill.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
          <section
            className="experience section"
            id="experience"
            aria-labelledby="experience-title"
          >
            <div>
              <SectionLabel>The journey</SectionLabel>
              <h2 id="experience-title">
                Always
                <br />a work in progress.
              </h2>
            </div>
            <div className="timeline">
              <article>
                <span className="timeline-date">NEXT CHAPTER</span>
                <h3>Your experience belongs here.</h3>
                <p>
                  Add your real roles, organizations, dates, and
                  responsibilities. No invented titles. Just the work and what
                  you learned.
                </p>
              </article>
              <article>
                <span className="timeline-date">RIGHT NOW</span>
                <h3>Building this portfolio</h3>
                <p>
                  A Next.js foundation for telling your story, showing your
                  projects, and making your next connection.
                </p>
              </article>
            </div>
          </section>
          <section
            className="contact"
            id="contact"
            aria-labelledby="contact-title"
          >
            <SectionLabel>Have something in mind?</SectionLabel>
            <h2 id="contact-title">
              Let’s make
              <br />
              <span>something matter.</span>
            </h2>
            <div className="contact-bottom">
              <p>
                A good conversation is a great place to start.
                <br />
                <span>Replace the example address before reaching out.</span>
              </p>
              <a href={"mailto:" + profile.email}>
                {profile.email} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </section>
        </main>
        <footer>
          <a className="wordmark" href="#home" aria-label="Back to top">
            yn<span>®</span>
          </a>
          <p>
            © {new Date().getFullYear()} {profile.name}. Built with intention.
          </p>
          <a href="#home">Back to top ↑</a>
        </footer>
      </div>
    </Motion>
  );
}
