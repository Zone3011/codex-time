"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Match the supplied reference's speed: durations are divided by two.
const SPEED = 2;
const COLORS = ["#315af4", "#b13c83", "#16836c", "#b76c13"];

export function SwarmHeader() {
  const header = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const element = header.current;
    if (!element || paused) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;
    const animations: Animation[] = [];
    const layer = document.createElement("div");
    layer.className = "swarm-layer";
    layer.setAttribute("aria-hidden", "true");
    element.append(layer);
    const bounds = element.getBoundingClientRect();
    const targets = element.querySelectorAll<HTMLElement>("[data-swarm-piece]");
    let disposed = false;
    let finished = 0;
    const cleanup = () => {
      if (disposed) return;
      disposed = true;
      animations.forEach((animation) => animation.cancel());
      layer.remove();
    };
    targets.forEach((target, index) => {
      const box = target.getBoundingClientRect();
      const x = box.left - bounds.left + box.width / 2;
      const y = box.top - bounds.top + box.height / 2;
      const startX = Math.random() * bounds.width;
      const startY = Math.random() < 0.5 ? -32 : bounds.height + 32;
      const delay = (Math.random() * 700) / SPEED;
      const cursor = document.createElement("div");
      cursor.className = "swarm-cursor";
      cursor.style.setProperty("--cursor-color", COLORS[index % COLORS.length]);
      cursor.innerHTML =
        '<svg viewBox="0 0 20 25"><path d="M2 2L17 15L10 16L7 23Z" fill="currentColor" stroke="white" stroke-width="1.5"/></svg><span class="swarm-tag">' +
        ["Mira", "Dev", "Kai", "Zoe"][index % 4] +
        "</span>";
      layer.append(cursor);
      const movement = cursor.animate(
        [
          { transform: `translate(${startX}px, ${startY}px)`, opacity: 0 },
          {
            transform: `translate(${startX}px, ${startY}px)`,
            opacity: 1,
            offset: 0.12,
          },
          { transform: `translate(${x}px, ${y}px)`, opacity: 1, offset: 0.6 },
          {
            transform: `translate(${x + 25}px, ${y - 10}px)`,
            opacity: 1,
            offset: 0.8,
          },
          {
            transform: `translate(${x + 60}px, ${bounds.height + 35}px)`,
            opacity: 0,
          },
        ],
        {
          duration: 2400 / SPEED,
          delay,
          easing: "cubic-bezier(.22,.7,.3,1)",
          fill: "both",
        },
      );
      const reveal = target.animate(
        [
          {
            opacity: 0,
            transform: `translate(${(startX - x) * 0.12}px, ${(startY - y) * 0.2}px) scale(.94)`,
          },
          { opacity: 1, transform: "translate(0, 0) scale(1)" },
        ],
        {
          duration: 1000 / SPEED,
          delay: delay + 650 / SPEED,
          easing: "cubic-bezier(.16,1,.3,1)",
          fill: "both",
        },
      );
      animations.push(movement, reveal);
      movement.onfinish = () => {
        finished += 1;
        if (finished === targets.length) cleanup();
      };
    });
    const onPreference = () => {
      if (preference.matches) cleanup();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") cleanup();
    };
    const onVisibility = () => {
      animations.forEach((animation) => {
        if (disposed) return;
        if (document.hidden) animation.pause();
        else animation.play();
      });
    };
    preference.addEventListener("change", onPreference);
    document.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();
    return () => {
      cleanup();
      preference.removeEventListener("change", onPreference);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [paused]);

  return (
    <header ref={header} className="site-header" aria-label="Main header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="Nirav Patel home">
          <span className="brand-mark" data-swarm-piece aria-hidden="true">
            <svg viewBox="0 0 40 40" fill="none">
              <path d="M9 31V9L31 31V9" stroke="currentColor" strokeWidth="3" />
              <circle cx="9" cy="9" r="4" />
              <circle cx="31" cy="31" r="4" />
              <circle cx="31" cy="9" r="4" />
              <circle cx="9" cy="31" r="4" />
            </svg>
          </span>
          <span className="brand-name" data-swarm-piece>
            Nirav Patel<span className="brand-caption">PERSONAL PORTFOLIO</span>
          </span>
        </Link>
        <div className="header-actions">
          <span className="header-note" data-swarm-piece>
            <i /> A work in motion
          </span>
          <button
            className="motion-toggle"
            type="button"
            aria-pressed={paused}
            onClick={() => setPaused(!paused)}
          >
            {paused ? "Resume motion" : "Pause motion"}
          </button>
          <a
            className="contact-link"
            data-swarm-piece
            href="mailto:niravpatel1422004@gmail.com"
          >
            Let’s talk <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <section className="opening" aria-labelledby="opening-title">
        <div className="opening-kicker" data-swarm-piece>
          <span className="tiny-cross">+</span> HELLO, I’M NIRAV{" "}
          <span className="kicker-line" />
        </div>
        <h1
          id="opening-title"
          className="opening-title"
          aria-label="Nirav Patel"
        >
          <span className="name-line" data-swarm-piece>
            Nirav<span className="name-dot">.</span>
          </span>
          <span className="name-line surname" data-swarm-piece>
            Patel
            <span className="name-asterisk" aria-hidden="true">
              ✳
            </span>
          </span>
        </h1>
        <div className="orbit-art" data-swarm-piece aria-hidden="true">
          <svg viewBox="0 0 420 420" fill="none">
            <ellipse
              cx="210"
              cy="210"
              rx="189"
              ry="95"
              transform="rotate(-36 210 210)"
              stroke="#ccd6ef"
            />
            <ellipse
              cx="210"
              cy="210"
              rx="189"
              ry="95"
              transform="rotate(36 210 210)"
              stroke="#ccd6ef"
            />
            <circle
              cx="210"
              cy="210"
              r="155"
              stroke="#e7ecf7"
              strokeDasharray="3 8"
            />
            <path
              d="M133 294V126L287 294V126"
              stroke="#315af4"
              strokeWidth="2"
            />
            <path
              d="M145 294V151L275 294"
              stroke="#315af4"
              strokeOpacity=".25"
              strokeWidth="18"
            />
            <g fill="#315af4">
              <circle cx="133" cy="126" r="8" />
              <circle cx="133" cy="294" r="8" />
              <circle cx="287" cy="126" r="8" />
              <circle cx="287" cy="294" r="8" />
              <circle cx="210" cy="210" r="5" />
            </g>
            <circle cx="62" cy="131" r="10" fill="#ff765e" />
            <circle cx="345" cy="282" r="6" fill="#43ad96" />
            <path
              d="M331 76h14m-7-7v14M75 307h14m-7-7v14"
              stroke="#315af4"
              strokeWidth="2"
            />
          </svg>
          <span className="art-tag">a few dots. a different perspective.</span>
        </div>
        <div className="opening-footer">
          <span data-swarm-piece>
            Personal portfolio <span className="footer-slash">/</span> A work in
            motion
          </span>
          <span className="footer-note" aria-hidden="true">
            A little order. A little swarm. <span>↗</span>
          </span>
        </div>
      </section>
    </header>
  );
}
