import Image from "next/image";
import { portfolioProjects } from "@/content/projects";
import { ProjectReveal } from "./project-reveal";
import { ProjectCover } from "./project-cover";

export function Projects() {
  return (
    <section
      className="projects-section"
      id="projects"
      aria-labelledby="projects-heading"
    >
      <div className="experience-intro projects-intro">
        <div>
          <p className="section-eyebrow">
            <span aria-hidden="true">✳</span> THE PROJECT COLLECTION
          </p>
          <h2 id="projects-heading">
            Different ideas. <em>Made real.</em>
          </h2>
        </div>
        <p className="experience-description">
          A selection of WordPress work
          <br />
          and web scraping.
        </p>
      </div>
      <ProjectReveal>
        {portfolioProjects.map((project, index) => (
          <article
            className={`project-card project-${project.cover}`}
            data-project-card
            key={project.id}
            aria-labelledby={`project-${project.id}`}
          >
            <div className="project-card-content" data-swarm-ignore>
              <div className="project-art">
                {project.imageSrc ? (
                  <Image
                    src={project.imageSrc}
                    alt={project.imageAlt || project.title}
                    fill
                    sizes="(max-width: 760px) 90vw, 33vw"
                  />
                ) : (
                  <ProjectCover kind={project.cover} />
                )}
                <span className="project-cover-label">
                  {project.imageSrc ? "PROJECT PREVIEW" : "ILLUSTRATIVE COVER"}
                </span>
                <span className="project-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="project-copy">
                <div className="project-labels">
                  {project.labels.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
                <h3 id={`project-${project.id}`}>{project.title}</h3>
                <p>{project.summary}</p>
                {project.href && (
                  <a className="project-open" href={project.href}>
                    View project <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </ProjectReveal>
      <div className="projects-footnote">
        <span aria-hidden="true">↳</span>
        <p>Other work includes commercial WordPress websites.</p>
        <span className="projects-total" aria-hidden="true">
          03 PROJECTS
        </span>
      </div>
    </section>
  );
}
