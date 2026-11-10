"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useMotionEnabled } from "./motion-settings";
import { inkFrames } from "./ink-transition";
const subscribe = () => () => {};
const client = () => true;
const server = () => false;

export function ThemeLab() {
  const hydrated = useSyncExternalStore(subscribe, client, server);
  const [dark, setDark] = useState(false);
  const [busy, setBusy] = useState(false);
  const motion = useMotionEnabled();
  const active = useRef<ViewTransition | null>(null);
  const animation = useRef<Animation | null>(null);
  useEffect(() => {
    const cancel = () => {
      active.current?.skipTransition();
      animation.current?.cancel();
    };
    if (!motion) cancel();
    const visibility = () => {
      if (document.hidden) cancel();
    };
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("resize", cancel);
    return () => {
      cancel();
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("resize", cancel);
    };
  }, [motion]);
  const toggle = async (button: HTMLButtonElement) => {
    if (busy || active.current) return;
    const root = document.documentElement;
    const next = !dark;
    const update = () => {
      root.dataset.theme = next ? "dark" : "light";
      setDark(next);
    };
    if (
      !motion ||
      !document.startViewTransition ||
      !CSS.supports("clip-path", "path('M0 0L1 0L1 1Z')")
    ) {
      update();
      return;
    }
    setBusy(true);
    window.SwarmIntro?.skip();
    const box = button.getBoundingClientRect();
    root.dataset.themeEffect = "ink";
    const transition = document.startViewTransition(update);
    active.current = transition;
    try {
      await transition.ready;
      animation.current = root.animate(
        inkFrames(
          box.left + box.width / 2,
          box.top + box.height / 2,
          innerWidth,
          innerHeight,
        ),
        {
          duration: 2300,
          easing: "cubic-bezier(.25,.1,.25,1)",
          pseudoElement: "::view-transition-new(root)",
          fill: "both",
        },
      );
      await transition.finished;
    } catch {
      /* Interrupted snapshots keep the new theme and restore interaction. */
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
    <button
      className="theme-toggle"
      data-swarm-ignore
      type="button"
      disabled={busy}
      aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
      aria-pressed={dark}
      onClick={(event) => void toggle(event.currentTarget)}
    >
      <span aria-hidden="true">{dark ? "☀" : "◐"}</span>
      <span>
        {busy ? "Ink is flowing…" : `${dark ? "Light" : "Dark"} mode`}
      </span>
    </button>
  );
}
