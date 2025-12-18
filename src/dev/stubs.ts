import { HomeAssistant } from "custom-card-helpers";
import { CardTheme, Config, EntityConfig } from "../types";

export function getEntityConfigStub(index: number): EntityConfig {
  return {
    entity: "sensor.bus_departure" + "_" + index,
    lineColor: "#FF0000",
    lineName: "Bus 42",
    destinationName: "Central Station",
    icon: "mdi:bus",
  };
}

export function getConfigStub(): Config {
  return {
    title: "Departures",
    type: "custom:departures-card",
    icon: "mdi:bus",
    departuresToShow: 10,
    showCardHeader: true,
    scrollBackTimeout: 3,
    theme: CardTheme.BLACK_WHITE,
    layout: "",
    showScrollButtons: true,
    showArrivalAnimation: true,
    entities: [],
  };
}

export function getHassStub(): HomeAssistant {
  const auth = {};
  const connection = {};
  const config = {};
  const themes = {};
  const panels = {};
  const locale = {
    language: "en",
    number_format: 1,
  };
  const user = {};

  let stub = {} as HomeAssistant;

  stub.auth = auth as any;
  stub.connection = connection as any;
  stub.connected = true;
  stub.config = config as any;
  stub.themes = themes as any;
  stub.selectedTheme = null;
  stub.panels = panels as any;
  stub.panelUrl = "";
  stub.locale = locale as any;
  stub.selectedLanguage = "en";
  stub.resources = {};
  stub.dockedSidebar = false;
  stub.moreInfoEntityId = "";
  stub.user = user as any;
  stub.states = {};

  return stub;
}
