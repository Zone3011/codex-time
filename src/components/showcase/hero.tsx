"use client";
import { Component, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { useInView } from "motion/react";
import { useExperience, usePageVisible } from "./experience-context";
import type { ParticleInput } from "./particle-scene";
const Scene = dynamic(() => import("./particle-scene"), {
  ssr: false,
  loading: () => <div className="particle-fallback">N</div>,
});
class ParticleBoundary extends Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="particle-fallback">N</div>
    ) : (
      this.props.children
    );
  }
}
export function HeroArtwork() {
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<ParticleInput>({ progress: 0, x: 0, y: 0 });
  const { enabled } = useExperience();
  const visible = usePageVisible();
  const inView = useInView(root, { margin: "100px" });
  const [connected, setConnected] = useState(false);
  const entered = useRef(false);
  useEffect(() => {
    if (!root.current) return;
    const section = root.current.closest<HTMLElement>(".hero")!;
    const copy = section.querySelector(".hero-copy");
    const label = section.querySelector(".hero-foot");
    const scroll = () => {
      const rect = section.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(
          1,
          -rect.top / (section.offsetHeight - window.innerHeight || 1),
        ),
      );
      input.current.progress = connected ? Math.max(0.65, progress) : progress;
      if (enabled) {
        gsap.set(copy, { opacity: 1 - progress * 0.9, y: -progress * 90 });
        gsap.set(label, { opacity: 1 - progress });
      }
    };
    const pointer = (event: PointerEvent) => {
      input.current.x = event.clientX / window.innerWidth - 0.5;
      input.current.y = event.clientY / window.innerHeight - 0.5;
    };
    const context = gsap.context(() => {
      if (enabled && !entered.current) {
        entered.current = true;
        gsap.from(".hero-copy > *", {
          opacity: 0,
          y: 20,
          duration: 0.9,
          stagger: 0.09,
          ease: "power3.out",
          clearProps: "all",
        });
      }
    }, section);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    window.addEventListener("pointermove", pointer, { passive: true });
    return () => {
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
      window.removeEventListener("pointermove", pointer);
      context.revert();
      gsap.set([copy, label], { clearProps: "opacity,transform" });
    };
  }, [enabled, connected]);
  return (
    <div className="hero-art particle-art" ref={root}>
      <div
        className="particle-stage"
        role="img"
        aria-label="An original three-dimensional N formed from connected dots, unfolding as you scroll"
      >
        <ParticleBoundary>
          <Scene input={input} enabled={enabled && visible && inView} />
        </ParticleBoundary>
      </div>
      <div className="particle-caption">
        <span>
          <i />
          CONNECTED BY CURIOSITY
        </span>
        <button
          onClick={() => setConnected((value) => !value)}
          aria-pressed={connected}
        >
          {connected ? "Bring it together" : "Explore the connections"}{" "}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </div>
  );
}
