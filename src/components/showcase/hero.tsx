"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useExperience, usePageVisible } from "./experience-context";
import { useInView } from "motion/react";
export function HeroArtwork() {
  const root = useRef<HTMLDivElement>(null);
  const { enabled } = useExperience();
  const inView = useInView(root);
  const visible = usePageVisible();
  useEffect(() => {
    if (!enabled || !inView || !visible || !root.current) return;
    const element = root.current;
    const context = gsap.context(() => {
      gsap.from(".petal", {
        scale: 0.55,
        rotation: "-=35",
        duration: 1.5,
        stagger: 0.045,
        ease: "elastic.out(1,.65)",
      });
      gsap.to(".bloom-spin", {
        rotation: 360,
        duration: 65,
        ease: "none",
        repeat: -1,
      });
    }, root);
    const x = gsap.quickTo(element, "rotationY", {
      duration: 1,
      ease: "power3.out",
    });
    const y = gsap.quickTo(element, "rotationX", {
      duration: 1,
      ease: "power3.out",
    });
    const move = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      x((event.clientX - rect.left - rect.width / 2) / 35);
      y(-(event.clientY - rect.top - rect.height / 2) / 35);
    };
    const reset = () => {
      x(0);
      y(0);
    };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", reset);
    return () => {
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", reset);
      x.tween.kill();
      y.tween.kill();
      context.revert();
    };
  }, [enabled, inView, visible]);
  return (
    <div className="hero-art" ref={root} aria-hidden="true">
      <div className="art-orbit orbit-one" />
      <div className="art-orbit orbit-two" />
      <svg className="bloom" viewBox="0 0 600 600">
        <defs>
          <linearGradient id="petal" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#e6d9ff" />
            <stop offset=".55" stopColor="#8a66e9" />
            <stop offset="1" stopColor="#45308b" />
          </linearGradient>
          <radialGradient id="bloom-center">
            <stop stopColor="#fff5de" />
            <stop offset="1" stopColor="#e6b890" />
          </radialGradient>
        </defs>
        <g className="bloom-spin" style={{ transformOrigin: "300px 300px" }}>
          {Array.from({ length: 12 }, (_, i) => (
            <g key={i} transform={`rotate(${i * 30} 300 300)`}>
              <ellipse
                className="petal"
                cx="300"
                cy="188"
                rx="57"
                ry="140"
                fill="url(#petal)"
                stroke="#dac6ff"
                strokeWidth=".8"
                style={{ transformOrigin: "300px 300px" }}
              />
            </g>
          ))}
          <circle cx="300" cy="300" r="65" fill="url(#bloom-center)" />
          <text
            x="300"
            y="316"
            textAnchor="middle"
            fill="#40315f"
            fontSize="50"
            fontFamily="Space Grotesk Variable"
            fontWeight="600"
          >
            np
          </text>
        </g>
      </svg>
      <span className="art-coordinate">N / P — A WORK IN MOTION</span>
      <span className="floating-label">a little unexpected ↗</span>
    </div>
  );
}
