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
      const startY = Math.random() < .5 ? -32 : bounds.height + 32;
      const delay = Math.random() * 700 / SPEED;
      const cursor = document.createElement("div");
      cursor.className = "swarm-cursor";
      cursor.style.setProperty("--cursor-color", COLORS[index % COLORS.length]);
      cursor.innerHTML = '<svg viewBox="0 0 20 25"><path d="M2 2L17 15L10 16L7 23Z" fill="currentColor" stroke="white" stroke-width="1.5"/></svg><span class="swarm-tag">' + ["Mira", "Dev", "Kai", "Zoe"][index % 4] + '</span>';
      layer.append(cursor);
      const movement = cursor.animate([
        { transform: `translate(${startX}px, ${startY}px)`, opacity: 0 },
        { transform: `translate(${startX}px, ${startY}px)`, opacity: 1, offset: .12 },
        { transform: `translate(${x}px, ${y}px)`, opacity: 1, offset: .6 },
        { transform: `translate(${x + 25}px, ${y - 10}px)`, opacity: 1, offset: .8 },
        { transform: `translate(${x + 60}px, ${bounds.height + 35}px)`, opacity: 0 },
      ], { duration: 2400 / SPEED, delay, easing: "cubic-bezier(.22,.7,.3,1)", fill: "both" });
      const reveal = target.animate([
        { opacity: 0, transform: `translate(${(startX - x) * .12}px, ${(startY - y) * .2}px) scale(.94)` },
        { opacity: 1, transform: "translate(0, 0) scale(1)" },
      ], { duration: 1000 / SPEED, delay: delay + 650 / SPEED, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" });
      animations.push(movement, reveal);
      movement.onfinish = () => { finished += 1; if (finished === targets.length) cleanup(); };
    });
    const onPreference = () => { if (preference.matches) cleanup(); };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") cleanup(); };
    const onVisibility = () => {
      animations.forEach((animation) => {
        if (disposed) return;
        if (document.hidden) animation.pause(); else animation.play();
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
          <span className="brand-mark" data-swarm-piece aria-hidden="true">N.</span>
          <span data-swarm-piece>Nirav Patel<span style={{ color: "var(--blue)" }}>.</span></span>
        </Link>
        <div className="header-actions">
          <button className="motion-toggle" type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Resume motion" : "Pause motion"}</button>
          <a className="contact-link" data-swarm-piece href="mailto:niravpatel1422004@gmail.com">Let’s talk <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </header>
  );
}

