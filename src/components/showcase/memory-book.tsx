"use client";

import {
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
const serverCompact = () => false;

export function MemoryBook({
  pages,
}: {
  pages: { title: string; content: ReactNode }[];
}) {
  const [active, setActive] = useState(0);
  const compact = useSyncExternalStore(
    subscribeCompact,
    compactSnapshot,
    serverCompact,
  );
  const motion = useMotionEnabled();
  const frame = useRef<HTMLDivElement>(null);
  const animation = useRef<Animation | null>(null);
  const leaf = useRef<HTMLElement | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function cancelTurn() {
    animation.current?.cancel();
    animation.current = null;
    leaf.current?.remove();
    leaf.current = null;
  }
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) cancelTurn();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelTurn();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  useEffect(() => {
    if (!motion || !compact) cancelTurn();
  }, [motion, compact]);

  function turn(next: number) {
    if (next === active || next < 0 || next >= pages.length) return;
    cancelTurn();
    const source = frame.current?.querySelector<HTMLElement>(
      `[data-book-page="${active}"]`,
    );
    if (motion && compact && !document.hidden && source && frame.current) {
      const sheet = source.cloneNode(true) as HTMLElement;
      sheet.className = "turn-leaf";
      sheet.setAttribute("aria-hidden", "true");
      sheet.inert = true;
      sheet.removeAttribute("id");
      sheet
        .querySelectorAll("[id]")
        .forEach((element) => element.removeAttribute("id"));
      frame.current.append(sheet);
      leaf.current = sheet;
      const flip = sheet.animate(
        [
          { transform: "perspective(1400px) rotateY(0deg)", opacity: 1 },
          {
            transform: `perspective(1400px) rotateY(${next > active ? "-" : ""}88deg)`,
            opacity: 0.8,
            offset: 0.8,
          },
          {
            transform: `perspective(1400px) rotateY(${next > active ? "-" : ""}135deg)`,
            opacity: 0,
          },
        ],
        {
          duration: 460,
          easing: "cubic-bezier(.22,.68,.2,1)",
          fill: "forwards",
        },
      );
      animation.current = flip;
      flip.onfinish = () => {
        if (animation.current === flip) cancelTurn();
      };
    }
    setActive(next);
  }

  return (
    <div className="memory-reader" data-compact={compact ? "true" : undefined}>
      <div
        className="book-bookmarks"
        role="tablist"
        aria-label="Company pages"
        hidden={!compact}
      >
        {pages.map((page, index) => (
          <button
            key={page.title}
            ref={(element) => {
              tabs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`book-tab-${index}`}
            aria-controls={`book-page-${index}`}
            aria-selected={active === index}
            tabIndex={active === index ? 0 : -1}
            onClick={() => turn(index)}
            onKeyDown={(event) => {
              let next = active;
              if (event.key === "ArrowRight")
                next = (active + 1) % pages.length;
              else if (event.key === "ArrowLeft")
                next = (active - 1 + pages.length) % pages.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = pages.length - 1;
              else return;
              event.preventDefault();
              turn(next);
              tabs.current[next]?.focus();
            }}
          >
            {page.title}
          </button>
        ))}
      </div>
      <div className="book-cover">
        <div className="book-paper-stack">
          <div className="book-frame" ref={frame}>
            {pages.map((page, index) => (
              <div
                key={page.title}
                id={`book-page-${index}`}
                className={`paper-page ${index === 0 ? "paper-left" : "paper-right"}`}
                data-book-page={index}
                role={compact ? "tabpanel" : undefined}
                aria-labelledby={compact ? `book-tab-${index}` : undefined}
                hidden={compact && active !== index}
                tabIndex={compact ? 0 : undefined}
              >
                {page.content}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="book-controls">
        <span className="book-reading-note">
          <span aria-hidden="true">↳</span> Two chapters. A few things kept.
        </span>
        <div className="book-pagination" hidden={!compact}>
          <button
            type="button"
            onClick={() => turn(active - 1)}
            disabled={active === 0}
            aria-label="Previous page"
          >
            ←
          </button>
          <span aria-hidden="true">
            {String(active + 1).padStart(2, "0")}
            <i> / {String(pages.length).padStart(2, "0")}</i>
          </span>
          <button
            type="button"
            onClick={() => turn(active + 1)}
            disabled={active === pages.length - 1}
            aria-label="Next page"
          >
            →
          </button>
        </div>
        <span className="book-desktop-count" hidden={compact}>
          01 <span>—</span> 02
        </span>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {compact
          ? `${pages[active].title}, page ${active + 1} of ${pages.length}.`
          : "Open book: Sedani Digital and hfiles."}
      </p>
    </div>
  );
}
