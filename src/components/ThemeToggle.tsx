"use client";

import { useTheme } from "@/themes/themeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="p-2 border rounded text-white">
      Switch to {theme === "black-and-white" ? "Default" : "Black & White"}{" "}
      Theme
    </button>
  );
}
