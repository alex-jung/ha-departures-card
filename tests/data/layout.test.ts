import { LAYOUT_VERTICAL, LAYOUT_HORIZONTAL } from "../../src/constants";
import { Layout } from "../../src/data/layout";
import { CardOrientation, LayoutCell } from "../../src/types";

describe("Layout", () => {
  describe("Valid input / horizontal", () => {
    let layout = new Layout("icon destination", CardOrientation.HORIZONTAL);

    it("should get cells for icon and destination", () => {
      expect(layout.getCells()).toEqual(["icon", "destination"]);
    });
    it("should get default columns if no layout provided", () => {
      const expectedColumns = `${LAYOUT_HORIZONTAL.get(LayoutCell.ICON)} ${LAYOUT_HORIZONTAL.get(LayoutCell.DESTINATION)}`;
      expect(layout.getColumns()).toEqual(expectedColumns);
    });

    layout = new Layout([LayoutCell.ICON, LayoutCell.DESTINATION], CardOrientation.HORIZONTAL);
    it("should get cells for icon and destination", () => {
      expect(layout.getCells()).toEqual(["icon", "destination"]);
    });
    it("should get default columns if no layout provided", () => {
      const expectedColumns = `${LAYOUT_HORIZONTAL.get(LayoutCell.ICON)} ${LAYOUT_HORIZONTAL.get(LayoutCell.DESTINATION)}`;
      expect(layout.getColumns()).toEqual(expectedColumns);
    });
  });

  describe("Valid input / horizontal / station-name", () => {
    const layout = new Layout([LayoutCell.STATION_NAME, LayoutCell.DESTINATION], CardOrientation.HORIZONTAL);

    it("should get cells for station-name and destination", () => {
      expect(layout.getCells()).toEqual(["station-name", "destination"]);
    });
    it("should get columns for station-name and destination", () => {
      const expectedColumns = `${LAYOUT_HORIZONTAL.get(LayoutCell.STATION_NAME)} ${LAYOUT_HORIZONTAL.get(LayoutCell.DESTINATION)}`;
      expect(layout.getColumns()).toEqual(expectedColumns);
    });
  });

  describe("Filter invalid cells", () => {
    let layout = new Layout("icon invalid_1 hello world", CardOrientation.HORIZONTAL);

    it("should get cells for icon and destination", () => {
      expect(layout.getCells()).toEqual(["icon"]);
    });
    it("should get default columns if no layout provided", () => {
      const expectedColumns = `${LAYOUT_HORIZONTAL.get(LayoutCell.ICON)}`;
      expect(layout.getColumns()).toEqual(expectedColumns);
    });
  });

  describe("Default vertical layout", () => {
    let layout = new Layout(undefined, CardOrientation.VERTICAL);

    it("should get default cells if no layout provided", () => {
      expect(layout.getCells()).toEqual(Array.from(LAYOUT_VERTICAL.keys()));
    });
    it("should get default columns if no layout provided", () => {
      expect(layout.getColumns()).toEqual(Array.from(LAYOUT_VERTICAL.values()).join(" "));
    });

    it("should include station-name cell in vertical layout", () => {
      const l = new Layout([LayoutCell.STATION_NAME, LayoutCell.TIME_DIFF], CardOrientation.VERTICAL);
      expect(l.getCells()).toEqual(["station-name", "time-diff"]);
    });
    it("should get columns for station-name in vertical layout", () => {
      const l = new Layout([LayoutCell.STATION_NAME, LayoutCell.TIME_DIFF], CardOrientation.VERTICAL);
      const expectedColumns = `${LAYOUT_VERTICAL.get(LayoutCell.STATION_NAME)} ${LAYOUT_VERTICAL.get(LayoutCell.TIME_DIFF)}`;
      expect(l.getColumns()).toEqual(expectedColumns);
    });
  });

  describe("Custom cellWidths", () => {
    it("should use custom width for a cell", () => {
      const l = new Layout([LayoutCell.ICON, LayoutCell.TIME_DIFF], CardOrientation.VERTICAL, { "icon": "200px" });
      expect(l.getColumns()).toEqual(`200px ${LAYOUT_VERTICAL.get(LayoutCell.TIME_DIFF)}`);
    });
    it("should fall back to default width when cellWidths not set for cell", () => {
      const l = new Layout([LayoutCell.ICON, LayoutCell.TIME_DIFF], CardOrientation.VERTICAL, { "time-diff": "100px" });
      expect(l.getColumns()).toEqual(`${LAYOUT_VERTICAL.get(LayoutCell.ICON)} 100px`);
    });
  });

  describe("Default horizontal layout", () => {
    let layout = new Layout(undefined, CardOrientation.HORIZONTAL);

    it("should get default cells if no layout provided", () => {
      expect(layout.getCells()).toEqual(Array.from(LAYOUT_HORIZONTAL.keys()));
    });
    it("should get default columns if no layout provided", () => {
      expect(layout.getColumns()).toEqual(Array.from(LAYOUT_HORIZONTAL.values()).join(" "));
    });
  });
});
