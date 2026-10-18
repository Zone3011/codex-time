"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useSyncExternalStore,
} from "react";
const ExperienceContext = createContext({
  enabled: true,
  paused: false,
  reduced: false,
  active: "home",
  mode: 1,
  rotation: 20,
  toggle: () => {},
  setMode: (value: number) => {
    void value;
  },
  setRotation: (value: number) => {
    void value;
  },
});
const subscribeReduced = (listener: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
};
const getReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export function ExperienceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState("home");
  const [mode, setMode] = useState(1);
  const [rotation, setRotation] = useState(20);
  const reduced = useSyncExternalStore(
    subscribeReduced,
    getReduced,
    () => false,
  );
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = "home";
      document.querySelectorAll("main > section").forEach((section) => {
        if (section.getBoundingClientRect().top <= window.innerHeight * 0.48)
          current = section.id;
      });
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return (
    <ExperienceContext.Provider
      value={{
        enabled: !paused && !reduced,
        paused,
        reduced,
        active,
        mode,
        rotation,
        toggle: () => setPaused((value) => !value),
        setMode,
        setRotation,
      }}
    >
      <div
        data-chapter={active}
        className={
          !paused && !reduced ? "experience" : "experience motion-paused"
        }
      >
        {children}
      </div>
    </ExperienceContext.Provider>
  );
}
export const useExperience = () => useContext(ExperienceContext);
export function usePageVisible() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return visible;
}
