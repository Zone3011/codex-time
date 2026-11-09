"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useMotionEnabled } from "./motion-settings";

const subscribeCompact = (listener: () => void) => {
  const query = matchMedia("(max-width: 760px)");
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
};
const compactSnapshot = () => matchMedia("(max-width: 760px)").matches;
const serverFalse = () => false;
const subscribeHydrated = () => () => {};
const clientTrue = () => true;
const subscribeVisible = (listener: () => void) => {
  document.addEventListener("visibilitychange", listener);
  return () => document.removeEventListener("visibilitychange", listener);
};
const visibleSnapshot = () => !document.hidden;

type BookPage = { company: string; title: string; content: ReactNode };

function copyPage(source: HTMLElement, className: string) {
  const copy = source.cloneNode(true) as HTMLElement;
  copy.className = className;
  copy.setAttribute("aria-hidden", "true");
  copy.inert = true;
  copy.removeAttribute("id");
  copy.removeAttribute("data-book-page");
  copy.removeAttribute("hidden");
  copy
    .querySelectorAll("[id]")
    .forEach((element) => element.removeAttribute("id"));
  return copy;
}

export function MemoryBook({ pages }: { pages: BookPage[] }) {
  const [active, setActive] = useState(0);
  const [autoEnabled, setAutoEnabled] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const compact = useSyncExternalStore(
    subscribeCompact,
    compactSnapshot,
    serverFalse,
  );
  const enhanced = useSyncExternalStore(
    subscribeHydrated,
    clientTrue,
    serverFalse,
  );
  const visible = useSyncExternalStore(
    subscribeVisible,
    visibleSnapshot,
    serverFalse,
  );
  const motion = useMotionEnabled();
  const frame = useRef<HTMLDivElement>(null);
  const cover = useRef<HTMLDivElement>(null);
  const animations = useRef<Animation[]>([]);
  const overlays = useRef<HTMLElement[]>([]);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const start = compact ? active : Math.floor(active / 2) * 2;
  const step = compact ? 1 : 2;
  const chapter = Math.floor(start / 2);
  const chapters = pages.filter((_, index) => index % 2 === 0);

  const cancelTurn = useCallback(() => {
    animations.current.forEach((animation) => animation.cancel());
    animations.current = [];
    overlays.current.forEach((overlay) => overlay.remove());
    overlays.current = [];
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) =>
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.15),
      { threshold: 0.15 },
    );
    if (cover.current) observer.observe(cover.current);
    return () => {
      observer.disconnect();
      cancelTurn();
    };
  }, [cancelTurn]);
  useEffect(() => {
    if (!motion || !visible) cancelTurn();
  }, [motion, visible, cancelTurn]);
  useEffect(() => () => cancelTurn(), [compact, cancelTurn]);

  const turn = useCallback(
    (requested: number) => {
      const next = compact ? requested : Math.floor(requested / 2) * 2;
      if (next === start || next < 0 || next >= pages.length) return;
      cancelTurn();
      const host = frame.current;
      const forward = next > start;
      const sourceIndex = compact ? start : start + (forward ? 1 : 0);
      const backIndex = compact ? next : next + (forward ? 0 : 1);
      const source = host?.querySelector<HTMLElement>(
        `[data-book-page="${sourceIndex}"]`,
      );
      const backSource = host?.querySelector<HTMLElement>(
        `[data-book-page="${backIndex}"]`,
      );
      if (motion && visible && host && source && backSource) {
        if (!compact) {
          const stationary = host.querySelector<HTMLElement>(
            `[data-book-page="${start + (forward ? 0 : 1)}"]`,
          );
          if (stationary) {
            const hold = copyPage(
              stationary,
              `turn-hold ${forward ? "turn-hold-left" : "turn-hold-right"}`,
            );
            host.append(hold);
            overlays.current.push(hold);
          }
        }
        const sheet = document.createElement("div");
        sheet.className = `turn-leaf ${compact ? "turn-single" : forward ? "turn-next" : "turn-previous"}`;
        sheet.setAttribute("aria-hidden", "true");
        sheet.inert = true;
        sheet.append(
          copyPage(source, "turn-face turn-front"),
          copyPage(backSource, "turn-face turn-back"),
        );
        const shade = document.createElement("div");
        shade.className = "turn-shade";
        sheet.append(shade);
        host.append(sheet);
        overlays.current.push(sheet);
        const duration = 820;
        const flip = sheet.animate(
          [
            { transform: "rotateY(0deg)" },
            { transform: `rotateY(${forward ? "-" : ""}82deg)`, offset: 0.46 },
            { transform: `rotateY(${forward ? "-" : ""}180deg)` },
          ],
          { duration, easing: "cubic-bezier(.33,.05,.23,1)", fill: "forwards" },
        );
        const lighting = shade.animate(
          [{ opacity: 0 }, { opacity: 0.26, offset: 0.5 }, { opacity: 0 }],
          { duration, fill: "forwards" },
        );
        animations.current = [flip, lighting];
        flip.onfinish = () => {
          if (animations.current.includes(flip)) cancelTurn();
        };
      }
      setActive(next);
    },
    [cancelTurn, compact, motion, pages.length, start, visible],
  );

  const autoRunning =
    enhanced &&
    autoEnabled &&
    motion &&
    visible &&
    inView &&
    !hovered &&
    !focused;
  useEffect(() => {
    if (!autoRunning) return;
    const timer = setTimeout(
      () => turn(start + step >= pages.length ? 0 : start + step),
      5000,
    );
    return () => clearTimeout(timer);
  }, [autoRunning, start, step, pages.length, turn]);

  return (
    <div
      className="memory-reader"
      data-compact={compact ? "true" : undefined}
      data-enhanced={enhanced ? "true" : undefined}
      data-auto-running={autoRunning ? "true" : "false"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={(event) =>
        setFocused(
          !(event.target as HTMLElement).closest("[data-auto-control]"),
        )
      }
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      <div className="book-toolbar" hidden={!enhanced}>
        <div
          className="book-bookmarks"
          role="tablist"
          aria-label="Company pages"
          hidden={!enhanced}
        >
          {chapters.map((page, index) => (
            <button
              key={page.company}
              ref={(element) => {
                tabs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`book-tab-${index}`}
              aria-controls={`book-chapter-${index}`}
              aria-selected={chapter === index}
              tabIndex={chapter === index ? 0 : -1}
              onClick={() => turn(index * 2)}
              onKeyDown={(event) => {
                let next = chapter;
                if (event.key === "ArrowRight")
                  next = (chapter + 1) % chapters.length;
                else if (event.key === "ArrowLeft")
                  next = (chapter - 1 + chapters.length) % chapters.length;
                else if (event.key === "Home") next = 0;
                else if (event.key === "End") next = chapters.length - 1;
                else return;
                event.preventDefault();
                turn(next * 2);
                tabs.current[next]?.focus();
              }}
            >
              {page.company}
            </button>
          ))}
        </div>
        <button
          className="book-auto-toggle"
          type="button"
          data-auto-control
          disabled={!motion}
          aria-pressed={!autoEnabled}
          onClick={() => setAutoEnabled(!autoEnabled)}
          aria-label={autoEnabled ? "Pause auto-turn" : "Resume auto-turn"}
        >
          <span aria-hidden="true">{autoEnabled && motion ? "Ⅱ" : "▷"}</span>
          {!motion
            ? "Motion paused"
            : autoEnabled
              ? hovered || focused
                ? "Paused to read"
                : "Auto · 5s"
              : "Auto paused"}
        </button>
      </div>
      <div className="book-cover" ref={cover}>
        <div className="book-paper-stack">
          <div className="book-frame" ref={frame}>
            {chapters.map((page, companyIndex) => (
              <div
                key={page.company}
                className="company-spread"
                id={`book-chapter-${companyIndex}`}
                role={enhanced ? "tabpanel" : undefined}
                aria-labelledby={
                  enhanced ? `book-tab-${companyIndex}` : undefined
                }
                hidden={enhanced && chapter !== companyIndex}
              >
                {pages
                  .slice(companyIndex * 2, companyIndex * 2 + 2)
                  .map((bookPage, side) => {
                    const index = companyIndex * 2 + side;
                    return (
                      <div
                        key={bookPage.title}
                        className={`paper-page ${side === 0 ? "paper-left" : "paper-right"}`}
                        data-book-page={index}
                        role="region"
                        aria-label={`${bookPage.title}, page ${index + 1}`}
                        hidden={enhanced && compact && active !== index}
                      >
                        {bookPage.content}
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="book-controls" hidden={!enhanced}>
        <span className="book-reading-note">
          <span aria-hidden="true">↳</span> Two companies. Four pages of
          memories.
        </span>

        <div className="book-pagination">
          <button
            type="button"
            onClick={() => turn(start - step)}
            disabled={start === 0}
            aria-label="Previous page"
          >
            ←
          </button>
          <span aria-hidden="true">
            {String(start + 1).padStart(2, "0")}
            {!compact && ` — ${String(start + 2).padStart(2, "0")}`}
            <i> / {String(pages.length).padStart(2, "0")}</i>
          </span>
          <button
            type="button"
            onClick={() => turn(start + step)}
            disabled={start + step >= pages.length}
            aria-label="Next page"
          >
            →
          </button>
        </div>
      </div>
      <p
        className="sr-only"
        role="status"
        aria-live={autoRunning ? "off" : "polite"}
      >
        {compact
          ? `${pages[start].title}, page ${start + 1} of ${pages.length}.`
          : `${pages[start].company}, pages ${start + 1} and ${start + 2} of ${pages.length}.`}
      </p>
    </div>
  );
}
