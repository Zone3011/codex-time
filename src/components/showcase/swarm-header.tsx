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
    choreography: boolean;
    speed: number;
    ui: boolean;
    root: HTMLElement;
    logo: string;
  }) => Promise<void>;
  skip: () => void;
  running: boolean;
  lastPlan: { start: string; order: string; strikes: string } | null;
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
  let previous: { origin?: string; order?: string } = {};
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
        choreography: true,
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
      <div className="header-inner" data-swarm-stage="0">
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
        <div className="opening-kicker" data-swarm-stage="1">
          <span className="tiny-cross">+</span> HELLO, I’M NIRAV{" "}
          <span className="kicker-line" />
        </div>
        <h1
          id="opening-title"
          className="opening-title"
          data-swarm-stage="1"
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
        <div
          className="assembly-board"
          data-swarm-stage="2"
          aria-label="My toolkit"
        >
          <div className="board-heading">
            <span className="board-dot" /> A FEW GOOD TOOLS{" "}
            <span className="board-plus" aria-hidden="true">
              +
            </span>
          </div>
          <div className="tool-grid">
            <div className="tool-tile tile-wordpress">
              <span className="tool-symbol" aria-hidden="true">
                W
              </span>
              <span>WordPress</span>
              <i aria-hidden="true">↗</i>
            </div>
            <div className="tool-tile tile-php">
              <span className="tool-symbol" aria-hidden="true">
                &lt;?&gt;
              </span>
              <span>PHP</span>
              <i aria-hidden="true">↗</i>
            </div>
            <div className="tool-tile tile-flutter">
              <span className="tool-symbol" aria-hidden="true">
                F
              </span>
              <span>Flutter</span>
              <i aria-hidden="true">↗</i>
            </div>
            <div className="tool-tile tile-dotnet">
              <span className="tool-symbol" aria-hidden="true">
                .n
              </span>
              <span>.NET</span>
              <i aria-hidden="true">↗</i>
            </div>
            <div className="tool-tile tile-next">
              <span className="tool-symbol" aria-hidden="true">
                N<span className="symbol-dot">.</span>
              </span>
              <span>Next.js</span>
              <i aria-hidden="true">↗</i>
            </div>
          </div>
          <div className="board-footnote">
            <span>Different tools. Connected thinking.</span>
            <span aria-hidden="true">↙</span>
          </div>
        </div>{" "}
        <div className="opening-footer" data-swarm-stage="3">
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
