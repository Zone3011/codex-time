"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
export function Motion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.from("[data-intro]", {
          y: 22,
          opacity: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "all",
        });
      }, root);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);
  return <div ref={root}>{children}</div>;
}
