"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useExperience } from "./experience-context";
gsap.registerPlugin(ScrollTrigger);
export function PageMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const { enabled } = useExperience();
  useEffect(() => {
    if (!enabled || !root.current) return;
    const context = gsap.context(() => {
      gsap.from(".intro-reveal", {
        opacity: 0,
        y: 24,
        duration: 1.15,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "all",
      });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 34,
          duration: 1.05,
          ease: "power3.out",
          clearProps: "all",
          onStart: () => {
            element.dataset.revealState = "running";
          },
          onComplete: () => {
            element.dataset.revealState = "complete";
          },
          scrollTrigger: { trigger: element, start: "top 91%", once: true },
        });
      });
      gsap.to(".scroll-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    }, root);
    return () => context.revert();
  }, [enabled]);
  return (
    <div ref={root} className="page-motion">
      {children}
      <div className="scroll-progress" aria-hidden="true" />
    </div>
  );
}
