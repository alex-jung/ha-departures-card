import { EntityConfig } from "../types";

export class EntityTab {
  index: number;
  config: EntityConfig;

  constructor(index: number, config: EntityConfig | undefined) {
    this.index = index;

    if (config === undefined) {
      this.config = {
        entity: "",
        lineColor: null,
        lineName: null,
        destinationName: null,
      } as EntityConfig;
    } else {
      this.config = config;
    }
  }
}
