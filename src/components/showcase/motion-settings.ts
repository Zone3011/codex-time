"use client";

import { useSyncExternalStore } from "react";

let paused = false;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
const snapshot = () => paused;
const serverPaused = () => false;
export function useMotionPaused() {
  return useSyncExternalStore(subscribe, snapshot, serverPaused);
}
export function setMotionPaused(value: boolean) {
  paused = value;
  listeners.forEach((listener) => listener());
}
const subscribeReduced = (listener: () => void) => {
  const query = matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
};
const reducedSnapshot = () =>
  matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverReduced = () => true;
export function useMotionEnabled() {
  const isPaused = useMotionPaused();
  const reduced = useSyncExternalStore(
    subscribeReduced,
    reducedSnapshot,
    serverReduced,
  );
  return !isPaused && !reduced;
}
