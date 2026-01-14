import { HassEntity } from "home-assistant-js-websocket";
import { DbInfoEntityAttributes, HaDeparturesEntityAttributes } from "../../src/types";
import { DataParser } from "../../src/data/data-parsers";
import { UnsupportedEntityError } from "../../src/exceptions";

describe("DataParser", () => {
  describe("getParser", () => {
    it("should return ParserHaDepartures when TIMES attribute exists", () => {
      const entity: HassEntity = {
        entity_id: "sensor.test",
        state: "on",
        attributes: {
          [HaDeparturesEntityAttributes.TIMES]: [{ planned: "10:00", estimated: "10:05" }],
        },
        last_changed: "2023-01-01T00:00:00Z",
        last_updated: "2023-01-01T00:00:00Z",
        context: { id: "test", parent_id: null, user_id: null },
      };

      const parser = DataParser.getParser(entity);

      expect(parser).toBeDefined();
      expect(parser.constructor.name).toBe("ParserHaDepartures");
    });

    it("should return ParserHaDepartures when ESTIMATED_DEPARTURE_TIME attribute exists", () => {
      const entity: HassEntity = {
        entity_id: "sensor.test",
        state: "on",
        attributes: {
          [HaDeparturesEntityAttributes.ESTIMATED_DEPARTURE_TIME]: "10:05",
          [HaDeparturesEntityAttributes.PLANNED_DEPARTURE_TIME]: "10:00",
        },
        last_changed: "2023-01-01T00:00:00Z",
        last_updated: "2023-01-01T00:00:00Z",
        context: { id: "test", parent_id: null, user_id: null },
      };

      const parser = DataParser.getParser(entity);

      expect(parser).toBeDefined();
      expect(parser.constructor.name).toBe("ParserHaDepartures");
    });

    it("should return ParserDbInfoscreen when NEXT_DEPARTURES attribute exists", () => {
      const entity: HassEntity = {
        entity_id: "sensor.test",
        state: "on",
        attributes: {
          [DbInfoEntityAttributes.NEXT_DEPARTURES]: [],
        },
        last_changed: "2023-01-01T00:00:00Z",
        last_updated: "2023-01-01T00:00:00Z",
        context: { id: "test", parent_id: null, user_id: null },
      };

      const parser = DataParser.getParser(entity);

      expect(parser).toBeDefined();
      expect(parser.constructor.name).toBe("ParserDbInfoscreen");
    });

    it("should throw UnsupportedEntityError when no supported attributes exist", () => {
      const entity: HassEntity = {
        entity_id: "sensor.test",
        state: "on",
        attributes: {},
        last_changed: "2023-01-01T00:00:00Z",
        last_updated: "2023-01-01T00:00:00Z",
        context: { id: "test", parent_id: null, user_id: null },
      };

      expect(() => DataParser.getParser(entity)).toThrow(UnsupportedEntityError);
    });

    it("should throw UnsupportedEntityError with entity_id in message", () => {
      const entity: HassEntity = {
        entity_id: "sensor.unsupported",
        state: "on",
        attributes: {},
        last_changed: "2023-01-01T00:00:00Z",
        last_updated: "2023-01-01T00:00:00Z",
        context: { id: "test", parent_id: null, user_id: null },
      };

      expect(() => DataParser.getParser(entity)).toThrow("No valid data parser found!");
    });

    it("should throw EntityNotAvailable", () => {
      const entity: HassEntity = {
        entity_id: "sensor.unsupported",
        state: "unavailable",
        attributes: {},
        last_changed: "2023-01-01T00:00:00Z",
        last_updated: "2023-01-01T00:00:00Z",
        context: { id: "test", parent_id: null, user_id: null },
      };

      expect(() => DataParser.getParser(entity)).toThrow("Entity is not available!");
    });

    describe("ParserHaDepartures", () => {
      describe("getTimes", () => {
        it("should return array of DepartureTime from TIMES attribute", () => {
          const entity: HassEntity = {
            entity_id: "sensor.test",
            state: "on",
            attributes: {
              [HaDeparturesEntityAttributes.TIMES]: [
                { planned: "10:00", estimated: "10:05" },
                { planned: "10:30", estimated: "10:32" },
              ],
            },
            last_changed: "2023-01-01T00:00:00Z",
            last_updated: "2023-01-01T00:00:00Z",
            context: { id: "test", parent_id: null, user_id: null },
          };

          const parser = DataParser.getParser(entity);
          const times = parser.getTimes();

          expect(times).toHaveLength(2);
        });

        it("should return array of DepartureTime from individual ESTIMATED_DEPARTURE_TIME attributes", () => {
          const entity: HassEntity = {
            entity_id: "sensor.test",
            state: "on",
            attributes: {
              [HaDeparturesEntityAttributes.PLANNED_DEPARTURE_TIME]: "10:00",
              [HaDeparturesEntityAttributes.ESTIMATED_DEPARTURE_TIME]: "10:05",
              [HaDeparturesEntityAttributes.PLANNED_DEPARTURE_TIME_1]: "10:30",
              [HaDeparturesEntityAttributes.ESTIMATED_DEPARTURE_TIME_1]: "10:32",
            },
            last_changed: "2023-01-01T00:00:00Z",
            last_updated: "2023-01-01T00:00:00Z",
            context: { id: "test", parent_id: null, user_id: null },
          };

          const parser = DataParser.getParser(entity);
          const times = parser.getTimes();

          expect(times).toHaveLength(2);
        });

        it("should handle up to 5 departure times", () => {
          const entity: HassEntity = {
            entity_id: "sensor.test",
            state: "on",
            attributes: {
              [HaDeparturesEntityAttributes.PLANNED_DEPARTURE_TIME]: "10:00",
              [HaDeparturesEntityAttributes.ESTIMATED_DEPARTURE_TIME]: "10:05",
              [HaDeparturesEntityAttributes.PLANNED_DEPARTURE_TIME_1]: "10:30",
              [HaDeparturesEntityAttributes.ESTIMATED_DEPARTURE_TIME_1]: "10:32",
              [HaDeparturesEntityAttributes.PLANNED_DEPARTURE_TIME_2]: "11:00",
              [HaDeparturesEntityAttributes.ESTIMATED_DEPARTURE_TIME_2]: "11:02",
              [HaDeparturesEntityAttributes.PLANNED_DEPARTURE_TIME_3]: "11:30",
              [HaDeparturesEntityAttributes.ESTIMATED_DEPARTURE_TIME_3]: "11:32",
              [HaDeparturesEntityAttributes.PLANNED_DEPARTURE_TIME_4]: "12:00",
              [HaDeparturesEntityAttributes.ESTIMATED_DEPARTURE_TIME_4]: "12:05",
            },
            last_changed: "2023-01-01T00:00:00Z",
            last_updated: "2023-01-01T00:00:00Z",
            context: { id: "test", parent_id: null, user_id: null },
          };

          const parser = DataParser.getParser(entity);
          expect(parser.getTimes()).toHaveLength(5);
        });
      });

      describe("getLineName", () => {
        it("should return line name from attributes", () => {
          const entity: HassEntity = {
            entity_id: "sensor.test",
            state: "on",
            attributes: {
              [HaDeparturesEntityAttributes.TIMES]: [],
              [HaDeparturesEntityAttributes.LINE_NAME]: "U42",
            },
            last_changed: "2023-01-01T00:00:00Z",
            last_updated: "2023-01-01T00:00:00Z",
            context: { id: "test", parent_id: null, user_id: null },
          };

          const parser = DataParser.getParser(entity);
          expect(parser.getLineName()).toBe("U42");
        });
      });

      describe("getDirection", () => {
        it("should return direction from attributes", () => {
          const entity: HassEntity = {
            entity_id: "sensor.test",
            state: "on",
            attributes: {
              [HaDeparturesEntityAttributes.TIMES]: [],
              [HaDeparturesEntityAttributes.DIRECTION]: "Central Station",
            },
            last_changed: "2023-01-01T00:00:00Z",
            last_updated: "2023-01-01T00:00:00Z",
            context: { id: "test", parent_id: null, user_id: null },
          };

          const parser = DataParser.getParser(entity);
          expect(parser.getDirection()).toBe("Central Station");
        });
      });

      describe("getTransport", () => {
        it("should return transport type from attributes", () => {
          const entity: HassEntity = {
            entity_id: "sensor.test",
            state: "on",
            attributes: {
              [HaDeparturesEntityAttributes.TIMES]: [],
              [HaDeparturesEntityAttributes.TRANSPORT]: "subway",
            },
            last_changed: "2023-01-01T00:00:00Z",
            last_updated: "2023-01-01T00:00:00Z",
            context: { id: "test", parent_id: null, user_id: null },
          };

          const parser = DataParser.getParser(entity);
          expect(parser.getTransport()).toBe("subway");
        });
      });

      describe("getTransportIcon", () => {
        it("should return transport icon from attributes", () => {
          const entity: HassEntity = {
            entity_id: "sensor.test",
            state: "on",
            attributes: {
              [HaDeparturesEntityAttributes.TIMES]: [],
              [HaDeparturesEntityAttributes.ICON]: "mdi:subway",
            },
            last_changed: "2023-01-01T00:00:00Z",
            last_updated: "2023-01-01T00:00:00Z",
            context: { id: "test", parent_id: null, user_id: null },
          };

          const parser = DataParser.getParser(entity);
          expect(parser.getTransportIcon()).toBe("mdi:subway");
        });

        it("should return undefined when icon attribute is missing", () => {
          const entity: HassEntity = {
            entity_id: "sensor.test",
            state: "on",
            attributes: {
              [HaDeparturesEntityAttributes.TIMES]: [],
            },
            last_changed: "2023-01-01T00:00:00Z",
            last_updated: "2023-01-01T00:00:00Z",
            context: { id: "test", parent_id: null, user_id: null },
          };

          const parser = DataParser.getParser(entity);
          expect(parser.getTransportIcon()).toBeUndefined();
        });
      });
    });
  });
});
