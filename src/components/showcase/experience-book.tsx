import type { CSSProperties } from "react";
import Image from "next/image";
import { companyMemories } from "@/content/experience-book";
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
          pages={companyMemories.map((company, index) => ({
            title: company.company,
            content: (
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
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
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
                    {company.summary
                      ? "a note worth keeping."
                      : "the details come next."}
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
                    <b>{String(index + 1).padStart(2, "0")}</b>
                    <span>IN THE MAKING</span>
                  </div>
                </div>
                <footer className="paper-footer">
                  <span>NIRAV PATEL</span>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </footer>
              </article>
            ),
          }))}
        />
      </div>
    </section>
  );
}
