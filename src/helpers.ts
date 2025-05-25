/**
 * Prepares a date by normalizing it to the nearest minute (seconds and milliseconds set to zero).
 * 
 * @param date - The input date, which can be a `Date` object, a string representation of a date, or `null`.
 *               If the input is `null` or the string `"unknown"`, the function returns `null`.
 * 
 * @returns A `Date` object with seconds and milliseconds set to zero, or `null` if the input is invalid.
 */
export function prepareDate(date: Date | string | null): Date | null {
  if (!date || date === "unknown") {
    return null;
  }

  let parsedDate = new Date(date);

  parsedDate.setSeconds(0, 0);

  return parsedDate;
}