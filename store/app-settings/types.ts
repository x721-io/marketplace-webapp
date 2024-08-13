export type SearchKey = "users";

export enum Theme {
  DARK = "dark",
  LIGHT = "light"
}

export type AppSettingsState =  {
  theme: Theme
}

export interface AppSettingsActions {
  setTheme:(theme: Theme) => void;
}
