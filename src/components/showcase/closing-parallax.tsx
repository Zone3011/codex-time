"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMotionEnabled } from "./motion-settings";

export function ClosingParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const motion = useMotionEnabled();
  useEffect(() => {
    const root = ref.current;
    if (!root || !motion) return;
    let visible = false;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!visible || document.hidden) return;
      const box = root.getBoundingClientRect();
      const progress = Math.max(
        -1,
        Math.min(1, (box.top + box.height / 2 - innerHeight / 2) / innerHeight),
      );
      root.style.setProperty("--closing-drift", `${progress * 48}px`);
    };
    const schedule = () => {
      if (!frame && visible && !document.hidden)
        frame = requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    });
    observer.observe(root);
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else schedule();
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", visibility);
      root.style.removeProperty("--closing-drift");
    };
  }, [motion]);
  return (
    <div className="closing-parallax" ref={ref}>
      {children}
    </div>
  );
}
