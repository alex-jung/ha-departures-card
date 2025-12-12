import { HomeAssistant } from "custom-card-helpers";
import { localize } from "../locales/localize";
import { CardStyles, Config, EntityConfig } from "../types";

export class Defaults {
  public static filloutCardConfig(config: Config, hass: HomeAssistant): Config {
    config.title = config?.title || localize("card.departures", hass.locale?.language);
    config.icon = config?.icon ?? "mdi:bus-multiple";
    config.departuresToShow = config?.departuresToShow ?? 5;
    config.showCardHeader = config?.showCardHeader ?? true;
    config.scrollBackTimeout = config?.scrollBackTimeout ?? 3;
    config.showScrollButtons = config?.showScrollButtons ?? true;
    config.cardStyle = config?.cardStyle || CardStyles.BASIC;
    config.entities = config?.entities || [];

    return config;
  }

  public static getEntityConfig(config: EntityConfig): EntityConfig {
    return {
      entity: config.entity || "",
      lineColor: config.lineColor || null,
      lineName: config.lineName || null,
      destinationName: config.destinationName || null,
      icon: config.icon || null,
    };
  }
}
