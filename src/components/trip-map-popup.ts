import { LitElement, css, html, nothing, unsafeCSS, PropertyValues, CSSResultGroup } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Alert } from "../types";
import { ref, createRef } from "lit/directives/ref.js";
import L from "leaflet";

import leafletCssText from "leaflet/dist/leaflet.css";

const TRIP_API_BASE = "http://localhost:8888/api/v5/trip?tripId=";
const STOPTIMES_API_BASE = "https://api.transitous.org/api/v5/stoptimes";
const POSITION_UPDATE_INTERVAL_MS = 5000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function decodePolyline(encoded: string, precision = 6): [number, number][] {
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

interface StopTimepoint {
  time: Date;
  polylineIdx: number;
}

interface StopInfo {
  name: string;
  plannedTime: Date;
  estimatedTime?: Date;
  platform?: string;
  polylineIdx: number;
}

interface StopTimeEntry {
  tripId: string;
  headsign: string;
  routeShortName: string;
  plannedDeparture: Date;
  estimatedDeparture?: Date;
  track?: string;
  alerts: Alert[];
}

function euclidean(a: [number, number], b: [number, number]): number {
  const dlat = a[0] - b[0];
  const dlon = a[1] - b[1];
  return Math.sqrt(dlat * dlat + dlon * dlon);
}

function findClosestIdx(point: [number, number], polyline: [number, number][], startIdx = 0): number {
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

/** Builds the stop-strip list from all intermediate stops plus leg.to. */
function buildTripStops(leg: any, polyline: [number, number][]): StopInfo[] {
  const is: any[] = leg.intermediateStops ?? [];
  const stops: StopInfo[] = [];
  let searchFrom = 0;

  const addStop = (stop: any, planned: string, estimated?: string) => {
    const idx = findClosestIdx([stop.lat, stop.lon], polyline, searchFrom);
    searchFrom = idx;
    stops.push({
      name: stop.name ?? "",
      plannedTime: new Date(planned),
      estimatedTime: estimated ? new Date(estimated) : undefined,
      platform: stop.track ?? stop.scheduledTrack ?? stop.platformCode ?? stop.stopCode ?? undefined,
      polylineIdx: idx,
    });
  };

  for (const s of is) {
    if (!s?.lat) continue;
    const planned = s.arrival ?? s.departure;
    const estimated = s.estimatedArrival ?? s.realtimeArrival ?? undefined;
    if (planned) addStop(s, planned, estimated);
  }
  if (leg.to?.lat) {
    const planned = leg.to.arrival;
    const estimated = leg.to.estimatedArrival ?? leg.to.realtimeArrival ?? undefined;
    if (planned) addStop(leg.to, planned, estimated);
  }
  return stops;
}

/**
 * Builds the interpolation timeline from all intermediate stops plus leg.to.
 * Each stop gets arrival + departure timepoints so the marker dwells.
 */
function buildTimeline(leg: any, polyline: [number, number][]): StopTimepoint[] {
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

function headingAtIdx(polyline: [number, number][], idx: number): number {
  const i = Math.min(idx, polyline.length - 2);
  const [lat1, lon1] = polyline[i];
  const [lat2, lon2] = polyline[i + 1];
  // CSS rotation: 0 = north (up), clockwise positive
  return 90 - Math.atan2(lat2 - lat1, lon2 - lon1) * (180 / Math.PI);
}

function interpolatePosition(
  timeline: StopTimepoint[],
  polyline: [number, number][],
  now: Date,
): { pos: [number, number] | null; heading: number } {
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

  let segStart = timeline[0], segEnd = timeline[1];
  for (let i = 0; i < timeline.length - 1; i++) {
    if (nowMs >= timeline[i].time.getTime() && nowMs <= timeline[i + 1].time.getTime()) {
      segStart = timeline[i];
      segEnd = timeline[i + 1];
      break;
    }
  }

  const idxA = segStart.polylineIdx, idxB = segEnd.polylineIdx;
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
      const pos: [number, number] = [
        polyline[i][0] + t * (polyline[i + 1][0] - polyline[i][0]),
        polyline[i][1] + t * (polyline[i + 1][1] - polyline[i][1]),
      ];
      return { pos, heading: headingAtIdx(polyline, i) };
    }
    accumulated += segLen;
  }
  return { pos: polyline[idxB], heading: headingAtIdx(polyline, idxB) };
}

function createVehicleIcon(color: string, heading: number): L.DivIcon {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="-14 -14 28 28"
    style="transform:rotate(${heading}deg);display:block;">
    <polygon points="0,-11 8,7 0,3 -8,7"
      fill="${color}" stroke="white" stroke-width="2" stroke-linejoin="round"/>
  </svg>`;
  return L.divIcon({ html: svg, className: "", iconSize: [56, 56], iconAnchor: [28, 28] });
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

@customElement("trip-map-popup")
export class TripMapPopup extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(leafletCssText)}
    ` as CSSResultGroup,
    css`
      :host {
        display: contents;
      }
      .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9998;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .dialog {
        background: var(--card-background-color, #fff);
        border-radius: 8px;
        width: 70vw;
        height: 70vh;
        min-width: 320px;
        min-height: 300px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: 9999;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        border-bottom: 1px solid var(--divider-color, #e0e0e0);
        font-weight: bold;
        font-size: 1em;
        flex-shrink: 0;
      }
      .header-actions {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .close-btn,
      .refresh-btn {
        cursor: pointer;
        background: none;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 6px;
        font-size: 1.2em;
        color: var(--primary-text-color);
        padding: 4px 10px;
        transition: background 0.15s, border-color 0.15s;
      }
      .close-btn:hover,
      .refresh-btn:hover:not(:disabled) {
        background: var(--secondary-background-color, #f5f5f5);
        border-color: var(--primary-text-color);
      }
      .refresh-btn:disabled {
        opacity: 0.4;
        cursor: default;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .refresh-btn.spinning {
        display: inline-block;
        animation: spin 0.8s linear infinite;
      }
      /* ── Alert banner ───────────────────────────────────────────── */
      .alert-banner {
        flex-shrink: 0;
        background: #fff3e0;
        border-bottom: 1px solid #ffb74d;
        padding: 6px 14px;
        display: flex;
        flex-direction: column;
        gap: 3px;
        max-height: 90px;
        overflow-y: auto;
      }
      .alert-banner-item {
        display: flex;
        align-items: flex-start;
        gap: 6px;
        font-size: 0.82em;
        color: #e65100;
        line-height: 1.3;
      }
      .alert-banner-icon {
        flex-shrink: 0;
        margin-top: 1px;
      }
      .alert-banner-header {
        font-weight: bold;
      }
      .alert-banner-desc {
        font-size: 0.9em;
        opacity: 0.85;
        margin-top: 1px;
      }

      /* ── Two-column content area ───────────────────────────────── */
      .content {
        display: flex;
        flex: 1;
        min-height: 0;
      }

      /* ── Left: stop panel (banner + list) ──────────────────────── */
      .stop-panel {
        width: 300px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        border-right: 1px solid var(--divider-color, #e0e0e0);
        min-height: 0;
      }
      .next-stop-banner {
        flex-shrink: 0;
        padding: 10px 14px;
        background: var(--primary-color, #1976d2);
        color: #fff;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .next-stop-label {
        font-size: 0.72em;
        opacity: 0.85;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .next-stop-name {
        font-size: 0.95em;
        font-weight: bold;
        line-height: 1.2;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .next-stop-time {
        font-size: 1.3em;
        font-weight: bold;
        margin-top: 2px;
      }
      .next-stop-dest-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 8px;
        padding-top: 6px;
        border-top: 1px solid rgba(255,255,255,0.3);
        font-size: 0.8em;
        opacity: 0.9;
      }
      .next-stop-dest-label {
        opacity: 0.85;
      }
      .next-stop-dest-time {
        font-weight: bold;
      }
      .stop-list {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 8px 16px 0;
        cursor: grab;
      }
      .stop-list-spacer {
        height: 16px;
        flex-shrink: 0;
      }
      .stop-list:active {
        cursor: grabbing;
      }
      .stop-item {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        min-height: 52px;
      }
      .stop-timeline {
        width: 24px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .stop-line {
        width: 2px;
        flex: 1;
      }
      .stop-line.passed {
        background: #1976d2;
      }
      .stop-line.upcoming {
        background: #bdbdbd;
      }
      .stop-line.hidden {
        background: transparent;
      }
      .stop-dot {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 2px solid #bdbdbd;
        background: transparent;
        flex-shrink: 0;
        box-sizing: border-box;
      }
      .stop-dot.passed {
        background: #1976d2;
        border-color: #1976d2;
      }
      .stop-dot.next {
        background: #f57c00;
        border-color: #f57c00;
        width: 16px;
        height: 16px;
      }
      .stop-dot.upcoming {
        background: transparent;
        border-color: #bdbdbd;
      }
      .stop-name-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 5px 6px 5px 8px;
        min-width: 0;
      }
      .stop-name {
        font-size: 0.85em;
        line-height: 1.3;
        color: var(--primary-text-color);
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-word;
      }
      .stop-platform {
        font-size: 0.7em;
        font-weight: bold;
        background: var(--secondary-background-color, #e0e0e0);
        color: var(--secondary-text-color);
        border-radius: 3px;
        padding: 2px 6px;
        white-space: nowrap;
      }
      .stop-time-col {
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
        padding: 5px 4px 5px 0;
        min-width: 36px;
      }
      .stop-time-planned {
        font-size: 0.75em;
        color: var(--secondary-text-color);
        white-space: nowrap;
        margin-top: 2px;
      }
      .stop-time-estimated {
        font-size: 0.75em;
        font-weight: 600;
        white-space: nowrap;
      }
      .stop-time-estimated.delayed { color: #c62828; }
      .stop-time-estimated.ontime  { color: #2e7d32; }
      .stop-item.next .stop-name {
        color: #f57c00;
        font-weight: bold;
      }
      @keyframes stop-pulse {
        0%   { box-shadow: 0 0 0 0   rgba(245, 124, 0, 0.6); }
        60%  { box-shadow: 0 0 0 7px rgba(245, 124, 0, 0);   }
        100% { box-shadow: 0 0 0 0   rgba(245, 124, 0, 0);   }
      }
      .stop-dot.next {
        animation: stop-pulse 1.6s ease-out infinite;
      }

      /* ── Right: map ─────────────────────────────────────────────── */
      .map-panel {
        flex: 1;
        position: relative;
        min-width: 0;
      }
      .map {
        width: 100%;
        height: 100%;
      }
      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--secondary-text-color);
      }

      /* ── Boarding-stop tooltip ──────────────────────────────────── */
      .boarding-stop-label {
        background: #7b1fa2;
        color: #fff;
        border: none;
        border-radius: 4px;
        font-size: 1.1em;
        font-weight: bold;
        padding: 5px 12px;
        white-space: nowrap;
        box-shadow: 0 1px 4px rgba(0,0,0,0.3);
      }
      .boarding-stop-label::before {
        display: none;
      }

      /* ── Mobile: hide map, stop list full width ─────────────────── */
      @media (max-width: 600px) {
        .dialog {
          width: 95vw;
          height: 85vh;
        }
        .map-panel {
          display: none;
        }
        .stop-panel {
          width: 100%;
          border-right: none;
        }
        .stop-list {
          padding: 8px 16px;
        }
      }
    `,
  ];

  @property() tripId?: string;
  @property() title = "";
  @property({ type: Boolean }) open = false;
  @property() fromStopId?: string;
  @property({ type: Number }) fromLat?: number;
  @property({ type: Number }) fromLon?: number;
  @property({ attribute: false }) alerts: Alert[] = [];

  @state() private _loading = false;
  @state() private _tripData: any = null;
  @state() private _stops: StopInfo[] = [];
  @state() private _currentStopIdx = -1;
  @state() private _stopTimesData: StopTimeEntry[] = [];
  @state() private _stopTimesLoading = false;

  private _map: L.Map | null = null;
  private _mapRef = createRef<HTMLDivElement>();
  private _stripRef = createRef<HTMLDivElement>();
  private _vehicleMarker: L.Marker | null = null;
  private _positionInterval: ReturnType<typeof setInterval> | null = null;

  protected updated(changed: PropertyValues) {
    super.updated(changed);

    if (changed.has("open")) {
      if (this.open) {
        this._fetchTrip();
      } else {
        this._cleanup();
      }
    }

    if (changed.has("_currentStopIdx")) {
      requestAnimationFrame(() => this._scrollStripToNextStop());
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanup();
  }

  render() {
    if (!this.open) return nothing;

    return html`
      <div class="overlay" @pointerdown=${this._onOverlayPointerDown} @click=${this._onOverlayClick}>
        <div class="dialog" @click=${(ev: Event) => ev.stopPropagation()}>
          <div class="header">
            <span>${this.title}</span>
            <div class="header-actions">
              <button class="refresh-btn ${this._loading ? "spinning" : ""}" ?disabled=${this._loading} @click=${this._fetchTrip}>↻</button>
              <button class="close-btn" @click=${this._close}>✕</button>
            </div>
          </div>
          ${this.alerts.length > 0 ? html`
            <div class="alert-banner">
              ${this.alerts.map(a => {
                const color = a.severityLevel === "SEVERE" ? "#c62828" : a.severityLevel === "INFO" ? "#1565c0" : "#e65100";
                const icon = a.severityLevel === "SEVERE" ? "mdi:alert-octagon-outline" : a.severityLevel === "INFO" ? "mdi:information-outline" : "mdi:alert-circle-outline";
                return html`
                  <div class="alert-banner-item" style="color:${color}">
                    <ha-icon icon="${icon}" class="alert-banner-icon" style="--mdc-icon-size:16px"></ha-icon>
                    <div>
                      <div class="alert-banner-header">${a.headerText}</div>
                      ${a.descriptionText ? html`<div class="alert-banner-desc">${a.descriptionText}</div>` : nothing}
                    </div>
                  </div>
                `;
              })}
            </div>
          ` : nothing}
          <div class="content">
            ${this._stops.length ? this._renderStopList() : nothing}
            <div class="map-panel">
              ${this._loading ? html`<div class="loading">Loading…</div>` : html`<div class="map" ${ref(this._mapRef)}></div>`}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private _renderNextStopBanner() {
    const cur = this._currentStopIdx;
    const next = this._stops[cur + 1];
    if (!next) return nothing;

    const now = Date.now();
    const nextDiffMin = Math.round((next.plannedTime.getTime() - now) / 60000);
    const nextLabel = nextDiffMin <= 0 ? "jetzt" : `in ${nextDiffMin} min`;

    const dest = this._stops[this._stops.length - 1];
    const destDiffMin = dest ? Math.max(0, Math.round((dest.plannedTime.getTime() - now) / 60000)) : null;

    return html`
      <div class="next-stop-banner">
        <div class="next-stop-label">Nächste Haltestelle</div>
        <div class="next-stop-name">${next.name}</div>
        <div class="next-stop-time">${nextLabel}</div>
        ${destDiffMin !== null ? html`
          <div class="next-stop-dest-row">
            <span class="next-stop-dest-label">Ankunft Ziel</span>
            <span class="next-stop-dest-time">in ${destDiffMin} min</span>
          </div>
        ` : nothing}
      </div>
    `;
  }

  private _renderStopList() {
    const cur = this._currentStopIdx;
    return html`
      <div class="stop-panel">
        ${this._renderNextStopBanner()}
        <div class="stop-list" ${ref(this._stripRef)} @mousedown=${this._onListMouseDown}>
        ${this._stops.map((stop, i) => {
          const isNext = cur >= 0 && i === cur + 1;
          const dotClass = i <= cur ? "passed" : isNext ? "next" : "upcoming";
          const itemClass = isNext ? "next" : "";
          const lineClass = i <= cur ? "passed" : "upcoming";
          const isFirst = i === 0;
          const isLast = i === this._stops.length - 1;
          const delayed = stop.estimatedTime && stop.estimatedTime.getTime() > stop.plannedTime.getTime();
          const estClass = delayed ? "delayed" : "ontime";
          return html`
            <div class="stop-item ${itemClass}">
              <div class="stop-timeline">
                <div class="stop-line ${isFirst ? "hidden" : lineClass}"></div>
                <div class="stop-dot ${dotClass}"></div>
                <div class="stop-line ${isLast ? "hidden" : lineClass}"></div>
              </div>
              <div class="stop-name-section">
                <div class="stop-name">${stop.name}</div>
                <span class="stop-time-planned">${formatTime(stop.plannedTime)}</span>
                ${stop.estimatedTime ? html`<span class="stop-time-estimated ${estClass}">${formatTime(stop.estimatedTime)}</span>` : nothing}
              </div>
              <div class="stop-time-col">
                ${stop.platform ? html`<div class="stop-platform">${stop.platform}</div>` : nothing}
              </div>
            </div>
          `;
        })}
        <div class="stop-list-spacer"></div>
        </div>
      </div>
    `;
  }

  private _stripDragStart = 0;
  private _stripScrollStart = 0;

  private _onListMouseDown = (e: MouseEvent) => {
    const list = this._stripRef.value;
    if (!list) return;
    this._stripDragStart = e.clientY;
    this._stripScrollStart = list.scrollTop;
    const onMove = (ev: MouseEvent) => { list.scrollTop = this._stripScrollStart - (ev.clientY - this._stripDragStart); };
    const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  private _scrollStripToNextStop() {
    const list = this._stripRef.value;
    if (!list || !this._stops.length) return;
    const targetIdx = Math.max(0, Math.min(this._currentStopIdx + 1, this._stops.length - 1));
    const items = list.querySelectorAll<HTMLElement>(".stop-item");
    const item = items[targetIdx];
    if (!item) return;
    const listRect = list.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const itemCenterInScroll = itemRect.top - listRect.top + list.scrollTop + item.offsetHeight / 2;
    list.scrollTo({ top: itemCenterInScroll - list.clientHeight / 2, behavior: "smooth" });
  }

  private async _fetchStopTimes(stopId: string) {
    this._stopTimesLoading = true;
    console.info("[TripMapPopup] fetch stoptimes for stopId", stopId);

    try {
      const params = new URLSearchParams({
        stopId,
        time: new Date().toISOString(),
        arriveBy: "false",
        n: "10",
        exactRadius: "false",
        radius: "200",
      });
      const response = await fetch(`${STOPTIMES_API_BASE}?${params}`);
      if (response.ok) {
        const raw = await response.json();
        const entries: any[] = Array.isArray(raw) ? raw : (raw.times ?? raw.stopTimes ?? []);
        this._stopTimesData = entries.map((e: any): StopTimeEntry => {
          const place = e.place ?? {};
          const planned = new Date(place.scheduledDeparture ?? place.scheduledArrival ?? place.departure ?? place.arrival);
          const actual = new Date(place.departure ?? place.arrival);
          const isDelayed = e.realTime === true && Math.abs(actual.getTime() - planned.getTime()) >= 30000;
          return {
            tripId: e.tripId ?? "",
            headsign: e.headsign ?? "",
            routeShortName: e.routeShortName ?? e.displayName ?? "",
            plannedDeparture: planned,
            estimatedDeparture: isDelayed ? actual : undefined,
            track: place.track ?? place.scheduledTrack ?? undefined,
            alerts: (e.alerts ?? []).filter((a: any) => a?.headerText).map((a: any): Alert => ({
              headerText: a.headerText,
              descriptionText: a.descriptionText ?? "",
              severityLevel: a.severityLevel,
              cause: a.cause,
              effect: a.effect,
            })),
          };
        });
      } else {
        console.error("[TripMapPopup] stoptimes fetch failed", response.status);
      }
    } catch (e) {
      console.error("[TripMapPopup] stoptimes fetch error", e);
    }
    this._stopTimesLoading = false;
  }

  private async _fetchTrip() {
    this._tripData = null;
    this._cleanup();

    if (!this.tripId) {
      this._loading = false;
      return;
    }

    this._loading = true;
    await this.updateComplete;

    const url = `${TRIP_API_BASE}${encodeURIComponent(this.tripId)}`;

    console.info("[TripMapPopup] fetch trip data");

    try {
      const response = await fetch(url);
      if (response.ok) {
        this._tripData = await response.json();
      } else {
        console.error("[TripMapPopup] fetch failed", response.status);
      }
    } catch (e) {
      console.error("[TripMapPopup] fetch error", e);
    }

    this._loading = false;
    await this.updateComplete;

    const stopId = this._extractBoardingStopId();
    if (stopId) {
      this._fetchStopTimes(stopId);
    } else {
      console.warn("[TripMapPopup] boarding stopId not found in trip data, skipping stoptimes fetch");
    }
    requestAnimationFrame(() => this._initMap());
  }

  private _initMap() {
    const container = this._mapRef.value;
    if (!container || !this._tripData) {
      return;
    }

    this._destroyMap();

    const legs: any[] = this._tripData.legs ?? [];
    if (!legs.length) return;

    this._map = L.map(container);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: "© OpenStreetMap contributors © CARTO",
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(this._map);

    const bounds: [number, number][] = [];
    let firstPolyline: [number, number][] = [];

    legs.forEach((leg: any) => {
      if (leg.legGeometry?.points) {
        const coords = decodePolyline(leg.legGeometry.points, 6);
        if (!firstPolyline.length) firstPolyline = coords;
        L.polyline(coords, { color: "#1976d2", weight: 5, opacity: 0.85 }).addTo(this._map!);
        bounds.push(...coords);
      }

      if (leg.from?.lat && leg.from?.lon) {
        L.circleMarker([leg.from.lat, leg.from.lon], { radius: 9, color: "#fff", weight: 2, fillColor: "#2e7d32", fillOpacity: 1 })
          .bindPopup(`<b>${leg.from.name}</b>`)
          .addTo(this._map!);
        bounds.push([leg.from.lat, leg.from.lon]);
      }

      (leg.intermediateStops ?? []).forEach((stop: any) => {
        const isBoardingStop = this._isBoardingStop(stop);
        const markerOpts = isBoardingStop
          ? { radius: 10, color: "#fff", weight: 2.5, fillColor: "#7b1fa2", fillOpacity: 1 }
          : { radius: 5, color: "#fff", weight: 1.5, fillColor: "#1565c0", fillOpacity: 1 };
        const marker = L.circleMarker([stop.lat, stop.lon], markerOpts).bindPopup(`<b>${stop.name}</b>`);
        if (isBoardingStop) marker.bindTooltip(stop.name, { permanent: true, direction: "right", offset: [10, 0], className: "boarding-stop-label" });
        marker.addTo(this._map!);
        bounds.push([stop.lat, stop.lon]);
      });

      if (leg.to?.lat && leg.to?.lon) {
        L.circleMarker([leg.to.lat, leg.to.lon], { radius: 9, color: "#fff", weight: 2, fillColor: "#c62828", fillOpacity: 1 })
          .bindPopup(`<b>${leg.to.name}</b>`)
          .addTo(this._map!);
        bounds.push([leg.to.lat, leg.to.lon]);
      }
    });

    if (bounds.length) this._map.fitBounds(L.latLngBounds(bounds), { padding: [24, 24] });

    if (firstPolyline.length > 0) {
      this._stops = buildTripStops(legs[0], firstPolyline);
      this._startPositionTracking(buildTimeline(legs[0], firstPolyline), firstPolyline);
    }
  }

  private _startPositionTracking(timeline: StopTimepoint[], polyline: [number, number][]) {
    if (timeline.length < 2) {
      return;
    }

    const startMs = timeline[0].time.getTime();
    const endMs = timeline[timeline.length - 1].time.getTime();

    const update = () => {
      const now = new Date();
      const nowMs = now.getTime();

      // Update stop strip current index
      let newStopIdx = -1;
      for (let i = 0; i < this._stops.length; i++) {
        if (nowMs >= this._stops[i].plannedTime.getTime()) newStopIdx = i;
        else break;
      }
      if (newStopIdx !== this._currentStopIdx) this._currentStopIdx = newStopIdx;

      // Update vehicle marker
      const { pos, heading } = interpolatePosition(timeline, polyline, now);
      if (!pos || !this._map) return;

      const tooltip = nowMs < startMs ? "Noch nicht gestartet" : nowMs > endMs ? "Bereits angekommen" : "Aktuell";
      const color = nowMs >= startMs && nowMs <= endMs ? "#f57c00" : "#757575";
      const icon = createVehicleIcon(color, heading);

      if (!this._vehicleMarker) {
        this._vehicleMarker = L.marker(pos, { icon }).bindTooltip(tooltip).addTo(this._map);
      } else {
        this._vehicleMarker.setLatLng(pos);
        this._vehicleMarker.setIcon(icon);
      }
    };

    update();
    this._positionInterval = setInterval(update, POSITION_UPDATE_INTERVAL_MS);
  }

  private _extractBoardingStopId(): string | null {
    if (!this._tripData) return null;
    const legs: any[] = this._tripData.legs ?? [];
    if (!legs.length) return null;
    const leg = legs[0];

    // check leg.from first
    if (leg.from?.stopId && this._isBoardingStop(leg.from)) return leg.from.stopId;

    // search intermediateStops
    for (const stop of leg.intermediateStops ?? []) {
      if (stop?.stopId && this._isBoardingStop(stop)) return stop.stopId;
    }
    return null;
  }

  private _isBoardingStop(stop: any): boolean {
    if (this.fromStopId && stop.stopId) {
      return stop.stopId === this.fromStopId;
    }
    if (this.fromLat != null && this.fromLon != null && stop.lat != null && stop.lon != null) {
      const dist = Math.sqrt(Math.pow(stop.lat - this.fromLat, 2) + Math.pow(stop.lon - this.fromLon, 2));
      return dist < 0.001; // ~100m
    }
    return false;
  }

  private _destroyMap() {
    if (this._positionInterval !== null) {
      clearInterval(this._positionInterval);
      this._positionInterval = null;
    }
    this._vehicleMarker = null;
    if (this._map) {
      this._map.remove();
      this._map = null;
    }
  }

  private _cleanup() {
    this._tripData = null;
    this._loading = false;
    this._stops = [];
    this._currentStopIdx = -1;
    this._stopTimesData = [];
    this._stopTimesLoading = false;
    this._destroyMap();
  }

  private _close = () => {
    this.dispatchEvent(new CustomEvent("popup-closed", { bubbles: true, composed: true }));
  };

  private _pointerDownOnOverlay = false;

  private _onOverlayPointerDown = (e: PointerEvent) => {
    this._pointerDownOnOverlay = e.target === e.currentTarget;
  };

  private _onOverlayClick = () => {
    if (this._pointerDownOnOverlay) this._close();
  };
}
