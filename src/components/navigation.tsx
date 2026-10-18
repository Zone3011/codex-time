"use client";
import { useState } from "react";
import { experiences } from "@/content/experiences";
import { useExperience } from "./showcase/experience-context";
export function Navigation() {
  const [open, setOpen] = useState(false);
  const { active, paused, reduced, toggle } = useExperience();
  return (
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="Nirav Patel home">
        np
        <span className="brand-dot" />
      </a>
      <button
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="main-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close −" : "Menu +"}
      </button>
      <nav
        id="main-navigation"
        aria-label="Main navigation"
        className={open ? "navigation is-open" : "navigation"}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
            document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
          }
        }}
      >
        {experiences.map((item) => (
          <a
            href={"#" + item.id}
            key={item.id}
            aria-current={active === item.id ? "location" : undefined}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <button
        className="motion-toggle"
        aria-label={reduced ? "Reduced motion enabled" : "Pause animations"}
        aria-pressed={paused}
        disabled={reduced}
        onClick={toggle}
      >
        <span aria-hidden="true">{paused || reduced ? "Ⅱ" : "◌"}</span>
        <span>
          {reduced ? "Reduced motion" : paused ? "Motion off" : "Motion on"}
        </span>
      </button>
      <a className="header-contact" href="#contact">
        Let’s talk <span aria-hidden="true">↗</span>
      </a>
    </header>
  );
}
