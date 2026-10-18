"use client";
import { useState, useRef, useEffect } from "react";
import { useExperience } from "./experience-context";
import { profile } from "@/content/portfolio";
export function ContactActions() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const { enabled } = useExperience();
  const confetti = useRef<{ reset: () => void } | null>(null);
  useEffect(
    () => () => {
      confetti.current?.reset();
    },
    [],
  );
  useEffect(() => {
    if (!enabled) confetti.current?.reset();
  }, [enabled]);
  const celebrate = async () => {
    setMessage("Thanks for stopping by. — Nirav");
    if (!enabled) return;
    setBusy(true);
    try {
      const { default: burst } = await import("canvas-confetti");
      confetti.current = burst;
      await burst({
        particleCount: 70,
        spread: 65,
        startVelocity: 24,
        origin: { x: 0.5, y: 0.7 },
        colors: ["#6e54a3", "#264e42", "#edb89a", "#eef5db"],
        disableForReducedMotion: true,
        gravity: 0.85,
        ticks: 150,
      });
    } finally {
      setBusy(false);
    }
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setMessage("Email copied. Say hello when you’re ready.");
    } catch {
      setMessage(
        "Couldn’t copy here. You can select the email above or open your email app.",
      );
    }
  };
  return (
    <div className="contact-actions">
      <a className="email-link" href={"mailto:" + profile.email}>
        {profile.email}
        <span aria-hidden="true">↗</span>
      </a>
      <div className="contact-buttons">
        <button onClick={copy}>
          Copy email <span aria-hidden="true">⧉</span>
        </button>
        <button onClick={celebrate} disabled={busy}>
          {busy ? "A little celebration…" : "One last little thing"}{" "}
          <span aria-hidden="true">✳</span>
        </button>
      </div>
      <p role="status" className="contact-status">
        {message || "No forms. No fuss. Just an email."}
      </p>
    </div>
  );
}
