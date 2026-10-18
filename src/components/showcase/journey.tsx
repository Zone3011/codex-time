"use client";
import { Component, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useExperience, usePageVisible } from "./experience-context";
import type { WorldInput } from "./journey-scene";
const Scene = dynamic(() => import("./journey-scene"), {
  ssr: false,
  loading: () => (
    <div className="scene-fallback" aria-hidden="true">
      <span>N</span>
    </div>
  ),
});
class SceneBoundary extends Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="scene-fallback" aria-hidden="true">
        <span>N</span>
      </div>
    ) : (
      this.props.children
    );
  }
}
export function Journey() {
  const input = useRef<WorldInput>({ progress: 0, x: 0, y: 0 });
  const { enabled, mode, rotation, active } = useExperience();
  const visible = usePageVisible();
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("main > section"),
      );
      let progress = 0;
      const marker = window.innerHeight * 0.15;
      for (let i = 0; i < sections.length; i++) {
        const top = sections[i].getBoundingClientRect().top;
        if (top <= marker) {
          const next = sections[i + 1];
          const distance = next
            ? next.getBoundingClientRect().top - top
            : sections[i].offsetHeight;
          const fraction = Math.max(
            0,
            Math.min(1, (marker - top) / Math.max(distance, 1)),
          );
          const phase = Math.max(0, Math.min(1, (fraction - 0.83) / 0.17));
          progress = i + phase * phase * (3 - 2 * phase);
        }
      }
      input.current.progress = Math.min(4, progress);
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const pointer = (event: PointerEvent) => {
      input.current.x = event.clientX / window.innerWidth - 0.5;
      input.current.y = event.clientY / window.innerHeight - 0.5;
    };
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    window.addEventListener("pointermove", pointer, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
      window.removeEventListener("pointermove", pointer);
    };
  }, []);
  return (
    <div className="journey-world" aria-hidden="true">
      <SceneBoundary>
        <Scene
          input={input}
          enabled={enabled && visible}
          mode={mode}
          rotation={rotation}
          chapter={active}
        />
      </SceneBoundary>
      <div className="world-vignette" />
    </div>
  );
}
