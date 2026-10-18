"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toolkit } from "@/content/portfolio";
import { useExperience } from "./experience-context";
export function Toolkit() {
  const [selected, setSelected] = useState(0);
  const { enabled } = useExperience();
  const skill = toolkit[selected];
  return (
    <div className="toolkit-layout">
      <div
        className="technology-list"
        role="tablist"
        aria-label="My technologies"
        aria-orientation="vertical"
      >
        {toolkit.map((item, i) => (
          <button
            key={item.name}
            role="tab"
            id={"technology-" + i}
            aria-selected={selected === i}
            aria-controls="technology-detail"
            tabIndex={selected === i ? 0 : -1}
            onClick={() => setSelected(i)}
            onKeyDown={(event) => {
              if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
                event.preventDefault();
                const next =
                  event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? toolkit.length - 1
                      : (i +
                          (event.key === "ArrowDown" ? 1 : -1) +
                          toolkit.length) %
                        toolkit.length;
                setSelected(next);
                document.getElementById("technology-" + next)?.focus();
              }
            }}
          >
            <span className="technology-count">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{item.name}</span>
            <span className="technology-type">{item.type}</span>
            <span className="technology-arrow" aria-hidden="true">
              ↗
            </span>
            {selected === i && (
              <motion.span
                layoutId="technology-line"
                className="technology-line"
                transition={{
                  duration: enabled ? 0.35 : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            )}
          </button>
        ))}
      </div>
      <div
        className="technology-detail glass"
        role="tabpanel"
        id="technology-detail"
        aria-labelledby={"technology-" + selected}
        tabIndex={0}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={skill.name}
            initial={{ opacity: enabled ? 0 : 1, y: enabled ? 12 : 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: enabled ? 0 : 1, y: enabled ? -8 : 0 }}
            transition={{ duration: enabled ? 0.2 : 0 }}
          >
            <div className="detail-top">
              <span>{skill.type}</span>
              <span>{String(selected + 1).padStart(2, "0")} / 05</span>
            </div>
            <div className="technology-glyph" aria-hidden="true">
              {skill.symbol}
            </div>
            <h3>{skill.name}</h3>
            <p>{skill.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
