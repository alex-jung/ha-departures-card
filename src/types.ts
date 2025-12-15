import { LovelaceCardConfig } from "custom-card-helpers";
import { DepartureTime } from "./data/departure-time";

// ha-departures-card specific configuration types
export interface Config extends LovelaceCardConfig {
  title: string;
  icon: string;
  departuresToShow: number;
  showCardHeader: boolean;
  scrollBackTimeout: number;
  showScrollButtons: boolean;
  cardStyle: CardStyles;
  entities?: EntityConfig[];
}

// An entity configuration within the card configuration
export interface EntityConfig {
  entity: string;
  lineColor: string | null;
  lineName: string | null;
  destinationName: string | null;
  icon: string | null;
}

export type DeparturesData = EntityConfig & {
  times: Array<DepartureTime>;
};

export type DeparturesDataRow = EntityConfig & {
  time: DepartureTime;
};

export enum CardStyles {
  BASIC = "basic",
  BLACK_WHITE = "black-white",
  CAPPUCINO = "cappucino",
  BLUE_SKY = "blue-sky",
}

// ha-departures specific types
export enum HaDeparturesEntityAttributes {
  TIMES = "times",
  LINE_NAME = "line_name",
  LINE_ID = "line_id",
  DIRECTION = "direction",
  TRANSPORT = "transport",
  FRIENDLY_NAME = "friendly_name",
  ICON = "icon",

  // deprecated attributes
  PLANNED_DEPARTURE_TIME = "planned_departure_time",
  PLANNED_DEPARTURE_TIME_1 = "planned_departure_time_1",
  PLANNED_DEPARTURE_TIME_2 = "planned_departure_time_2",
  PLANNED_DEPARTURE_TIME_3 = "planned_departure_time_3",
  PLANNED_DEPARTURE_TIME_4 = "planned_departure_time_4",
  ESTIMATED_DEPARTURE_TIME = "estimated_departure_time",
  ESTIMATED_DEPARTURE_TIME_1 = "estimated_departure_time_1",
  ESTIMATED_DEPARTURE_TIME_2 = "estimated_departure_time_2",
  ESTIMATED_DEPARTURE_TIME_3 = "estimated_departure_time_3",
  ESTIMATED_DEPARTURE_TIME_4 = "estimated_departure_time_4",
}

// db-infoscreen specific types
export type DbInfoNextDeparture = {
  arrival_current: string | null;
  arrival_timestamp: string | null;
  countdown: string | null;
  datetime: string | null;
  delay: string | null;
  departure_current: string | null;
  departure_timestamp: string | null;
  destination: string | null;
  hints: Array<string> | null;
  is_cancelled: boolean | null;
  line: string | null;
  origin: string | null;
  platform: string | null;
  sched_datetime: boolean | null;
  trainClasses: Array<string> | null;
  type: string | null;
};

export enum DbInfoEntityAttributes {
  DIRECTION = "direction",
  FRIENDLY_NAME = "friendly_name",
  ICON = "icon",
  STATION = "station",
  VIA_STATIONS = "via_stations",
  NEXT_DEPARTURES = "next_departures",
}
