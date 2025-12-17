import { DepartureTime } from "../../src/data/departure-time";
import { prepareDate } from "../../src/helpers";

describe("DepartureTime", () => {
  const planned = new Date("2024-06-01T10:00:20Z");
  const estimated = new Date("2024-06-01T10:15:34Z");

  it("should set planned and estimated dates correctly", () => {
    const dt = new DepartureTime(planned, estimated);
    expect(dt.time).toEqual(prepareDate(estimated));
  });

  it("should throw an exeption if planned time is not correct", () => {
    expect(() => {
      new DepartureTime(undefined as unknown as Date, estimated);
    }).toThrow();
  });

  it("should return planned and estimated times correctly", () => {
    const dt = new DepartureTime(planned, estimated);
    expect(dt.planned).toEqual(prepareDate(planned));
    expect(dt.estimated).toEqual(prepareDate(estimated));
  });

  it("should return planned time if estimated is null", () => {
    const dt = new DepartureTime(planned, undefined);
    expect(dt.time).toEqual(prepareDate(planned));
  });

  it("should return 2 minutes time diff to now", () => {
    const delayedTime = new Date(new Date().getTime() + 2 * 60000);

    const dt = new DepartureTime(delayedTime, undefined);

    expect(dt.timeDiff).toEqual(2);
  });

  it("should return isArraving true if planned time is the same like now (without seconds)", () => {
    const dt = new DepartureTime(new Date(), undefined);

    expect(dt.isArriving).toBe(true);
  });

  it("should calculate delay in minutes when estimated is provided", () => {
    const dt = new DepartureTime(planned, estimated);
    expect(dt.delay).toBe(15);
  });

  it("should have undefined delay if estimated is null", () => {
    const dt = new DepartureTime(planned, null);
    expect(dt.delay).toBeUndefined();
  });

  it("isDelayed should return correct value", () => {
    const dt1 = new DepartureTime(planned, estimated);
    const dt2 = new DepartureTime(planned, null);
    expect(dt1.isDelayed).toBe(true);
    expect(dt2.isDelayed).toBe(false);
  });
});
