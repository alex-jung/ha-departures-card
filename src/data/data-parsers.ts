import { HassEntity } from "home-assistant-js-websocket";
import { DepartureTime } from "./departure-time";
import { UnsupportedEntityError } from "../exceptions";
import { DbInfoEntityAttributes, HaDeparturesEntityAttributes } from "../types";

export class DataParser {
  public static getParser(entity: HassEntity): Parser {
    let parser: Parser | null = null;

    if (entity.attributes[HaDeparturesEntityAttributes.TIMES] || entity.attributes[HaDeparturesEntityAttributes.ESTIMATED_DEPARTURE_TIME]) {
      console.debug("Detected 'ha-departures' attribute(s)");

      parser = new ParserHaDepartures(entity);
    } else if (entity.attributes[DbInfoEntityAttributes.NEXT_DEPARTURES]) {
      console.debug("Detected 'db-infoscreen' attribute(s)");

      parser = new ParserDbInfoscreen(entity);
    } else {
      throw new UnsupportedEntityError("No data parser found for entity '" + entity.entity_id + "'", JSON.stringify(entity.attributes));
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
      const planTime1 = this._entity.attributes[HaDeparturesEntityAttributes.PLANNED_DEPARTURE_TIME];
      const estTime1 = this._entity.attributes[HaDeparturesEntityAttributes.ESTIMATED_DEPARTURE_TIME];
      const planTime2 = this._entity.attributes[HaDeparturesEntityAttributes.PLANNED_DEPARTURE_TIME_1];
      const estTime2 = this._entity.attributes[HaDeparturesEntityAttributes.ESTIMATED_DEPARTURE_TIME_1];
      const planTime3 = this._entity.attributes[HaDeparturesEntityAttributes.PLANNED_DEPARTURE_TIME_2];
      const estTime3 = this._entity.attributes[HaDeparturesEntityAttributes.ESTIMATED_DEPARTURE_TIME_2];
      const planTime4 = this._entity.attributes[HaDeparturesEntityAttributes.PLANNED_DEPARTURE_TIME_3];
      const estTime4 = this._entity.attributes[HaDeparturesEntityAttributes.ESTIMATED_DEPARTURE_TIME_3];
      const planTime5 = this._entity.attributes[HaDeparturesEntityAttributes.PLANNED_DEPARTURE_TIME_4];
      const estTime5 = this._entity.attributes[HaDeparturesEntityAttributes.ESTIMATED_DEPARTURE_TIME_4];

      if (planTime1) {
        times.push(new DepartureTime(planTime1, estTime1));
      }
      if (planTime2) {
        times.push(new DepartureTime(planTime2, estTime2));
      }
      if (planTime3) {
        times.push(new DepartureTime(planTime3, estTime3));
      }
      if (planTime4) {
        times.push(new DepartureTime(planTime4, estTime4));
      }
      if (planTime5) {
        times.push(new DepartureTime(planTime5, estTime5));
      }
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
