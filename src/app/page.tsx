import { Navigation } from "@/components/navigation";
import { Motion } from "@/components/motion";
import { profile, skills } from "@/content/portfolio";

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
              <span className="eyebrow">Nirav Patel / Developer</span>
              <span className="edition">MY CORNER OF THE WEB</span>
            </div>
            <h1 id="hero-title" data-intro>
              Nirav
              <br />
              <span>Patel</span>
              <span className="blue-dot">.</span>
            </h1>
            <div className="hero-bottom" data-intro>
              <p>
                I work with WordPress, PHP, Flutter,
                <br className="desktop-break" /> .NET, and Next.js.
                <br />
                <span>This is where I’m putting my own work together.</span>
              </p>
              <a className="round-link" href="#about">
                <span>A little about me</span>
                <span className="circle-arrow" aria-hidden="true">
                  ↓
                </span>
              </a>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="art-label">NIRAV PATEL / WEB + MOBILE</div>
              <div className="code-sculpture">
                <span>〈</span>
                <i>np</i>
                <span>〉</span>
              </div>
              <div className="art-bottom">
                <span>WordPress · PHP · Flutter</span>
                <span>.NET · Next.js ↗</span>
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
                <SectionLabel>My work</SectionLabel>
                <h2 id="work-title">
                  A place for
                  <br />
                  what comes next.
                </h2>
              </div>
              <p>No public projects to share yet.</p>
            </div>
            <div className="work-note">
              <p className="large-copy">The first entry is this portfolio.</p>
              <p>
                I’m building this space a little at a time. As I have projects I
                can share, I’ll add them here with the story behind the work.
              </p>
              <a className="text-link" href="#skills">
                See the technologies I use <span aria-hidden="true">↓</span>
              </a>
            </div>
          </section>
          <section
            className="about section"
            id="about"
            aria-labelledby="about-title"
          >
            <div>
              <SectionLabel>About me</SectionLabel>
              <h2 id="about-title">Hi, I’m Nirav.</h2>
              <div className="about-signature" aria-hidden="true">
                Nirav<span>↗</span>
              </div>
            </div>
            <div className="about-copy">
              <p className="large-copy">
                Working. Building.
                <br />
                Making this space my own.
              </p>
              <p>
                I’m {profile.name}, a developer currently working and using
                WordPress, PHP, Flutter, .NET, and Next.js.
              </p>
              <p>
                This portfolio is growing alongside my work. I’ll keep adding
                more about what I do and the projects I can share.
              </p>
              <a className="text-link" href="#contact">
                Send me an email <span aria-hidden="true">↗</span>
              </a>
            </div>
          </section>
          <section
            className="skills section"
            id="skills"
            aria-labelledby="skills-title"
          >
            <SectionLabel>My toolkit</SectionLabel>
            <h2 id="skills-title">What I work with.</h2>
            <p className="section-intro">
              From WordPress and PHP to Flutter, .NET, and Next.js.
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
              <SectionLabel>Where I am now</SectionLabel>
              <h2 id="experience-title">
                Work &<br />
                what’s next.
              </h2>
            </div>
            <div className="timeline">
              <article>
                <span className="timeline-date">CURRENTLY</span>
                <h3>Working as a developer</h3>
                <p>
                  My toolkit includes WordPress, PHP, Flutter, .NET, and
                  Next.js.
                </p>
              </article>
              <article>
                <span className="timeline-date">IN PROGRESS</span>
                <h3>My own portfolio</h3>
                <p>
                  Building a home for my work, starting with this Next.js site.
                  More to come as I have things to share.
                </p>
              </article>
            </div>
          </section>
          <section
            className="contact"
            id="contact"
            aria-labelledby="contact-title"
          >
            <SectionLabel>Get in touch</SectionLabel>
            <h2 id="contact-title">
              Say hello.
              <br />
              <span>Let’s talk.</span>
            </h2>
            <div className="contact-bottom">
              <p>
                Want to get in touch?
                <br />
                <span>Email is the best way to reach me.</span>
              </p>
              <a href={"mailto:" + profile.email}>
                {profile.email} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </section>
        </main>
        <footer>
          <a className="wordmark" href="#home" aria-label="Back to top">
            {profile.initials}
            <span>↗</span>
          </a>
          <p>
            © {new Date().getFullYear()} {profile.name}. A little more me, with
            every update.
          </p>
          <a href="#home">Back to top ↑</a>
        </footer>
      </div>
    </Motion>
  );
}
