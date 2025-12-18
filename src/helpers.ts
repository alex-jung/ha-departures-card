import { HomeAssistant } from "custom-card-helpers";

/**
 * Prepares a date by normalizing it to the nearest minute (seconds and milliseconds set to zero).
 *
 * @param date - The input date, which can be a `Date` object, a string representation of a date, or `null`.
 *               If the input is `null` or the string `"unknown"`, the function returns `undefined`.
 *
 * @returns A `Date` object with seconds and milliseconds set to zero, or `undefined` if the input is invalid.
 */
export function prepareDate(date: Date | string | null | undefined): Date {
  if (!date || date === "unknown" || date === undefined) {
    throw new Error("Provided date is invalid!");
  }

  let parsedDate = new Date(date);

  parsedDate.setSeconds(0, 0);

  return parsedDate;
}

export function getContrastTextColor(bgColor: string) {
  // remove # from color if present
  const hex = bgColor.replace("#", "");

  if (hex.length < 6) {
    return "white";
  }

  // split hex into r, g, b
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // if luminance is high, return black, else return white
  return luminance > 0.5 ? "black" : "white";
}

export class ClassTimer {
  private timerId: number | null = null;
  private callback: (() => void) | null = null;
  private readonly duration: number;

  constructor(duration: number) {
    this.duration = duration;
  }

  public start(callback: () => void): void {
    if (this.timerId === null) {
      this.callback = callback;
      this.timerId = window.setTimeout(() => {
        callback();
        this.callback = null;
        this.timerId = null;
      }, this.duration);
    }
  }

  public stop(): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public restart(): void {
    this.stop();

    if (this.callback !== null) {
      this.start(this.callback);
    }
  }

  public isRunning(): boolean {
    return this.timerId != null;
  }
}
