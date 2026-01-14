import { HomeAssistant } from "custom-card-helpers";
import { EntityConfig, DeparturesDataRow, DeparturesData } from "../types";
import { DataParser, Parser } from "./data-parsers";
import { HassEntity } from "home-assistant-js-websocket";
import { EntityNotAvailable, UnsupportedEntityError } from "../exceptions";
import { DEFAULT_ENTITY_ICON } from "../constants";

export class DepartureTimesPool {
  private _data = new Map<string, DeparturesData>();
  private _errors: Array<Error> = [];

  public get errors() {
    return this._errors;
  }

  /**
   * Updates the data pool with the latest entity information from Home Assistant.
   *
   * @param hass - The Home Assistant instance containing current entity states
   * @param entities - Array of entity configurations to update, or undefined to skip update
   *
   * @remarks
   * This method performs two operations:
   * 1. Removes any obsolete data entries for entities that no longer exist
   * 2. Creates or updates data entries for the provided entities
   *
   * If either `hass` or `entities` is not provided, the update is skipped.
   */
  public update(hass: HomeAssistant, entities: Array<EntityConfig> | undefined) {
    if (!entities) {
      console.debug("No entities provided, ignore data update.");
      return;
    }
    if (!hass) {
      console.debug("No home assistant object provided, ignore data update.");
      return;
    }

    // remove deleted entites if some exist
    this._removeObsoleteData(entities);

    // create/update data entries
    this._updateData(hass, entities);
  }

  /**
   * Retrieves a flattened list of departures from the data pool.
   *
   * @param sortByDepartureTime - If true, sorts the departures by departure time in ascending order. Defaults to true.
   * @returns An array of DeparturesDataRow objects representing upcoming departures (where timeDiff >= 0).
   *          Each row contains departure details including entity, line name, destination, color, icon, and time information.
   */
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
    this._errors = [];

    configs.forEach((config) => {
      const state = hass.states[config.entity] as HassEntity;

      try {
        const parser = DataParser.getParser(state);

        this._createOrUpdateEntry(config, parser);
      } catch (e) {
        if (e instanceof UnsupportedEntityError) {
          console.warn("Not supported entity found:" + e.entityId);

          this._errors.push(e);
        } else if (e instanceof EntityNotAvailable) {
          console.warn("Entity is not available:" + e.entityId);

          this._errors.push(e);
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
    const icon = config.icon || parser.getTransportIcon() || DEFAULT_ENTITY_ICON;

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

      console.debug("Create new data for entity", config.entity);
    } else {
      // update data entry
      let data = this._data.get(config.entity);

      if (data) {
        data.lineName = lineName;
        data.destinationName = direction;
        data.lineColor = lineColor;
        data.icon = icon;
        data.times = times;

        console.debug("Update data for entity", config.entity);
      }
    }
  }
}
