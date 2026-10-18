"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useExperience } from "./experience-context";
import { toolkit } from "@/content/portfolio";
export function SkillsExplorer() {
  const [selected, setSelected] = useState(0);
  const { enabled } = useExperience();
  const skill = toolkit[selected];
  return (
    <div className="skills-explorer">
      <div
        className="skill-options"
        role="tablist"
        aria-label="Explore my technologies"
        aria-orientation="vertical"
      >
        {toolkit.map((item, i) => (
          <button
            role="tab"
            id={`skill-tab-${i}`}
            aria-controls="skill-panel"
            aria-selected={selected === i}
            tabIndex={selected === i ? 0 : -1}
            key={item.name}
            onClick={() => setSelected(i)}
            onKeyDown={(e) => {
              if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
                e.preventDefault();
                const next =
                  e.key === "Home"
                    ? 0
                    : e.key === "End"
                      ? toolkit.length - 1
                      : (i +
                          (e.key === "ArrowDown" ? 1 : -1) +
                          toolkit.length) %
                        toolkit.length;
                setSelected(next);
                document.getElementById(`skill-tab-${next}`)?.focus();
              }
            }}
          >
            {selected === i && (
              <motion.span
                className="skill-highlight"
                layoutId="skill-highlight"
                transition={{
                  duration: enabled ? 0.16 : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            )}
            <span className="skill-name">{item.name}</span>
            <span className="skill-type">{item.type}</span>
            <span className="skill-arrow" aria-hidden="true">
              ↗
            </span>
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id="skill-panel"
        aria-labelledby={`skill-tab-${selected}`}
        tabIndex={0}
        className="skill-panel"
        style={{ "--skill-color": skill.color } as React.CSSProperties}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={skill.name}
            initial={{ opacity: enabled ? 0 : 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: enabled ? 0 : 1, y: 0 }}
            transition={{ duration: enabled ? 0.12 : 0 }}
          >
            <span className="skill-panel-label">{skill.type}</span>
            <div className="skill-symbol" aria-hidden="true">
              {skill.symbol}
            </div>
            <h3>{skill.name}</h3>
            <p>{skill.text}</p>
            <span className="skill-code">{skill.code}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
