"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { useMotionEnabled } from "./motion-settings";
export function SkillReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  const motion = useMotionEnabled();
  useEffect(() => {
    const root = ref.current;
    if (!root || !motion) return;
    const cards = Array.from(
      root.querySelectorAll<HTMLElement>(".skill-keychain"),
    );
    const animations = new Map<HTMLElement, Animation>();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const atLevel = (card: HTMLElement) => {
      const center =
        root.getBoundingClientRect().top +
        card.offsetTop +
        card.offsetHeight / 2;
      return (
        card.offsetHeight > 0 &&
        Math.abs(center - innerHeight / 2) <= innerHeight * 0.16
      );
    };
    const finish = () => {
      animations.forEach((animation, card) => {
        animation.cancel();
        delete card.dataset.arrived;
      });
      animations.clear();
    };
    const start = () => {
      if (document.hidden) return;
      let order = 0;
      cards.forEach((card) => {
        if (!atLevel(card) || card.dataset.arrived) return;
        card.dataset.arrived = "true";
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
            duration: 1100,
            delay: order++ * 180,
            easing: "cubic-bezier(.22,.7,.25,1)",
            fill: "backwards",
          },
        );
        animations.set(card, animation);
        animation.onfinish = () => animations.delete(card);
      });
    };
    const schedule = () => {
      clearTimeout(timer);
      animations.forEach((animation, card) => {
        if (!atLevel(card)) {
          animation.cancel();
          delete card.dataset.arrived;
          animations.delete(card);
        }
      });
      if (!document.hidden) timer = setTimeout(start, 300);
    };
    const observer = new IntersectionObserver(schedule, {
      threshold: [0, 0.5, 1],
    });
    cards.forEach((card) => observer.observe(card));
    const visibility = () => {
      if (document.hidden) {
        clearTimeout(timer);
        finish();
      } else schedule();
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      finish();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [motion]);
  return (
    <ul className="skills-keychains" ref={ref} aria-label="Development toolkit">
      {children}
    </ul>
  );
}
