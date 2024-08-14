"use client";

import clsx from "clsx";
import { useEffect, useState, useTransition } from "react";
import { Theme } from "@/store/app-settings/types";
import { useAppSettingsStore } from "@/store/app-settings/store";

export default function ThemeSwitcherSelect() {
  const { setTheme, theme } = useAppSettingsStore();
  const [isClient, setClient] = useState(false);

  function onChange(value: string) {
    const theme = value as Theme;
    setTheme(theme);
  }

  useEffect(() => setClient(true), []);

  if (!isClient) return null;

  return (
    <div className="relative">
      <select value={theme} onChange={(e) => onChange(e.target.value)}>
        <option
          value={Theme.LIGHT}
          className={clsx(
            "rounded-sm p-2 transition-colors hover:bg-slate-200"
          )}
        >
          Light
        </option>
        <option
          value={Theme.DARK}
          className={clsx(
            "rounded-sm p-2 transition-colors hover:bg-slate-200"
          )}
        >
          Dark
        </option>
      </select>
    </div>
  );
}
