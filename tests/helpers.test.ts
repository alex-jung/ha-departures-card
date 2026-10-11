import { ClassTimer, getContrastTextColor, getRowsFittingHeight, hasFixedGridHeight, isMapPopupEnabled } from "../src/helpers";

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

describe("Tests for ClassTimer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should initialize as not running", () => {
    const timer = new ClassTimer(1000);
    expect(timer.isRunning()).toBe(false);
  });

  it("should start timer and execute callback after duration", () => {
    const callback = jest.fn();
    const timer = new ClassTimer(1000);
    timer.start(callback);
    expect(timer.isRunning()).toBe(true);
    jest.runAllTimers();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(timer.isRunning()).toBe(false);
  });

  it("should not start multiple timers", () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const timer = new ClassTimer(1000);
    timer.start(callback1);
    timer.start(callback2);
    jest.runAllTimers();
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();
  });

  it("should stop timer before callback execution", () => {
    const callback = jest.fn();
    const timer = new ClassTimer(1000);
    timer.start(callback);
    timer.stop();
    expect(timer.isRunning()).toBe(false);
    jest.runAllTimers();
    expect(callback).not.toHaveBeenCalled();
  });

  it("should restart timer with same callback", () => {
    const callback = jest.fn();
    const timer = new ClassTimer(1000);
    timer.start(callback);
    jest.advanceTimersByTime(500);
    timer.restart();
    expect(timer.isRunning()).toBe(true);
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not restart if callback not started", () => {
    const timer = new ClassTimer(1000);
    timer.restart();
    expect(timer.isRunning()).toBe(false);
  });
});

describe("hasFixedGridHeight", () => {
  it("should be false without grid options", () => {
    expect(hasFixedGridHeight(undefined)).toBe(false);
    expect(hasFixedGridHeight({})).toBe(false);
    expect(hasFixedGridHeight({ grid_options: { columns: 6 } })).toBe(false);
  });

  it("should be false for auto height", () => {
    expect(hasFixedGridHeight({ grid_options: { rows: "auto" } })).toBe(false);
  });

  it("should be true for a fixed number of rows", () => {
    expect(hasFixedGridHeight({ grid_options: { rows: 5 } })).toBe(true);
  });
});

describe("getRowsFittingHeight", () => {
  it("should return the number of rows fitting into the height", () => {
    // 5 rows: 5 * 36 + 4 * 5 = 200
    expect(getRowsFittingHeight(200, 36, 5)).toBe(5);
    expect(getRowsFittingHeight(199, 36, 5)).toBe(4);
    expect(getRowsFittingHeight(312, 36, 5)).toBe(7);
  });

  it("should return at least one row", () => {
    expect(getRowsFittingHeight(10, 36, 5)).toBe(1);
    expect(getRowsFittingHeight(0, 36, 5)).toBe(1);
  });
});

describe("isMapPopupEnabled", () => {
  it("should be enabled by default", () => {
    expect(isMapPopupEnabled(undefined)).toBe(true);
    expect(isMapPopupEnabled({})).toBe(true);
  });

  it("should respect the showMapPopup option", () => {
    expect(isMapPopupEnabled({ showMapPopup: true })).toBe(true);
    expect(isMapPopupEnabled({ showMapPopup: false })).toBe(false);
  });
});
