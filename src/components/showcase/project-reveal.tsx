"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMotionEnabled } from "./motion-settings";

export function ProjectReveal({ children }: { children: ReactNode }) {
  const grid = useRef<HTMLDivElement>(null);
  const motion = useMotionEnabled();

  useEffect(() => {
    const host = grid.current;
    if (!host) return;
    const cards = Array.from(
      host.querySelectorAll<HTMLElement>("[data-project-card]"),
    );
    const visible = new Set<HTMLElement>();
    let disposed = false;
    let running = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let startedAtScroll = 0;
    host.dataset.webState = "idle";

    const stopOwnIntro = () => {
      if (window.SwarmIntro?.activeRoot === host) window.SwarmIntro.skip();
    };
    const markSeen = (card: HTMLElement) => {
      card.dataset.webRevealed = "true";
      card.setAttribute("data-swarm-ignore", "");
      visible.delete(card);
      observer.unobserve(card);
    };
    const schedule = () => {
      clearTimeout(timer);
      if (!disposed && visible.size && motion && !document.hidden)
        timer = setTimeout(start, 140);
    };
    const start = () => {
      const engine = window.SwarmIntro;
      if (
        disposed ||
        running ||
        !motion ||
        document.hidden ||
        !engine ||
        engine.running
      )
        return;
      const batch = cards.filter(
        (card) => visible.has(card) && card.dataset.webRevealed !== "true",
      );
      if (!batch.length) return;
      // Only the visible, unplayed cards belong to this run. Card contents stay intact.
      cards.forEach((card) =>
        card.toggleAttribute("data-swarm-ignore", !batch.includes(card)),
      );
      running = true;
      startedAtScroll = window.scrollY;
      host.dataset.webState = "running";
      void engine
        .play({
          mode: "web",
          vibe: "classic",
          random: true,
          origin: "auto",
          order: "auto",
          cursors: 3,
          choreography: false,
          fixedCursors: true,
          readableTyping: true,
          entrance: "fan",
          exit: "scatter",
          speed: 3,
          ui: false,
          root: host,
          logo: "[data-project-card]",
        })
        .then(() => {
          if (disposed) return;
          batch.forEach(markSeen);
          running = false;
          host.dataset.webState = cards.every(
            (card) => card.dataset.webRevealed === "true",
          )
            ? "complete"
            : "idle";
          schedule();
        });
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const card = entry.target as HTMLElement;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            if (!motion) markSeen(card);
            else visible.add(card);
          } else visible.delete(card);
        });
        schedule();
      },
      { threshold: [0, 0.25, 0.5] },
    );
    cards.forEach((card) => {
      if (card.dataset.webRevealed !== "true") observer.observe(card);
    });
    const onScroll = () => {
      if (running && Math.abs(window.scrollY - startedAtScroll) > 8)
        stopOwnIntro();
      else if (!running) schedule();
    };
    const onVisibility = () => {
      if (document.hidden) {
        clearTimeout(timer);
        stopOwnIntro();
      } else schedule();
    };
    const onResize = () => {
      stopOwnIntro();
      schedule();
    };
    window.addEventListener("swarm:intro-ready", schedule);
    window.addEventListener("swarm:intro-end", schedule);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    host.addEventListener("focusin", stopOwnIntro);
    return () => {
      disposed = true;
      clearTimeout(timer);
      observer.disconnect();
      stopOwnIntro();
      window.removeEventListener("swarm:intro-ready", schedule);
      window.removeEventListener("swarm:intro-end", schedule);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      host.removeEventListener("focusin", stopOwnIntro);
    };
  }, [motion]);

  return (
    <div className="project-grid" ref={grid}>
      {children}
    </div>
  );
}
