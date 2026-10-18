"use client";
import { useEffect, useRef, useState } from "react";
import { useExperience } from "./experience-context";
export function StoryLine() {
  const root = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);
  const { enabled } = useExperience();
  useEffect(() => {
    if (!run || !enabled || !root.current) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    void import("animejs").then(({ animate, svg }) => {
      if (cancelled || !root.current) return;
      const animation = animate(
        svg.createDrawable(root.current.querySelectorAll(".draw-path")),
        { draw: ["0 0", "0 1"], duration: 850, ease: "inOut(3)" },
      );
      dispose = () => animation.revert();
    });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [run, enabled]);
  return (
    <div className="story-line" ref={root}>
      <svg viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden="true">
        <path
          className="draw-path"
          d="M0 40 H1000"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
      </svg>
      <button onClick={() => setRun((value) => value + 1)}>
        Trace the line ↗
      </button>
    </div>
  );
}
