import type { CSSProperties } from "react";
import Image from "next/image";
import { companyMemories, type CompanyMemory } from "@/content/experience-book";
import { MemoryBook } from "./memory-book";

export function ExperienceBook() {
  return (
    <section
      className="experience-section"
      id="experience"
      aria-labelledby="experience-heading"
    >
      <div className="experience-intro">
        <div>
          <p className="section-eyebrow">
            <span aria-hidden="true">✳</span> THE EXPERIENCE BOOK
          </p>
          <h2 id="experience-heading">
            Collected along <em>the way.</em>
          </h2>
        </div>
        <p className="experience-description">
          A few chapters of work.
          <br />
          The people, the projects, the things that stay.
        </p>
      </div>
      <div className="book-desk">
        <span className="desk-scribble" aria-hidden="true">
          a little scrapbook of work <span>↘</span>
        </span>
        <MemoryBook
          pages={companyMemories.flatMap((company, index) => [
            {
              company: company.company,
              title: `${company.company} — Experience`,
              content: (
                <CompanyNotes company={company} pageNumber={index * 2 + 1} />
              ),
            },
            {
              company: company.company,
              title: `${company.company} — Gallery`,
              content: (
                <CompanyGallery company={company} pageNumber={index * 2 + 2} />
              ),
            },
          ])}
        />
      </div>
    </section>
  );
}

function CompanyNotes({
  company,
  pageNumber,
}: {
  company: CompanyMemory;
  pageNumber: number;
}) {
  return (
    <article
      className={`company-memory memory-${company.id}`}
      style={
        {
          "--company-ink": company.accent,
          "--company-color": company.secondary,
        } as CSSProperties
      }
      aria-labelledby={`company-${company.id}`}
    >
      <header className="paper-running-head">
        <span>WORK / COLLECTED NOTES</span>
        <span aria-hidden="true">{String(pageNumber).padStart(2, "0")}</span>
      </header>
      <div className="company-card taped">
        <div className="company-mark" aria-hidden="true">
          {company.logoSrc ? (
            <Image
              src={company.logoSrc}
              alt=""
              width={56}
              height={56}
              className="company-logo"
            />
          ) : (
            company.monogram
          )}
        </div>
        <div className="company-card-copy">
          <span className="logo-space-label">
            {company.logoSrc ? "COMPANY" : "LOGO SPACE"}
          </span>
          <h3 id={`company-${company.id}`}>{company.company}</h3>
        </div>
        <span className="card-corner" aria-hidden="true">
          ↗
        </span>
      </div>
      <div className="role-note">
        <p className="note-label">MY ROLE</p>
        <h4>{company.role}</h4>
        <span className="role-underline" aria-hidden="true" />
      </div>
      <div className="summary-scrap taped">
        <span className="draft-label">
          {company.summary ? "WORK NOTE" : "DRAFT NOTE"}
        </span>
        <p>{company.summary || company.draftSummary}</p>
        <span className="handwritten" aria-hidden="true">
          {company.summary ? "a note worth keeping." : "the details come next."}
        </span>
      </div>
      <div className="memory-bottom">
        <div className="mini-note">
          <span className="note-label">WORTH KEEPING</span>
          <p>
            Projects. Lessons.
            <br />
            Little breakthroughs.
          </p>
          <span className="pencil-lines" aria-hidden="true" />
        </div>
        <div className="company-stamp" aria-hidden="true">
          <span>MEMORY</span>
          <b>{String(pageNumber).padStart(2, "0")}</b>
          <span>IN THE MAKING</span>
        </div>
      </div>
      <footer className="paper-footer">
        <span>NIRAV PATEL</span>
        <span>{String(pageNumber).padStart(2, "0")}</span>
      </footer>
    </article>
  );
}

function CompanyGallery({
  company,
  pageNumber,
}: {
  company: CompanyMemory;
  pageNumber: number;
}) {
  return (
    <article
      className={`company-memory company-gallery memory-${company.id}`}
      style={
        {
          "--company-ink": company.accent,
          "--company-color": company.secondary,
        } as CSSProperties
      }
      aria-labelledby={`gallery-${company.id}`}
    >
      <header className="paper-running-head">
        <span>PHOTOS / COLLECTED MOMENTS</span>
        <span aria-hidden="true">{String(pageNumber).padStart(2, "0")}</span>
      </header>
      <div className="gallery-heading">
        <p className="note-label">{company.company}</p>
        <h3 id={`gallery-${company.id}`}>
          A few moments <em>to keep.</em>
        </h3>
        <p>Three spaces for the pictures you’ll add.</p>
      </div>
      <div
        className="memory-gallery"
        aria-label={`${company.company} photo gallery`}
      >
        {company.photos.map((photo, index) => (
          <figure
            className={`gallery-shot taped gallery-shot-${index + 1}`}
            key={photo.caption}
          >
            <div className="photo-window">
              {photo.src ? (
                <Image
                  src={photo.src}
                  alt={photo.alt || photo.caption}
                  fill
                  sizes="(max-width: 760px) 40vw, 220px"
                />
              ) : (
                <div
                  className="photo-placeholder"
                  role="img"
                  aria-label={`${company.company} photo placeholder ${index + 1}`}
                >
                  <svg
                    viewBox="0 0 160 200"
                    preserveAspectRatio="xMidYMid slice"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      width="160"
                      height="200"
                      fill="var(--company-color)"
                    />
                    <circle
                      cx={index === 1 ? 115 : 48}
                      cy={index === 2 ? 64 : 47}
                      r="24"
                      fill="var(--company-ink)"
                      opacity=".14"
                    />
                    <path
                      d={
                        index === 1
                          ? "M-20 190L60 65L180 200Z"
                          : "M-20 200L72 90L180 200Z"
                      }
                      fill="var(--company-ink)"
                      opacity=".12"
                    />
                    <path
                      d="M60 200L140 117L180 200Z"
                      fill="var(--company-ink)"
                      opacity=".12"
                    />
                    <path
                      d="M60 78H74L80 70H97L103 78H116V109H60Z"
                      stroke="var(--company-ink)"
                      strokeWidth="2"
                      opacity=".4"
                    />
                    <circle
                      cx="88"
                      cy="93"
                      r="8"
                      stroke="var(--company-ink)"
                      strokeWidth="2"
                      opacity=".4"
                    />
                  </svg>
                  <span>Your photo here</span>
                </div>
              )}
            </div>
            <figcaption>
              <span>{photo.caption}</span>
              <i aria-hidden="true">{String(index + 1).padStart(2, "0")}</i>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="gallery-scribble" aria-hidden="true">
        the little things, kept together. <span>↖</span>
      </p>
      <footer className="paper-footer">
        <span>{company.company.toUpperCase()} / PHOTO NOTES</span>
        <span>{String(pageNumber).padStart(2, "0")}</span>
      </footer>
    </article>
  );
}
