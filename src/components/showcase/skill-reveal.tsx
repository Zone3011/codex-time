"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMotionEnabled } from "./motion-settings";

export function SkillReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  const motion = useMotionEnabled();
  useEffect(() => {
    const root = ref.current;
    if (!root || !motion) return;
    const animations = new Set<Animation>();
    const finish = () => {
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    };
    const observer = new IntersectionObserver(
      (entries) => {
        let order = 0;
        entries.forEach((entry) => {
          const card = entry.target as HTMLElement;
          if (
            !entry.isIntersecting ||
            entry.intersectionRatio < 0.6 ||
            card.dataset.arrived
          )
            return;
          card.dataset.arrived = "true";
          observer.unobserve(card);
          const animation = card.animate(
            [
              { opacity: 0, transform: "translateY(64px) rotate(-14deg)" },
              {
                opacity: 1,
                transform: "translateY(-6px) rotate(5deg)",
                offset: 0.65,
              },
              { opacity: 1, transform: "translateY(0) rotate(0deg)" },
            ],
            {
              duration: 760,
              delay: order++ * 140,
              easing: "cubic-bezier(.22,.7,.25,1)",
              fill: "backwards",
            },
          );
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        });
      },
      { threshold: [0, 0.6, 1] },
    );
    root
      .querySelectorAll(".skill-keychain")
      .forEach((card) => observer.observe(card));
    const visibility = () => {
      if (document.hidden) finish();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      finish();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [motion]);
  return (
    <ul className="skills-keychains" ref={ref} aria-label="Development toolkit">
      {children}
    </ul>
  );
}
