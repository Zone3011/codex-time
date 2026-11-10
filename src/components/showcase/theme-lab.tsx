"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useMotionEnabled } from "./motion-settings";

const variants = ["Ink", "Glitch", "Ripple", "Sweep"] as const;
type Variant = (typeof variants)[number];
const subscribe = () => () => {};
const client = () => true;
const server = () => false;

function framesFor(variant: Variant, x: number, y: number): Keyframe[] {
  const radius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  );
  if (variant === "Ripple")
    return [
      { clipPath: `circle(0px at ${x}px ${y}px)` },
      { clipPath: `circle(${radius}px at ${x}px ${y}px)` },
    ];
  if (variant === "Sweep")
    return [
      { clipPath: "polygon(0 0, 0 0, -25% 100%, 0 100%)" },
      { clipPath: "polygon(0 0, 70% 0, 45% 100%, 0 100%)" },
      { clipPath: "polygon(0 0, 125% 0, 100% 100%, 0 100%)" },
    ];
  if (variant === "Ink")
    return [0, 0.2, 0.48, 0.76, 1.3].map((scale, frame) => ({
      clipPath: `polygon(${Array.from({ length: 360 }, (_, i) => {
        const angle = (i / 360) * Math.PI * 2;
        const wave =
          1 +
          0.13 * Math.sin(angle * 7 + frame * 0.5) +
          0.07 * Math.cos(angle * 13 - frame * 0.8) +
          0.035 * Math.sin(angle * 23);
        return `${x + Math.cos(angle) * radius * scale * wave}px ${y + Math.sin(angle) * radius * scale * wave}px`;
      }).join(",")})`,
    }));
  return [0, 0.25, 0.5, 0.75, 1].map((progress, frame) => {
    const edge = Array.from({ length: 16 }, (_, i) => {
      const width =
        progress === 0
          ? 0
          : progress === 1
            ? 100
            : Math.max(
                0,
                Math.min(
                  100,
                  progress * 100 + Math.sin(i * 13 + frame * 9) * 22,
                ),
              );
      return `${width}% ${(i / 16) * 100}%, ${width}% ${((i + 1) / 16) * 100}%`;
    }).join(",");
    return {
      clipPath: `polygon(0 0,${edge},0 100%)`,
      transform: `translateX(${frame % 2 && progress < 1 ? -8 : 0}px)`,
    };
  });
}

export function ThemeLab() {
  const hydrated = useSyncExternalStore(subscribe, client, server);
  const [variant, setVariant] = useState<Variant>("Ink");
  const [dark, setDark] = useState(false);
  const [busy, setBusy] = useState(false);
  const motion = useMotionEnabled();
  const active = useRef<ViewTransition | null>(null);
  const animation = useRef<Animation | null>(null);
  useEffect(() => {
    if (!motion) {
      active.current?.skipTransition();
      animation.current?.cancel();
    }
    const stop = () => {
      if (document.hidden) {
        active.current?.skipTransition();
        animation.current?.cancel();
      }
    };
    document.addEventListener("visibilitychange", stop);
    return () => {
      document.removeEventListener("visibilitychange", stop);
      active.current?.skipTransition();
      animation.current?.cancel();
    };
  }, [motion]);
  const preview = async (button: HTMLButtonElement) => {
    if (busy || active.current) return;
    const root = document.documentElement;
    const next = !dark;
    const update = () => {
      root.dataset.theme = next ? "dark" : "light";
      setDark(next);
    };
    if (!motion || !document.startViewTransition) {
      update();
      return;
    }
    setBusy(true);
    window.SwarmIntro?.skip();
    const box = button.getBoundingClientRect();
    root.dataset.themeEffect = variant.toLowerCase();
    const transition = document.startViewTransition(update);
    active.current = transition;
    try {
      await transition.ready;
      animation.current = root.animate(
        framesFor(variant, box.left + box.width / 2, box.top + box.height / 2),
        {
          duration: variant === "Glitch" ? 650 : 1150,
          easing:
            variant === "Glitch" ? "steps(1, end)" : "cubic-bezier(.45,0,.2,1)",
          pseudoElement: "::view-transition-new(root)",
          fill: "both",
        },
      );
      await transition.finished;
    } catch {
      /* A hidden tab or motion change can skip the snapshot safely. */
    } finally {
      animation.current?.cancel();
      animation.current = null;
      active.current = null;
      delete root.dataset.themeEffect;
      setBusy(false);
    }
  };
  if (!hydrated) return null;
  return (
    <details className="theme-lab" data-swarm-ignore>
      <summary>
        ◐ <span>Theme effects</span>
      </summary>
      <div className="theme-lab-panel">
        <p>Try a transition</p>
        <div
          className="theme-variants"
          role="group"
          aria-label="Theme transition style"
        >
          {variants.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={name === variant}
              disabled={busy}
              onClick={() => setVariant(name)}
            >
              {name}
            </button>
          ))}
        </div>
        <button
          className="theme-preview"
          type="button"
          disabled={busy}
          onClick={(event) => void preview(event.currentTarget)}
        >
          {busy ? "Switching…" : `Preview ${dark ? "light" : "dark"}`}{" "}
          <span aria-hidden="true">↗</span>
        </button>
        <span className="theme-lab-status" role="status">
          {variant} · {dark ? "Dark" : "Light"} mode
        </span>
      </div>
    </details>
  );
}
