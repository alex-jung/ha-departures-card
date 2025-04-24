import { calculateDepartureTime } from "./helpers";
import { DepartureTimeMode } from "./data-classes";
import { lightFormat } from "date-fns";

jest.mock("date-fns", () => ({
    ...jest.requireActual("date-fns"),
    lightFormat: jest.fn(),
}));

describe("calculateDepartureTime", () => {
    it("should return NONE mode when plannedDepartureTime is null", () => {
        const result = calculateDepartureTime(null, null);
        expect(result.mode).toBe(DepartureTimeMode.NONE);
    });

    it("should return NOW mode when actualDepartureTime is in the past or this minute", () => {
        const now = new Date();
        const result = calculateDepartureTime(now, now);
        expect(result.mode).toBe(DepartureTimeMode.NOW);
    });

    it("should calculate delay correctly when actualDepartureTime is provided", () => {
        const planned = new Date("2023-01-01T10:00:00");
        const actual = new Date("2023-01-01T10:05:00");
        const result = calculateDepartureTime(planned, actual);
        expect(result.delay).toBe(5);
    });

    it("should return TIMESTAMP mode when time to departure is 60 minutes or more", () => {
        const now = new Date("2023-01-01T09:00:00");
        const planned = new Date("2023-01-01T10:00:00");
        jest.spyOn(global, "Date").mockImplementation(() => now as unknown as string);
        (lightFormat as jest.Mock).mockReturnValue("10:00");

        const result = calculateDepartureTime(planned, null);
        expect(result.mode).toBe(DepartureTimeMode.TIMESTAMP);
        expect(result.time).toBe("10:00");

        jest.restoreAllMocks();
    });

    it("should return DIFF mode when time to departure is less than 60 minutes", () => {
        const now = new Date("2023-01-01T09:30:00");
        const planned = new Date("2023-01-01T10:00:00");
        jest.spyOn(global, "Date").mockImplementation(() => now as unknown as string);

        const result = calculateDepartureTime(planned, null);
        expect(result.mode).toBe(DepartureTimeMode.DIFF);
        expect(result.time).toBe("30");

        jest.restoreAllMocks();
    });
});