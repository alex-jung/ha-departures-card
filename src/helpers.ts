import L from "leaflet";
import { StopInfo, StopTimepoint } from "./types";

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

export function decodePolyline(encoded: string, precision = 6): [number, number][] {
  const factor = Math.pow(10, precision);
  const coords: [number, number][] = [];
  let index = 0,
    lat = 0,
    lng = 0;
  while (index < encoded.length) {
    let shift = 0,
      result = 0,
      b: number;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;
    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;
    coords.push([lat / factor, lng / factor]);
  }
  return coords;
}

export function euclidean(a: [number, number], b: [number, number]): number {
  const dlat = a[0] - b[0];
  const dlon = a[1] - b[1];
  return Math.sqrt(dlat * dlat + dlon * dlon);
}

export function findClosestIdx(point: [number, number], polyline: [number, number][], startIdx = 0): number {
  let minDist = Infinity,
    minIdx = startIdx;
  for (let i = startIdx; i < polyline.length; i++) {
    const d = euclidean(point, polyline[i]);
    if (d < minDist) {
      minDist = d;
      minIdx = i;
    }
  }
  return minIdx;
}

export function buildTripStops(leg: any, polyline: [number, number][]): StopInfo[] {
  const iStops: any[] = leg.intermediateStops ?? [];
  const stops: StopInfo[] = [];
  let searchFrom = 0;

  const addStop = (stop: any, planned: string, scheduled?: string) => {
    const idx = findClosestIdx([stop.lat, stop.lon], polyline, searchFrom);
    searchFrom = idx;

    console.debug("Add stop", stop);

    stops.push({
      name: stop.name ?? "",
      plannedTime: new Date(planned),
      scheduledTime: scheduled ? new Date(scheduled) : undefined,
      platform: stop.track ?? stop.scheduledTrack ?? stop.platformCode ?? stop.stopCode ?? undefined,
      polylineIdx: idx,
    });
  };
  for (const s of iStops) {
    if (!s?.lat) continue;
    const planned = s.arrival ?? s.departure;
    const scheduled = s.scheduledArrival ?? s.scheduledDeparture ?? undefined;

    if (planned) addStop(s, planned, scheduled);
  }

  // add last stop
  if (leg.to) {
    const planned = leg.to.arrival;
    const scheduled = leg.to.scheduledArrival ?? undefined;

    if (planned) addStop(leg.to, planned, scheduled);
  }
  return stops;
}

export function buildTimeline(leg: any, polyline: [number, number][]): StopTimepoint[] {
  const is: any[] = leg.intermediateStops ?? [];
  const timeline: StopTimepoint[] = [];
  let searchFrom = 0;
  for (const s of is) {
    if (!s?.lat) continue;
    const idx = findClosestIdx([s.lat, s.lon], polyline, searchFrom);
    searchFrom = idx;
    if (s.arrival) timeline.push({ time: new Date(s.arrival), polylineIdx: idx });
    if (s.departure) timeline.push({ time: new Date(s.departure), polylineIdx: idx });
  }
  if (leg.to?.lat && leg.to?.arrival) {
    const idx = findClosestIdx([leg.to.lat, leg.to.lon], polyline, searchFrom);
    timeline.push({ time: new Date(leg.to.arrival), polylineIdx: idx });
  }
  return timeline;
}

export function headingAtIdx(polyline: [number, number][], idx: number): number {
  const i = Math.min(idx, polyline.length - 2);
  const [lat1, lon1] = polyline[i];
  const [lat2, lon2] = polyline[i + 1];
  return 90 - Math.atan2(lat2 - lat1, lon2 - lon1) * (180 / Math.PI);
}

export function interpolatePosition(timeline: StopTimepoint[], polyline: [number, number][], now: Date): { pos: [number, number] | null; heading: number } {
  if (timeline.length < 2) return { pos: null, heading: 0 };
  const nowMs = now.getTime();
  if (nowMs <= timeline[0].time.getTime()) {
    const idx = timeline[0].polylineIdx;
    return { pos: polyline[idx], heading: headingAtIdx(polyline, idx) };
  }
  if (nowMs >= timeline[timeline.length - 1].time.getTime()) {
    const idx = timeline[timeline.length - 1].polylineIdx;
    return { pos: polyline[idx], heading: headingAtIdx(polyline, idx) };
  }
  let segStart = timeline[0],
    segEnd = timeline[1];
  for (let i = 0; i < timeline.length - 1; i++) {
    if (nowMs >= timeline[i].time.getTime() && nowMs <= timeline[i + 1].time.getTime()) {
      segStart = timeline[i];
      segEnd = timeline[i + 1];
      break;
    }
  }
  const idxA = segStart.polylineIdx,
    idxB = segEnd.polylineIdx;
  if (idxA === idxB) return { pos: polyline[idxA], heading: headingAtIdx(polyline, idxA) };
  const progress = (nowMs - segStart.time.getTime()) / (segEnd.time.getTime() - segStart.time.getTime());
  let totalLen = 0;
  for (let i = idxA; i < idxB; i++) totalLen += euclidean(polyline[i], polyline[i + 1]);
  const target = progress * totalLen;
  let accumulated = 0;
  for (let i = idxA; i < idxB; i++) {
    const segLen = euclidean(polyline[i], polyline[i + 1]);
    if (accumulated + segLen >= target) {
      const t = segLen > 0 ? (target - accumulated) / segLen : 0;
      const pos: [number, number] = [polyline[i][0] + t * (polyline[i + 1][0] - polyline[i][0]), polyline[i][1] + t * (polyline[i + 1][1] - polyline[i][1])];
      return { pos, heading: headingAtIdx(polyline, i) };
    }
    accumulated += segLen;
  }
  return { pos: polyline[idxB], heading: headingAtIdx(polyline, idxB) };
}

export function createVehicleIcon(color: string, heading: number): L.DivIcon {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="-14 -14 28 28"
    style="transform:rotate(${heading}deg);display:block;">
    <polygon points="0,-11 8,7 0,3 -8,7"
      fill="${color}" stroke="white" stroke-width="2" stroke-linejoin="round"/>
  </svg>`;
  return L.divIcon({ html: svg, className: "", iconSize: [56, 56], iconAnchor: [28, 28] });
}

export function formatTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
