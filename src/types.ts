import { LovelaceCardConfig } from "custom-card-helpers";

export interface Config extends LovelaceCardConfig {
    title: string;
    icon: string;
    showDelay: boolean;
    showTransportIcon: boolean;
    showTimestamp: boolean;
    entities?: EntityConfig[];
  }

export interface EntityConfig {
    entity: string;
    line_color: string;
    line_name: number;
    destination_name: string;
    dest_time: Date;
}

export enum EntityAttributes {
  PLANNED_TIME = "planned_departure_time",
  LINE_NAME = "line_name",
  DIRECTION = "direction",
  TRANSPORT = "transport",
  LINE_ID = "line_id",
  FRIENDLY_NAME = "friendly_name",
  ICON = "icon"
}