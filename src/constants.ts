import { CardOrientation, CardTheme, LayoutCell } from "./types";

export const DEFAULT_UPDATE_INTERVAL = 10000; // -> 10 sec
export const DEFAULT_SHOW_CARD_HEADER = true;
export const DEFAULT_CARD_TITLE = "Departures";
export const DEFAULT_CARD_ICON = "mdi:bus-multiple";
export const DEFAULT_SHOW_SCROLLBUTTONS = true;
export const DEFAULT_SHOW_LIST_HEADER = true;
export const DEFAULT_CARD_ORIENTATION = CardOrientation.VERTICAL;
export const DEFAULT_SORT_DEPARTURES = false;
export const DEFAULT_DEPARTURE_ICON = "";
export const DEFAULT_ANIMATE_LINE = false;
export const DEFAULT_DEPARTURE_ANIMATION = "none";
export const DEFAULT_DEPARTURE_ANIMATION_DURATION = 0;
export const DEFAULT_ARRIVAL_OFFSET = 0;
export const DEFAULT_LAYOUT = [LayoutCell.ICON, LayoutCell.LINE, LayoutCell.DESTINATION, LayoutCell.TIME_DIFF, LayoutCell.DELAY];
export const DEFAULT_DEPARTURES_TO_SHOW = 5;
export const DEFAULT_SCROLL_BACK_TIMEOUT = 5;
export const DEFAULT_CARD_THEME = CardTheme.BASIC;

export const LAYOUT_VERTICAL = new Map<string, string>([
  [LayoutCell.ICON, "30px"],
  [LayoutCell.LINE, "50px"],
  [LayoutCell.DESTINATION, "1fr"],
  [LayoutCell.TIME_DIFF, "70px"],
  [LayoutCell.PLANNED_TIME, "55px"],
  [LayoutCell.ESTIMATED_TIME, "55px"],
  [LayoutCell.DELAY, "40px"],
]);
export const LAYOUT_HORIZONTAL = new Map<string, string>([
  [LayoutCell.ICON, "30px"],
  [LayoutCell.LINE, "50px"],
  [LayoutCell.DESTINATION, "1fr"],
  [LayoutCell.TIME_DIFF, "1fr"],
]);

// constants for entity configuration
export const DEFAULT_ENTITY_ICON = "mdi:bus";

// layout constants
export const DEFAULT_DEPARTURE_ROW_GAP = 5; // px
export const DEFAULT_DEPARTURE_ROW_HEIGHT = 36; // px
