"use client";
import { useEffect } from "react";
import { useExperience } from "./experience-context";

/** Assist a completed wheel gesture without blocking native scrolling. */
export function SectionScroll() {
  const { enabled } = useExperience();
  useEffect(() => {
    if (!enabled) return;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main > section"),
    );
    let timer = 0;
    let distance = 0;
    let direction = 0;
    let cooldown = 0;
    const cancel = () => {
      window.clearTimeout(timer);
      distance = 0;
    };
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY))
        return;
      if (
        event.target instanceof Element &&
        event.target.closest(
          "input, textarea, select, [role='dialog'], [contenteditable='true']",
        )
      )
        return;
      const nextDirection = Math.sign(event.deltaY);
      if (!nextDirection || performance.now() < cooldown) return;
      if (direction !== nextDirection) distance = 0;
      direction = nextDirection;
      distance +=
        Math.abs(event.deltaY) *
        (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (distance < 18) return;
        distance = 0;
        const offset = 110;
        const position = window.scrollY + Math.max(offset, innerHeight * 0.48);
        let index = 0;
        sections.forEach((section, i) => {
          if (section.offsetTop <= position + 1) index = i;
        });
        const current = sections[index];
        if (!current) return;
        // Read tall chapters normally; assist only near the appropriate edge.
        const remaining =
          current.offsetTop + current.offsetHeight - (scrollY + innerHeight);
        const target =
          direction > 0
            ? remaining <= 140
              ? sections[index + 1]
              : undefined
            : scrollY - current.offsetTop <= 180
              ? sections[index - 1]
              : undefined;
        if (!target) return;
        cooldown = performance.now() + 1000;
        window.scrollTo({
          top: Math.max(0, target.offsetTop - offset),
          behavior: "smooth",
        });
      }, 110);
    };
    window.addEventListener("wheel", wheel, { passive: true });
    window.addEventListener("pointerdown", cancel, { passive: true });
    window.addEventListener("keydown", cancel);
    return () => {
      cancel();
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("pointerdown", cancel);
      window.removeEventListener("keydown", cancel);
    };
  }, [enabled]);
  return null;
}
