"use client";

import clsx from "clsx";
import { useTransition } from "react";
import { Locale } from "@/config";
import { setUserLocale } from "@/services/locale";
import { useLocale } from "next-intl";

export default function LocaleSwitcherSelect() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  function onChange(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  return (
    <div className="relative">
      <select defaultValue={locale} onChange={(e) => onChange(e.target.value)}>
        <option
          value={"en"}
          className={clsx(
            "rounded-sm p-2 transition-colors hover:bg-slate-200",
            isPending && "pointer-events-none opacity-60"
          )}
        >
          English
        </option>
        <option
          value={"vn"}
          className={clsx(
            "rounded-sm p-2 transition-colors hover:bg-slate-200",
            isPending && "pointer-events-none opacity-60"
          )}
        >
          Vietnamese
        </option>
      </select>
    </div>
  );
}
