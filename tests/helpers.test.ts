import { ClassTimer, getContrastTextColor } from "../src/helpers";

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
