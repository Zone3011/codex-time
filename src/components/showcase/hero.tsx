"use client";
import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useExperience } from "./experience-context";
const colors = [
  "#ff4b24",
  "#183df5",
  "#ffc900",
  "#ec2e90",
  "#19bda5",
  "#fffdf2",
];
export function HeroArtwork() {
  const root = useRef<HTMLDivElement>(null);
  const [edition, setEdition] = useState(0);
  const { enabled } = useExperience();
  useEffect(() => {
    if (!root.current) return;
    const tiles = root.current.querySelectorAll<HTMLElement>(".color-tile");
    const context = gsap.context(() => {
      tiles.forEach((tile, i) => {
        const color = colors[(i + edition) % colors.length];
        gsap.to(tile, {
          backgroundColor: color,
          color: color === "#183df5" ? "#fffdf2" : "#141414",
          duration: enabled && edition > 0 ? 0.24 : 0,
          delay: enabled && edition > 0 ? i * 0.018 : 0,
          ease: "power2.out",
        });
      });
    }, root);
    return () => context.revert();
  }, [edition, enabled]);
  return (
    <div className="hero-art" ref={root}>
      <div className="color-composition" aria-hidden="true">
        <div className="color-tile tile-letter">N</div>
        <div className="color-tile tile-disc">
          <span />
        </div>
        <div className="color-tile tile-arrow">↗</div>
        <div className="color-tile tile-bars">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="color-tile tile-letter tile-p">P</div>
        <div className="color-tile tile-code">{"{ }"}</div>
        <div className="color-tile tile-coordinate">
          22° /<br />
          NOT FIXED.
        </div>
        <div className="color-tile tile-check">
          <span />
        </div>
        <div className="color-tile tile-plus">+</div>
      </div>
      <div className="color-caption">
        <span>COMPOSITION / {String(edition + 1).padStart(2, "0")}</span>
        <button onClick={() => setEdition((value) => value + 1)}>
          Remix the colors ↻
        </button>
      </div>
    </div>
  );
}
