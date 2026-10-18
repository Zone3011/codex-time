"use client";
import { useState } from "react";
export function Navigation() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="Portfolio home">
        yn<span>®</span>
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
      >
        {[
          ["Work", "#work"],
          ["About", "#about"],
          ["Experience", "#experience"],
          ["Let’s talk ↗", "#contact"],
        ].map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
