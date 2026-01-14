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
