import { CardTheme } from "./types";

// constants for card configuration
export const DEFAULT_UPDATE_INTERVAL = 10000; // -> 10 sec
export const DEFAULT_SHOW_CARD_HEADER = true;
export const DEFAULT_SHOW_SCROLLBUTTONS = true;
export const DEFAULT_DEPARTURES_TO_SHOW = 5;
export const DEFAULT_SCROLL_BACK_TIMEOUT = 5;
export const DEFAULT_CARD_THEME = CardTheme.BASIC;
export const DEFAULT_CARD_ICON = "mdi:bus-multiple";
export const DEFAULT_LAYOUT = new Map<string, string>([
  ["icon", "30px"],
  ["line", "40px"],
  ["destination", "1fr"],
  ["time-diff", "50px"],
  ["planned-time", "50px"],
  ["estimated-time", "50px"],
  ["delay", "30px"],
]);

// constants for entity configuration
export const DEFAULT_ENTITY_ICON = "mdi:bus";

// layout constants
export const DEFAULT_DEPARTURE_ROW_GAP = 5; // px
export const DEFAULT_DEPARTURE_ROW_HEIGHT = 36; // px
