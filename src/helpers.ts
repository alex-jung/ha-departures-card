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
