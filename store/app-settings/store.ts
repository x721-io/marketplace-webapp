import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  AppSettingsActions,
  AppSettingsState,
  Theme,
} from "@/store/app-settings/types";

const DEFAULT_STATE: AppSettingsState = {
  theme: Theme.LIGHT,
};

export const useAppSettingsStore = create(
  devtools(
    persist<AppSettingsState & AppSettingsActions>(
      (set, get) => ({
        ...DEFAULT_STATE,
        setTheme: (theme) => set(() => ({ theme })),
      }),
      { name: "app-settings" }
    )
  )
);
