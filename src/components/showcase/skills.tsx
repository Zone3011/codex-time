import { toolkit } from "@/content/toolkit";
import { SkillReveal } from "./skill-reveal";

export function Skills() {
  return (
    <section
      className="skills-section"
      id="skills"
      aria-labelledby="skills-heading"
    >
      <div className="skills-layout">
        <div className="skills-copy">
          <p className="section-eyebrow">
            <span aria-hidden="true">✳</span> THE TOOLKIT
          </p>
          <h2 id="skills-heading">
            A few things
            <br />I keep <em>close.</em>
          </h2>
          <p>
            WordPress, PHP, Flutter, .NET and Next.js are part of my toolkit.
            From websites to app interfaces, these are the tools I work with.
          </p>
          <span className="skills-caption">
            Different tools. Connected by code.
          </span>
        </div>
        <SkillReveal>
          {toolkit.map((skill) => (
            <li
              className={`skill-keychain skill-${skill.color}`}
              key={skill.name}
            >
              <div className="skill-hardware" aria-hidden="true">
                <span className="skill-ring" />
                <span className="skill-link" />
              </div>
              <div className="skill-tag">
                <span className="skill-eyelet" aria-hidden="true" />
                <span className="skill-mark" aria-hidden="true">
                  {skill.mark}
                </span>
                <h3>{skill.name}</h3>
                <span className="skill-label">{skill.label}</span>
                <span className="skill-tag-edge" aria-hidden="true">
                  NIRAV’S TOOLKIT
                </span>
              </div>
            </li>
          ))}
        </SkillReveal>
      </div>
    </section>
  );
}
