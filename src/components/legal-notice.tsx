"use client";

import { useSyncExternalStore } from "react";
import { legalUrls } from "@/lib/legal";

const ACK_KEY = "tindahan-cookie-notice-v1";
const NOTICE_EVENT = "tindahan-cookie-notice-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(NOTICE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(NOTICE_EVENT, callback);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(ACK_KEY) !== "acknowledged";
  } catch {
    return true;
  }
}

function getServerSnapshot() {
  return false;
}

export function LegalNotice() {
  const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function acknowledge() {
    try {
      window.localStorage.setItem(ACK_KEY, "acknowledged");
    } catch {
      // Storage may be blocked; the notice will return on the next navigation.
    }
    window.dispatchEvent(new Event(NOTICE_EVENT));
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
