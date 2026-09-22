"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export default function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(currentTheme());
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("peace-atlas-theme", next);
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
    setTheme(next);
  }

  const dark = theme === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Dark mode on. Activate to switch to light mode." : "Dark mode off. Activate to switch to dark mode."}
      className="theme-switch"
      data-state={dark ? "on" : "off"}
      onClick={toggle}
      title={dark ? "Dark mode — switch to light mode" : "Light mode — switch to dark mode"}
    >
      <span className="theme-knob" aria-hidden="true" />
    </button>
  );
}
