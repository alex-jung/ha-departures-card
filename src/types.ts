import { LovelaceCardConfig } from "custom-card-helpers";

export interface Config extends LovelaceCardConfig {
    title: string;
    icon: string;
    showAnimation: boolean;
    showTransportIcon: boolean;
    debug: boolean;
    departuresToShow: number;
    entities?: EntityConfig[];
  }

export interface EntityConfig {
    entity: string;
    lineColor: string | null;
    lineName: string | null;
    timeStyle: string;
    destinationName: string | null;
    nowIcon: string | null;
}

export enum EntityAttributes {
  PLANNED_TIME = "planned_departure_time",
  PLANNED_TIME_1 = "planned_departure_time_1",
  PLANNED_TIME_2 = "planned_departure_time_2",
  PLANNED_TIME_3 = "planned_departure_time_3",
  PLANNED_TIME_4 = "planned_departure_time_4",
  ESTIMATED_TIME = "estimated_departure_time",
  ESTIMATED_TIME_1 = "estimated_departure_time_1",
  ESTIMATED_TIME_2 = "estimated_departure_time_2",
  ESTIMATED_TIME_3 = "estimated_departure_time_3",
  ESTIMATED_TIME_4 = "estimated_departure_time_4",
  LINE_NAME = "line_name",
  DIRECTION = "direction",
  TRANSPORT = "transport",
  LINE_ID = "line_id",
  FRIENDLY_NAME = "friendly_name",
  ICON = "icon"
}