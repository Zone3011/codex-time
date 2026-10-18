"use client";
import { useState } from "react";
import { experiences } from "@/content/experiences";
import { useExperience } from "@/components/showcase/experience-context";
export function Navigation() {
  const [open, setOpen] = useState(false);
  const { paused, reduced, toggle, active } = useExperience();
  return (
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="Nirav Patel home">
        np<span>✳</span>
      </a>
      <button
        className="menu-toggle"
        aria-controls="main-navigation"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? "Close −" : "Menu +"}
      </button>
      <nav
        className={open ? "navigation is-open" : "navigation"}
        id="main-navigation"
        aria-label="Main navigation"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
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
        onClick={toggle}
        aria-pressed={paused}
        disabled={reduced}
        aria-label={reduced ? "Reduced motion enabled" : "Pause animations"}
      >
        <span aria-hidden="true">{paused || reduced ? "Ⅱ" : "◌"}</span>
        <span>
          {reduced ? "Reduced motion" : paused ? "Motion off" : "Motion on"}
        </span>
      </button>
    </header>
  );
}
