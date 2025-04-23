import { differenceInMinutes, isPast, isThisMinute, lightFormat } from "date-fns";
import { DepartureTime, DepartureTimeMode } from "./data-classes";



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

function prepareDate(date: Date | string | null): Date | null {
  if (!date || date === "unknown") {
    return null;
  }

  let parsedDate = new Date(date);

  parsedDate.setSeconds(0, 0);

  return parsedDate;
}