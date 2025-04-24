import { differenceInMinutes, isPast, isThisMinute, lightFormat } from "date-fns";
import { DepartureTime, DepartureTimeMode } from "./data-classes";

/**
 * Calculates the departure time based on planned and actual departure times.
 *
 * @param plannedDepartureTime - The planned departure time as a `Date` object or `null`.
 * @param actualDepartureTime - The actual departure time as a `Date` object or `null`.
 * @returns An instance of `DepartureTime` containing the calculated departure time details.
 *
 * The function determines the departure time mode and delay based on the provided
 * planned and actual departure times. If the planned departure time is not provided,
 * the function sets the mode to `NONE`. If the actual departure time is not provided,
 * it defaults to the planned departure time.
 *
 * The function calculates the delay in minutes between the actual and planned times.
 * If the actual departure time is in the current minute or in the past, the mode is set
 * to `NOW`. Otherwise, it calculates the time to the next departure and sets the mode
 * to either `TIMESTAMP` (formatted as "HH:mm") or `DIFF` (difference in minutes).
 */
export function calculateDepartureTime(plannedDepartureTime: Date | null, actualDepartureTime: Date | null): DepartureTime
{
  let result = new DepartureTime(actualDepartureTime ? true: false);

  let tNow = prepareDate(Date());
  let tPlanned = prepareDate(plannedDepartureTime);
  let tActual = prepareDate(actualDepartureTime);
  
  if(!tPlanned) {
    result.updateTime(DepartureTimeMode.NONE);
    return result;
  }

  if(!tActual) {
    tActual = tPlanned;
  }


  // calculate delay
  result.delay = differenceInMinutes(tActual, tPlanned);


  if(isThisMinute(tActual) || isPast(tActual)) {
    result.updateTime(DepartureTimeMode.NOW);

    return result;
  }

  // calculate time to next departure
  const diffMins = tActual && tNow ? differenceInMinutes(tActual, tNow) : 0;

  if(diffMins >= 60)
  {
    result.updateTime(DepartureTimeMode.TIMESTAMP, lightFormat(tActual, "HH:mm"));
  }
  else
  {
    result.updateTime(DepartureTimeMode.DIFF, diffMins.toString());
  }

  return result;
}

/**
 * Prepares a date by normalizing it to the nearest minute (seconds and milliseconds set to zero).
 * 
 * @param date - The input date, which can be a `Date` object, a string representation of a date, or `null`.
 *               If the input is `null` or the string `"unknown"`, the function returns `null`.
 * 
 * @returns A `Date` object with seconds and milliseconds set to zero, or `null` if the input is invalid.
 */
function prepareDate(date: Date | string | null): Date | null {
  if (!date || date === "unknown") {
    return null;
  }

  let parsedDate = new Date(date);

  parsedDate.setSeconds(0, 0);

  return parsedDate;
}