"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";

type SwarmApi = {
  play: (options: {
    mode: string;
    vibe: string;
    random: boolean;
    origin: string;
    order: string;
    cursors: number;
    speed: number;
    ui: boolean;
    root: HTMLElement;
    logo: string;
  }) => Promise<void>;
  skip: () => void;
  running: boolean;
  lastPlan: { originKind: string; kind: string } | null;
};
declare global {
  interface Window {
    SwarmIntro?: SwarmApi;
  }
}

export function SwarmHeader() {
  const header = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [engineReady, setEngineReady] = useState(false);
  const [replay, setReplay] = useState(0);

  useEffect(() => {
    const element = header.current;
    const engine = window.SwarmIntro;
    if (!element || !engineReady || !engine || paused) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || document.hidden) return;
    let disposed = false;
    const stop = () => engine.skip();
    const onPreference = () => {
      if (preference.matches) stop();
    };
    const onVisibility = () => {
      if (document.hidden) stop();
    };
    const onResize = () => stop();
    preference.addEventListener("change", onPreference);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);
    // Use the supplied engine: cursors draw selection boxes and type the actual text.
    void engine
      .play({
        mode: "swarm",
        vibe: "classic",
        random: true,
        origin: "auto",
        order: "auto",
        cursors: 6,
        speed: 2,
        ui: false,
        root: element,
        logo: "[data-swarm-logo]",
      })
      .then(() => {
        if (!disposed) element.dataset.intro = "complete";
      });
    element.dataset.intro = "running";
    return () => {
      disposed = true;
      stop();
      preference.removeEventListener("change", onPreference);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, [engineReady, paused, replay]);
  return (
    <header ref={header} className="site-header" aria-label="Main header">
      <Script
        src="/swarm-intro.js"
        strategy="afterInteractive"
        onReady={() => setEngineReady(true)}
      />
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="Nirav Patel home">
          <span className="brand-mark" data-swarm-logo aria-hidden="true">
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
          <button
            className="replay-toggle"
            data-swarm-ignore
            type="button"
            disabled={paused}
            onClick={() => {
              window.SwarmIntro?.skip();
              setReplay((value) => value + 1);
            }}
            aria-label="Replay swarm animation"
          >
            <span aria-hidden="true">↻</span> Replay intro
          </button>
          <span className="header-note" data-swarm-piece>
            <i /> A work in motion
          </span>
          <button
            className="motion-toggle"
            type="button"
            aria-pressed={paused}
            data-swarm-ignore
            onClick={() => {
              window.SwarmIntro?.skip();
              setPaused(!paused);
            }}
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
