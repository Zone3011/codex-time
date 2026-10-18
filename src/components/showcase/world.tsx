"use client";
import dynamic from "next/dynamic";
import { Component, useRef, useState } from "react";
import { useInView } from "motion/react";

const Scene = dynamic(() => import("./world-scene"), {
  ssr: false,
  loading: () => (
    <div className="world-fallback">
      <div className="fallback-orb" />
    </div>
  ),
});
class SceneBoundary extends Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="world-fallback">
        <div className="fallback-orb" />
        <p>3D is unavailable on this device. The rest is yours to explore.</p>
      </div>
    ) : (
      this.props.children
    );
  }
}
export function WorldExperience() {
  const host = useRef<HTMLDivElement>(null);
  const near = useInView(host, { margin: "250px" });

  const [rotation, setRotation] = useState(25);
  const [finish, setFinish] = useState(0);
  return (
    <div className="world-experience">
      <div
        ref={host}
        className="world-stage"
        role="img"
        aria-label="An iridescent three-dimensional knot sculpture with adjustable rotation"
      >
        {near ? (
          <SceneBoundary>
            <Scene enabled={false} rotation={rotation} finish={finish} />
          </SceneBoundary>
        ) : (
          <div className="world-fallback">
            <div className="fallback-orb" />
          </div>
        )}
        <span className="world-annotation annotation-one">
          FORM / EXPLORATION
        </span>
        <span className="world-annotation annotation-two">
          REAL-TIME, NOT A RENDER.
        </span>
        <span className="world-cross cross-one">+</span>
        <span className="world-cross cross-two">+</span>
      </div>
      <div className="world-controls">
        <div
          className="finish-options"
          role="group"
          aria-label="Sculpture finish"
        >
          <button onClick={() => setFinish(0)} aria-pressed={finish === 0}>
            <span className="swatch violet" />
            Dusk
          </button>
          <button onClick={() => setFinish(1)} aria-pressed={finish === 1}>
            <span className="swatch jade" />
            Jade
          </button>
        </div>
        <label>
          Turn the sculpture{" "}
          <input
            type="range"
            min="-180"
            max="180"
            value={rotation}
            onChange={(event) => setRotation(Number(event.target.value))}
          />
        </label>
      </div>
    </div>
  );
}
