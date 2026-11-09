"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useMotionPaused, setMotionPaused } from "./motion-settings";

type SwarmApi = {
  play: (options: {
    mode: string;
    vibe: string;
    random: boolean;
    origin: string;
    order: string;
    cursors: number;
    choreography: boolean;
    fixedCursors: boolean;
    readableTyping: boolean;
    entrance: string;
    exit: string;
    speed: number;
    ui: boolean;
    root: HTMLElement;
    logo: string;
  }) => Promise<void>;
  skip: () => void;
  running: boolean;
  lastPlan: {
    start: string;
    order: string;
    strikes: string;
    entrance: string;
    exit: string;
    speed: number;
  } | null;
};
declare global {
  interface Window {
    SwarmIntro?: SwarmApi;
  }
}

// Remember only the last visual choices within this tab, so refreshes cannot repeat them.
function nextIntroPlan() {
  const origins = ["logo", "corner", "center", "edge", "piece"];
  const orders = [
    "down",
    "up",
    "left",
    "right",
    "out",
    "in",
    "spin",
    "shuffle",
  ];
  let previous: {
    origin?: string;
    order?: string;
    entrance?: string;
    exit?: string;
  } = {};
  try {
    previous = JSON.parse(sessionStorage.getItem("nirav-intro-plan") || "{}");
  } catch {
    /* Storage is optional. */
  }
  const choose = (choices: string[], last?: string) => {
    const available = choices.filter((value) => value !== last);
    return available[Math.floor(Math.random() * available.length)];
  };
  const plan = {
    origin: choose(origins, previous?.origin),
    order: choose(orders, previous?.order),
    entrance: choose(["orbit", "fan", "rally"], previous?.entrance),
    exit: choose(["scatter", "sweep", "spiral"], previous?.exit),
  };
  try {
    sessionStorage.setItem("nirav-intro-plan", JSON.stringify(plan));
  } catch {
    /* Randomness still works without storage. */
  }
  return plan;
}
export function SwarmHeader() {
  const header = useRef<HTMLElement>(null);
  const contact = useRef<HTMLDialogElement>(null);
  const [copyMessage, setCopyMessage] = useState("");
  const paused = useMotionPaused();
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
    const plan = nextIntroPlan();
    // Use the supplied engine: cursors draw selection boxes and type the actual text.
    void engine
      .play({
        mode: "swarm",
        vibe: "classic",
        random: true,
        origin: plan.origin,
        order: plan.order,
        cursors: 3,
        choreography: false,
        fixedCursors: true,
        readableTyping: true,
        speed: 3,
        entrance: plan.entrance,
        exit: plan.exit,
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
              setMotionPaused(!paused);
            }}
          >
            {paused ? "Resume motion" : "Pause motion"}
          </button>
          <a
            className="contact-link"
            data-swarm-ignore
            href="mailto:niravpatel1422004@gmail.com"
            aria-haspopup="dialog"
            onClick={(event) => {
              event.preventDefault();
              window.SwarmIntro?.skip();
              setCopyMessage("");
              contact.current?.showModal();
            }}
          >
            Let’s talk <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <section className="opening" aria-labelledby="opening-title">
        <div className="opening-kicker">
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
        <figure
          className="vector-scene"
          aria-label="Original illustration of a folded N with floating creative elements"
        >
          <div className="art-piece art-backdrop" aria-hidden="true">
            <svg viewBox="0 0 440 440" fill="none">
              <defs>
                <radialGradient id="scene-halo">
                  <stop stopColor="#e8deff" />
                  <stop offset="1" stopColor="#f8f5ff" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="220" cy="220" r="220" fill="url(#scene-halo)" />
              <path
                d="M61 307C36 211 143 65 262 74C381 83 429 233 352 332C275 431 89 415 61 307Z"
                fill="#f0ebff"
              />
              <path
                d="M80 315C127 355 282 375 362 298"
                stroke="#dbd1fc"
                strokeWidth="1.5"
                strokeDasharray="3 7"
              />
            </svg>
          </div>
          <div className="art-piece art-plinth" aria-hidden="true">
            <svg viewBox="0 0 360 95" fill="none">
              <defs>
                <linearGradient
                  id="plinth-top"
                  x2="360"
                  y2="95"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#f4f0ff" />
                  <stop offset="1" stopColor="#c6b6fb" />
                </linearGradient>
              </defs>
              <ellipse cx="180" cy="77" rx="137" ry="15" fill="#e9e2f8" />
              <path d="M12 44L181 6L348 44V56L180 89L12 57Z" fill="#b9a4f0" />
              <path d="M12 44L181 6L348 44L180 78Z" fill="url(#plinth-top)" />
              <path d="M180 78V89" stroke="#a58bdc" />
            </svg>
          </div>
          <div className="art-piece art-window" aria-hidden="true">
            <svg viewBox="0 0 184 128" fill="none">
              <rect
                x="5"
                y="9"
                width="172"
                height="110"
                rx="13"
                fill="#ded6fc"
              />
              <rect
                x="1"
                y="1"
                width="172"
                height="110"
                rx="13"
                fill="white"
                stroke="#d4c8f4"
              />
              <path d="M1 27H173" stroke="#e8e0f9" />
              <circle cx="16" cy="15" r="3" fill="#ed63ad" />
              <circle cx="28" cy="15" r="3" fill="#ffb35c" />
              <circle cx="40" cy="15" r="3" fill="#a896f6" />
              <path
                d="M39 52L24 65L39 78M69 52L84 65L69 78M60 47L47 84"
                stroke="#7756ed"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="103"
                y="50"
                width="47"
                height="6"
                rx="3"
                fill="#e8e0fa"
              />
              <rect
                x="103"
                y="64"
                width="35"
                height="6"
                rx="3"
                fill="#f4c1de"
              />
              <rect
                x="103"
                y="78"
                width="42"
                height="6"
                rx="3"
                fill="#e8e0fa"
              />
            </svg>
          </div>
          <div className="art-piece art-ribbon" aria-hidden="true">
            <svg viewBox="0 0 270 310" fill="none">
              <defs>
                <linearGradient
                  id="ribbon-front"
                  x1="42"
                  y1="20"
                  x2="229"
                  y2="280"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#9c7bff" />
                  <stop offset=".48" stopColor="#7650ed" />
                  <stop offset="1" stopColor="#4e2fc6" />
                </linearGradient>
                <linearGradient
                  id="ribbon-cut"
                  x1="50"
                  y1="50"
                  x2="220"
                  y2="260"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#d5bcff" />
                  <stop offset="1" stopColor="#8963ee" />
                </linearGradient>
                <linearGradient
                  id="ribbon-side"
                  x2="260"
                  y2="310"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#6b3fce" />
                  <stop offset="1" stopColor="#362081" />
                </linearGradient>
              </defs>
              <path
                d="M31 49L53 34L101 44L197 199V59L219 44L253 64V254L230 271L185 254L89 99V253L67 269L31 249Z"
                fill="url(#ribbon-side)"
              />
              <path
                d="M31 49L79 60L175 215V74L219 85V271L175 260L75 105V269L31 258Z"
                fill="url(#ribbon-front)"
              />
              <path d="M31 49L53 34L101 44L79 60Z" fill="#c5a6ff" />
              <path
                d="M79 60L101 44L197 199L175 215Z"
                fill="url(#ribbon-cut)"
              />
              <path d="M175 74L197 59L241 70L219 85Z" fill="#b797ff" />
              <path d="M219 85L241 70V256L219 271Z" fill="#49249e" />
              <path
                d="M31 49L79 60L175 215M175 74L219 85V271"
                stroke="#e2ceff"
                strokeOpacity=".5"
                strokeWidth="1.5"
              />
              <path d="M75 105V269L89 253V128Z" fill="#3e238c" />
            </svg>
          </div>
          <div className="art-piece art-spark" aria-hidden="true">
            <svg viewBox="0 0 80 80" fill="none">
              <path
                d="M40 1L47 26L70 10L54 33L79 40L54 47L70 70L47 54L40 79L33 54L10 70L26 47L1 40L26 33L10 10L33 26Z"
                fill="#ff9e49"
              />
              <path
                d="M40 16L44 33L61 40L44 44L40 62L35 45L18 40L35 35Z"
                fill="#ffc681"
              />
            </svg>
          </div>
          <div className="art-piece art-orb" aria-hidden="true">
            <svg viewBox="0 0 90 90" fill="none">
              <defs>
                <radialGradient id="orb-light" cx=".3" cy=".25" r=".8">
                  <stop stopColor="#ffdbb0" />
                  <stop offset=".5" stopColor="#ffab61" />
                  <stop offset="1" stopColor="#ec7552" />
                </radialGradient>
              </defs>
              <ellipse cx="46" cy="79" rx="27" ry="7" fill="#e4d7f4" />
              <circle cx="42" cy="38" r="32" fill="url(#orb-light)" />
              <path
                d="M22 32C24 24 29 19 36 17"
                stroke="#ffe6c7"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="art-piece art-pointer" aria-hidden="true">
            <svg viewBox="0 0 90 115" fill="none">
              <path d="M20 7L80 64L54 67L42 98Z" fill="#9f277d" />
              <path
                d="M11 1L71 58L45 61L33 92Z"
                fill="#ec58b5"
                stroke="#ffb8e4"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path d="M45 61L54 67L42 98L33 92Z" fill="#b6318c" />
              <path
                d="M48 80L59 107"
                stroke="#9f277d"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M40 75L51 102"
                stroke="#ec58b5"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </figure>{" "}
        <div className="opening-footer">
          <span data-swarm-piece>
            Personal portfolio <span className="footer-slash">/</span> A work in
            motion
          </span>
          <span className="footer-note" aria-hidden="true">
            Built a little differently. <span>↗</span>
          </span>
        </div>
      </section>
      <dialog
        ref={contact}
        className="contact-dialog"
        data-swarm-ignore
        aria-labelledby="contact-title"
      >
        <button
          className="dialog-close"
          type="button"
          aria-label="Close contact"
          onClick={() => contact.current?.close()}
        >
          ×
        </button>
        <span className="contact-eyebrow">SAY HELLO</span>
        <h2 id="contact-title">
          Let’s talk<span>.</span>
        </h2>
        <p>Send me an email.</p>
        <a className="email-address" href="mailto:niravpatel1422004@gmail.com">
          niravpatel1422004@gmail.com
        </a>
        <div className="contact-options">
          <a className="email-launch" href="mailto:niravpatel1422004@gmail.com">
            Open email app <span aria-hidden="true">↗</span>
          </a>
          <button
            className="copy-email"
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  "niravpatel1422004@gmail.com",
                );
                setCopyMessage("Email copied.");
              } catch {
                setCopyMessage("Select the email address above to copy it.");
              }
            }}
          >
            Copy email
          </button>
        </div>
        <p className="copy-status" role="status">
          {copyMessage || "You can copy the address if no email app is set up."}
        </p>
      </dialog>{" "}
    </header>
  );
}
