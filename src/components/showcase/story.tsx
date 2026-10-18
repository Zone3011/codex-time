"use client";
import { useEffect, useRef } from "react";
import { useExperience } from "./experience-context";
export function StoryLine() {
  const root = useRef<HTMLDivElement>(null);
  const { enabled } = useExperience();
  useEffect(() => {
    if (!enabled || !root.current) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    void import("animejs").then(({ animate, svg }) => {
      if (cancelled || !root.current) return;
      const element = root.current;
      const animation = animate(
        svg.createDrawable(element.querySelectorAll(".draw-path")),
        {
          draw: ["0 0", "0 1"],
          duration: 1000,
          ease: "linear",
          autoplay: false,
        },
      );
      const update = () => {
        const rect = element.getBoundingClientRect();
        const progress = Math.max(
          0,
          Math.min(
            1,
            (window.innerHeight * 0.8 - rect.top) / (rect.height * 0.8),
          ),
        );
        animation.seek(progress * 1000);
      };
      update();
      window.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      dispose = () => {
        animation.revert();
        window.removeEventListener("scroll", update);
        window.removeEventListener("resize", update);
      };
    });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [enabled]);
  return (
    <div className="story-line" ref={root} aria-hidden="true">
      <svg
        className="story-line-desktop"
        viewBox="0 0 1000 200"
        preserveAspectRatio="none"
      >
        <path d="M20 100 H980" fill="none" stroke="#922f551c" strokeWidth="2" />
        <path
          className="draw-path"
          d="M20 100 H980"
          fill="none"
          stroke="#93375d"
          strokeWidth="3"
        />
      </svg>
      <svg
        className="story-line-mobile"
        viewBox="0 0 2 1000"
        preserveAspectRatio="none"
      >
        <path d="M1 0 V1000" stroke="#922f551c" strokeWidth="2" />
        <path
          className="draw-path"
          d="M1 0 V1000"
          stroke="#93375d"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
