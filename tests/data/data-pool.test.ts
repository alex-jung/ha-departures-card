import { DepartureTimesPool } from "../../src/data/data-pool";
import { HomeAssistant } from "custom-card-helpers";
import { EntityConfig } from "../../src/types";
import { DataParser, Parser } from "../../src/data/data-parsers";
import { EntityNotAvailable, UnsupportedEntityError } from "../../src/exceptions";
import { DepartureTime } from "../../src/data/departure-time";
import { HassEntity } from "home-assistant-js-websocket";

class MockParser extends Parser {
  public getTimes(): Array<DepartureTime> {
    throw new Error("Method not implemented.");
  }
  public getLineName(): string {
    return "Line 1";
  }
  public getDirection(): string {
    return "Station A";
  }
  public getTransport(): string {
    throw new Error("Method not implemented.");
  }
  public getTransportIcon(): string | undefined {
    return "mdi:bus";
  }
}

describe("DepartureTimesPool", () => {
  let pool: DepartureTimesPool;
  let mockHass: HomeAssistant;
  let mockEntityConfig: EntityConfig;

  beforeEach(() => {
    pool = new DepartureTimesPool();
    mockHass = {
      states: {},
    } as HomeAssistant;
    mockEntityConfig = {
      entity: "sensor.test_entity",
      lineName: "Line 1",
      destinationName: "Station A",
    } as EntityConfig;
    jest.clearAllMocks();
  });

  describe("errors", () => {
    it("should return empty array initially", () => {
      expect(pool.errors).toEqual([]);
    });
  });

  describe("update", () => {
    it("should log debug message when entities are undefined", () => {
      const consoleSpy = jest.spyOn(console, "debug").mockImplementation();
      pool.update(mockHass, undefined);
      expect(consoleSpy).toHaveBeenCalledWith("No entities provided, ignore data update.");
      consoleSpy.mockRestore();
    });

    it("should log debug message when hass is undefined", () => {
      const consoleSpy = jest.spyOn(console, "debug").mockImplementation();
      pool.update(undefined as any, [mockEntityConfig]);
      expect(consoleSpy).toHaveBeenCalledWith("No home assistant object provided, ignore data update.");
      consoleSpy.mockRestore();
    });

    it("should process entities when hass and entities are provided", () => {
      const entity: HassEntity = {
        entity_id: "sensor.test",
        state: "on",
        attributes: ["hello", "world"],
        last_changed: "2023-01-01T00:00:00Z",
        last_updated: "2023-01-01T00:00:00Z",
        context: { id: "test", parent_id: null, user_id: null },
      };
      const spy = jest.spyOn(DataParser, "getParser").mockReturnValue(new MockParser(entity));

      mockHass.states[mockEntityConfig.entity] = {} as any;

      pool.update(mockHass, [mockEntityConfig]);

      expect(DataParser.getParser).toHaveBeenCalled();
      expect(pool.errors).toEqual([]);

      spy.mockRestore();
    });

    it("should handle unsupported entities", () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
      const error = new UnsupportedEntityError("Entity not supported", "sensor.test_entity");

      const spy = jest.spyOn(DataParser, "getParser").mockImplementation(() => {
        throw error;
      });

      mockHass.states[mockEntityConfig.entity] = {} as any;
      pool.update(mockHass, [mockEntityConfig]);

      expect(pool.errors).toContain(error);
      consoleSpy.mockRestore();
      spy.mockRestore();
    });

    it("should handle not available entities", () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
      const error = new EntityNotAvailable("Entity not available", "sensor.test_entity");

      const spy = jest.spyOn(DataParser, "getParser").mockImplementation(() => {
        throw error;
      });

      mockHass.states[mockEntityConfig.entity] = {} as any;
      pool.update(mockHass, [mockEntityConfig]);

      expect(pool.errors).toContain(error);
      consoleSpy.mockRestore();
      spy.mockRestore();
    });
  });
});
