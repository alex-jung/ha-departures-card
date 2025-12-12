import { HomeAssistant } from "custom-card-helpers";
import { EntityConfig, DeparturesDataRow, DeparturesData } from "../types";
import { DataParser, Parser } from "./data-parsers";
import { HassEntity } from "home-assistant-js-websocket";
import { UnsupportedEntityError } from "../exceptions";

export class DepartureTimesPool {
  private _data = new Map<string, DeparturesData>();
  private _unsupportedEntities: Array<string> = [];

  public get unsupportedEntities() {
    return this._unsupportedEntities;
  }

  public update(hass: HomeAssistant, entities: Array<EntityConfig> | undefined) {
    if (!entities) {
      console.debug("No entities provided, ignore data update.");
      return;
    }
    if (!hass) {
      console.debug("No home assistant object provided, ignore data update.");
    }

    // remove deleted entites if some exist
    this._removeObsoleteData(entities);

    // create/update data entries
    this._updateData(hass, entities);
  }

  public getDepartures(sortByDepartureTime: boolean = true): Array<DeparturesDataRow> {
    let departures = Array.from(this._data.values());

    let list: Array<DeparturesDataRow> = [];

    departures.forEach((dep) => {
      dep.times.forEach((time) => {
        if (time.timeDiff >= 0) {
          list.push({
            entity: dep.entity,
            lineName: dep.lineName,
            destinationName: dep.destinationName,
            lineColor: dep.lineColor,
            icon: dep.icon,
            time: time,
          });
        }
      });
    });

    if (sortByDepartureTime) {
      list.sort((entry1, entry2) => {
        return entry1.time.time.getTime() - entry2.time.time.getTime();
      });
    }

    return list;
  }

  /**
   * Removes entities from the internal data store that are no longer present in the provided configurations.
   * @param configs - Array of entity configurations to compare against the current data store
   * @returns void
   */
  private _removeObsoleteData(configs: Array<EntityConfig>) {
    let removedEntities = configs.filter((entity) => !this._data.has(entity.entity));

    if (removedEntities) {
      console.debug(`Removed ${removedEntities.length} entities`);
    }

    removedEntities.forEach((entity) => {
      this._data.delete(entity.entity);
    });
  }

  private _updateData(hass: HomeAssistant, configs: Array<EntityConfig>): void {
    this._unsupportedEntities = [];

    configs.forEach((config) => {
      const state = hass.states[config.entity] as HassEntity;

      try {
        const parser = DataParser.getParser(state);

        this._createOrUpdateEntry(config, parser);
      } catch (e) {
        if (e instanceof UnsupportedEntityError) {
          console.warn("Not supported entity found:" + e.entityId);

          this._unsupportedEntities.push(e.entityId);
        }
      }
    });
  }

  private _createOrUpdateEntry(config: EntityConfig, parser: Parser) {
    const entityId = config.entity;
    const lineName = config.lineName || parser.getLineName();
    const direction = config.destinationName || parser.getDirection();
    const lineColor = config.lineColor;
    const times = parser.getTimes();
    const icon = config.icon || parser.getTransportIcon() || "mdi:bus";

    if (!this._data.has(config.entity)) {
      // create a new data entry
      this._data.set(config.entity, {
        entity: entityId,
        lineName: lineName,
        destinationName: direction,
        lineColor: lineColor,
        icon: icon,
        times: times,
      });
    } else {
      // update data entry
      let data = this._data.get(config.entity);

      if (data) {
        data.lineName = lineName;
        data.destinationName = direction;
        data.lineColor = lineColor;
        data.icon = icon;
        data.times = times;
      }
    }
  }
}
