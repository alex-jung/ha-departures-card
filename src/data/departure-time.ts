import { differenceInMinutes } from "date-fns/differenceInMinutes";
import { prepareDate } from "../helpers";

export class DepartureTime {
  private _planned: Date;
  private _estimated: Date | undefined;
  private _delay: number | undefined;

  constructor(planned: Date, estimated: Date | null | undefined) {
    try {
      this._planned = prepareDate(planned);
    } catch (error) {
      console.error("Failed to parse `planned` date", planned);
      throw error;
    }

    try {
      this._estimated = prepareDate(estimated);
    } catch {
      this._estimated = undefined;
    }

    if (!this._estimated) {
      this._delay = undefined;
    } else {
      this._delay = differenceInMinutes(this._estimated, this._planned);
    }
  }

  public get planned(): Date {
    return this._planned;
  }

  public get estimated(): Date | undefined {
    return this._estimated;
  }

  /**
   * Gets the departure time.
   * @returns The estimated departure time if available, otherwise the planned departure time.
   */
  public get time(): Date {
    if (this._estimated) {
      return this._estimated;
    }

    return this._planned;
  }

  /**
   * Gets the difference in minutes between the departure time and the current time.
   * @returns The number of minutes between the departure time and now.
   */
  public get timeDiff(): number {
    const now = prepareDate(new Date());

    return differenceInMinutes(this.time, now);
  }

  /**
   * Determines whether the departure time represents an arrival (current time).
   * @returns {boolean} True if the time difference is zero (arriving), false otherwise.
   */
  public get isArriving(): boolean {
    return this.timeDiff == 0;
  }

  /**
   * Gets the delay in minutes for the departure time.
   *
   * @returns The delay as a number if available, or `undefined` if not set.
   */
  public get delay(): number | undefined {
    return this._delay;
  }

  /**
   * Determines whether the departure time is delayed.
   *
   * @returns {boolean} Returns `true` if the departure is delayed; otherwise, returns `false`.
   */
  public get isDelayed(): boolean {
    return this._delay != undefined && this._delay > 0;
  }

  public get isEarlier(): boolean {
    return this._delay != undefined && this._delay < 0;
  }
}
