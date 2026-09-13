"use client";

import { useEffect, useState } from "react";
import { legalUrls } from "@/lib/legal";

const ACK_KEY = "tindahan-cookie-notice-v1";

export function LegalNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(window.localStorage.getItem(ACK_KEY) !== "acknowledged");
    } catch {
      setVisible(true);
    }
  }, []);

  function acknowledge() {
    try {
      window.localStorage.setItem(ACK_KEY, "acknowledged");
    } catch {
      // Still allow dismissal for the current page view.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie notice"
      style={{
        position: "fixed",
        zIndex: 1000,
        right: "var(--space-4)",
        bottom: "var(--space-4)",
        width: "min(430px, calc(100vw - 32px))",
        padding: "var(--space-4)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        background: "var(--color-surface)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <strong style={{ display: "block", marginBottom: "var(--space-1)" }}>Essential cookies only</strong>
      <p className="text-sm text-muted" style={{ margin: "0 0 var(--space-3)", lineHeight: 1.55 }}>
        Tindahan uses necessary cookies for secure sign-in and saved language/theme preferences. We do not currently use advertising or analytics cookies.
      </p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)" }}>
        <a href={legalUrls.cookies} target="_blank" rel="noreferrer" className="text-sm" style={{ color: "var(--color-brand-primary)", fontWeight: "var(--weight-semibold)" }}>
          Cookie Policy
        </a>
        <button className="btn btn-primary" type="button" onClick={acknowledge}>Got it</button>
      </div>
    </aside>
  );
}
