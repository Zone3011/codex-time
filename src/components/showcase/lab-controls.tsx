"use client";
import { useExperience } from "./experience-context";
export function LabControls() {
  const { mode, setMode, rotation, setRotation } = useExperience();
  return (
    <div className="lab-console glass">
      <div className="console-top">
        <span className="live-dot" />A real-time experiment
        <span className="console-mark">N / P</span>
      </div>
      <div className="scene-modes" role="group" aria-label="Particle formation">
        {["Structure", "Orbit", "Scatter"].map((name, index) => (
          <button
            key={name}
            aria-pressed={mode === index}
            onClick={() => setMode(index)}
          >
            <span className={"mode-icon mode-" + index} aria-hidden="true" />
            {name}
          </button>
        ))}
      </div>
      <label className="rotation-control">
        Change your perspective
        <input
          type="range"
          min="-180"
          max="180"
          value={rotation}
          onChange={(event) => setRotation(Number(event.target.value))}
        />
      </label>
      <p>
        Move your pointer. Try another formation.
        <br />
        The camera travels with you as you scroll.
      </p>
    </div>
  );
}
