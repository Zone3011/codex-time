"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { experiences } from "@/content/experiences";
import { useExperience } from "./experience-context";
export function Companion() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { enabled, active } = useExperience();
  const chapter =
    experiences.find((item) => item.id === active) || experiences[0];
  if (hidden)
    return (
      <button className="restore-guide" onClick={() => setHidden(false)}>
        Show guide ◌
      </button>
    );
  return (
    <aside
      className="companion"
      aria-label="Optional section guide"
      style={{ "--guide-color": chapter.color } as React.CSSProperties}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
          document.getElementById("guide-toggle")?.focus();
        }
      }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            className="guide-card"
            id="guide-description"
            initial={{ opacity: 0, y: enabled ? 10 : 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: enabled ? 10 : 0 }}
            transition={{ duration: enabled ? 0.2 : 0 }}
          >
            <div className="guide-heading">
              <span>YOUR LITTLE GUIDE</span>
              <button onClick={() => setOpen(false)} aria-label="Close guide">
                ×
              </button>
            </div>
            <h3>
              {chapter.label} <span>with {chapter.engine}</span>
            </h3>
            <p>{chapter.tip}</p>
            <button
              className="hide-guide"
              onClick={() => {
                setOpen(false);
                setHidden(true);
              }}
            >
              Hide guide for now ↘
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        id="guide-toggle"
        aria-label={open ? "Close section guide" : "Open section guide"}
        className="guide-toggle"
        aria-expanded={open}
        aria-controls="guide-description"
        onClick={() => setOpen(!open)}
      >
        <span className="guide-blob" aria-hidden="true">
          <i />
          <i />
        </span>
        <span>
          {open ? "Close guide" : "What’s happening?"}
          <small>
            {chapter.label} / {chapter.engine}
          </small>
        </span>
        <span className="guide-plus" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>
    </aside>
  );
}
