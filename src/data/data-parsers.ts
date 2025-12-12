import { HassEntity } from "home-assistant-js-websocket";
import { DepartureTime } from "./departure-time";
import { UnsupportedEntityError } from "../exceptions";
import { DbInfoEntityAttributes, HaDeparturesEntityAttributes } from "../types";

export class DataParser {
  public static getParser(entity: HassEntity): Parser {
    let parser: Parser | null = null;

    if (entity.attributes[HaDeparturesEntityAttributes.TIMES] || entity.attributes[HaDeparturesEntityAttributes.ESTIMATED_DEPARTURE_TIME]) {
      console.debug("Detected 'ha-departures' attribute, likely ha-departures integration.");

      parser = new ParserHaDepartures(entity);
    } else if (entity.attributes[DbInfoEntityAttributes.NEXT_DEPARTURES]) {
      console.debug("Detected 'db-infoscreen' attribute, likely db-infoscreen integration.");

      parser = new ParserDbInfoscreen(entity);
    } else {
      throw new UnsupportedEntityError("No data parser found for entity '" + entity.entity_id + "'", entity.entity_id);
    }

    return parser;
  }
}

export abstract class Parser {
  protected _entity: HassEntity;

  constructor(entity: HassEntity) {
    this._entity = entity;
  }
  public abstract getTimes(): Array<DepartureTime>;
  public abstract getLineName(): string;
  public abstract getDirection(): string;
  public abstract getTransport(): string;
  public abstract getTransportIcon(): string | undefined;
}

class ParserHaDepartures extends Parser {
  public getTimes(): Array<DepartureTime> {
    let times: Array<DepartureTime> = [];

    if (this._entity.attributes[HaDeparturesEntityAttributes.TIMES]) {
      this._entity.attributes[HaDeparturesEntityAttributes.TIMES].forEach((timeEntry: any) => {
        times.push(new DepartureTime(timeEntry.planned, timeEntry.estimated));
      });
    } else if (this._entity.attributes[HaDeparturesEntityAttributes.ESTIMATED_DEPARTURE_TIME]) {
      times.push(this._entity.attributes[HaDeparturesEntityAttributes.PLANNED_DEPARTURE_TIME], this._entity.attributes[HaDeparturesEntityAttributes.ESTIMATED_DEPARTURE_TIME]);
      times.push(this._entity.attributes[HaDeparturesEntityAttributes.PLANNED_DEPARTURE_TIME_1], this._entity.attributes[HaDeparturesEntityAttributes.ESTIMATED_DEPARTURE_TIME_1]);
      times.push(this._entity.attributes[HaDeparturesEntityAttributes.PLANNED_DEPARTURE_TIME_2], this._entity.attributes[HaDeparturesEntityAttributes.ESTIMATED_DEPARTURE_TIME_2]);
      times.push(this._entity.attributes[HaDeparturesEntityAttributes.PLANNED_DEPARTURE_TIME_3], this._entity.attributes[HaDeparturesEntityAttributes.ESTIMATED_DEPARTURE_TIME_3]);
      times.push(this._entity.attributes[HaDeparturesEntityAttributes.PLANNED_DEPARTURE_TIME_4], this._entity.attributes[HaDeparturesEntityAttributes.ESTIMATED_DEPARTURE_TIME_4]);
    }

    return times;
  }
  public getLineName(): string {
    return this._entity.attributes[HaDeparturesEntityAttributes.LINE_NAME];
  }
  public getDirection(): string {
    return this._entity.attributes[HaDeparturesEntityAttributes.DIRECTION];
  }
  public getTransport(): string {
    return this._entity.attributes[HaDeparturesEntityAttributes.TRANSPORT];
  }

  public getTransportIcon(): string | undefined {
    return this._entity.attributes[HaDeparturesEntityAttributes.ICON];
  }
}

class ParserDbInfoscreen extends Parser {
  public getTimes(): Array<DepartureTime> {
    throw new Error("Not implemented yet!");
  }
  public getLineName(): string {
    throw new Error("Not implemented yet!");
  }
  public getDirection(): string {
    throw new Error("Not implemented yet!");
  }
  public getTransport(): string {
    throw new Error("Not implemented yet!");
  }

  public getTransportIcon(): string | undefined {
    throw new Error("Not implemented yet!");
  }
}
