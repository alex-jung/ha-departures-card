import { getContrastTextColor } from "../src/helpers";

describe("getContrastTextColor", () => {
  it("should return white for short hex values", () => {
    expect(getContrastTextColor("#fff")).toBe("white");
    expect(getContrastTextColor("fff")).toBe("white");
  });

  it("should return black for light colors", () => {
    expect(getContrastTextColor("#FFFFFF")).toBe("black");
    expect(getContrastTextColor("FFFFFF")).toBe("black");
    expect(getContrastTextColor("#FFEB3B")).toBe("black");
    expect(getContrastTextColor("#90CAF9")).toBe("black");
  });

  it("should return white for dark colors", () => {
    expect(getContrastTextColor("#000000")).toBe("white");
    expect(getContrastTextColor("000000")).toBe("white");
    expect(getContrastTextColor("#2196F3")).toBe("white");
    expect(getContrastTextColor("#673AB7")).toBe("white");
  });

  it("should handle hex colors without # prefix", () => {
    expect(getContrastTextColor("FFFFFF")).toBe("black");
    expect(getContrastTextColor("000000")).toBe("white");
  });
});
