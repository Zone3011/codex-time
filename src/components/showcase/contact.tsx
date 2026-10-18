"use client";
import { useState } from "react";
import { profile } from "@/content/portfolio";
export function ContactActions() {
  const [message, setMessage] = useState("");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setMessage("Email copied. Looking forward to hearing from you.");
    } catch {
      setMessage(
        "You can select the email address or open it in your email app.",
      );
    }
  };
  return (
    <div className="contact-actions">
      <a className="email-link" href={"mailto:" + profile.email}>
        {profile.email}
        <span aria-hidden="true">↗</span>
      </a>
      <div className="contact-options">
        <button onClick={copy}>
          Copy email <span aria-hidden="true">⧉</span>
        </button>
        <span>No forms. Just a conversation.</span>
      </div>
      <p className="contact-status" role="status">
        {message}
      </p>
    </div>
  );
}
