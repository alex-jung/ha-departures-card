import { DEFAULT_LAYOUT } from "../../src/constants";
import { Layout } from "../../src/data/layout";

describe("Layout", () => {
  describe("Default layout", () => {
    let layout = new Layout(undefined);

    it("should get default cells if no layout provided", () => {
      expect(layout.getCells()).toEqual(Array.from(DEFAULT_LAYOUT.keys()));
    });
    it("should get default columns if no layout provided", () => {
      expect(layout.getColumns()).toEqual(Array.from(DEFAULT_LAYOUT.values()).join(" "));
    });
  });

  describe("uppercase / lowercase", () => {
    it("should parse uppercase written cells as well", () => {
      let layout = new Layout("LINE");
      expect(layout.getCells()).toEqual(["line"]);
    });
    it("should parse cammelcase written cells as well", () => {
      let layout = new Layout("IcOn LiNe");
      expect(layout.getCells()).toEqual(["icon", "line"]);
    });
  });
});
