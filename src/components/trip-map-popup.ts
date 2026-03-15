import { LitElement, css, html, nothing, unsafeCSS, PropertyValues, CSSResultGroup } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ref, createRef } from "lit/directives/ref.js";
import L from "leaflet";

import leafletCssText from "leaflet/dist/leaflet.css";

const TRIP_API_BASE = "http://localhost:8888/api/v5/trip?tripId=";
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
  time: Date;
  polylineIdx: number;
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

  const addStop = (stop: any, timeStr: string) => {
    const idx = findClosestIdx([stop.lat, stop.lon], polyline, searchFrom);
    searchFrom = idx;
    stops.push({ name: stop.name ?? "", time: new Date(timeStr), polylineIdx: idx });
  };

  for (const s of is) {
    if (!s?.lat) continue;
    const t = s.arrival ?? s.departure;
    if (t) addStop(s, t);
  }
  if (leg.to?.lat) {
    const t = leg.to.arrival;
    if (t) addStop(leg.to, t);
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

function interpolatePosition(timeline: StopTimepoint[], polyline: [number, number][], now: Date): [number, number] | null {
  if (timeline.length < 2) return null;

  const nowMs = now.getTime();
  if (nowMs <= timeline[0].time.getTime()) return polyline[timeline[0].polylineIdx];
  if (nowMs >= timeline[timeline.length - 1].time.getTime()) return polyline[timeline[timeline.length - 1].polylineIdx];

  let segStart = timeline[0],
    segEnd = timeline[1];
  for (let i = 0; i < timeline.length - 1; i++) {
    if (nowMs >= timeline[i].time.getTime() && nowMs <= timeline[i + 1].time.getTime()) {
      segStart = timeline[i];
      segEnd = timeline[i + 1];
      break;
    }
  }

  // idxA === idxB means bus is dwelling at a stop → return fixed position
  const idxA = segStart.polylineIdx,
    idxB = segEnd.polylineIdx;
  if (idxA === idxB) return polyline[idxA];

  const progress = (nowMs - segStart.time.getTime()) / (segEnd.time.getTime() - segStart.time.getTime());
  let totalLen = 0;
  for (let i = idxA; i < idxB; i++) totalLen += euclidean(polyline[i], polyline[i + 1]);

  const target = progress * totalLen;
  let accumulated = 0;
  for (let i = idxA; i < idxB; i++) {
    const segLen = euclidean(polyline[i], polyline[i + 1]);
    if (accumulated + segLen >= target) {
      const t = segLen > 0 ? (target - accumulated) / segLen : 0;
      return [polyline[i][0] + t * (polyline[i + 1][0] - polyline[i][0]), polyline[i][1] + t * (polyline[i + 1][1] - polyline[i][1])];
    }
    accumulated += segLen;
  }
  return polyline[idxB];
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
      .close-btn {
        cursor: pointer;
        background: none;
        border: none;
        font-size: 1.2em;
        color: var(--primary-text-color);
        padding: 4px 8px;
      }
      .body {
        flex: 1;
        position: relative;
        min-height: 0;
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

      /* ── Stop strip ────────────────────────────────────────────── */
      .stop-strip {
        flex-shrink: 0;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        overflow-x: auto;
        overflow-y: hidden;
        /* no horizontal padding here — spacer divs handle it so content
           isn't clipped at the scroll edges */
        padding: 12px 0 10px;
        border-top: 1px solid var(--divider-color, #e0e0e0);
        cursor: grab;
      }
      .stop-strip:active {
        cursor: grabbing;
      }
      .stop-strip-spacer {
        flex-shrink: 0;
        min-width: 20px;
      }
      .stop-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-shrink: 0;
        width: 80px;
      }
      /* horizontal connecting line between two stop dots */
      .stop-connector {
        flex-shrink: 0;
        width: 32px;
        height: 2px;
        margin-top: 6px; /* aligns with dot center (dot 14px → center 7px, minus 1px border) */
      }
      .stop-connector.passed {
        background: #1976d2;
      }
      .stop-connector.upcoming {
        background: repeating-linear-gradient(to right, #bdbdbd 0, #bdbdbd 4px, transparent 4px, transparent 8px);
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
        margin-top: -1px;
      }
      .stop-dot.upcoming {
        background: transparent;
        border-color: #bdbdbd;
      }
      .stop-name {
        font-size: 0.75em;
        text-align: center;
        margin-top: 5px;
        max-width: 80px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: 1.3;
        color: var(--primary-text-color);
        word-break: break-word;
      }
      .stop-time {
        font-size: 0.75em;
        text-align: center;
        color: var(--secondary-text-color);
        margin-top: 3px;
        white-space: nowrap;
      }
      .stop-item.next .stop-name,
      .stop-item.next .stop-time {
        color: #f57c00;
        font-weight: bold;
      }
      @keyframes stop-pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(245, 124, 0, 0.6);
        }
        60% {
          box-shadow: 0 0 0 7px rgba(245, 124, 0, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(245, 124, 0, 0);
        }
      }
      .stop-dot.next {
        animation: stop-pulse 1.6s ease-out infinite;
      }

      /* ── Mobile: vertical stop list, map hidden ─────────────────── */
      @media (max-width: 600px) {
        .dialog {
          width: 95vw;
          height: 85vh;
        }
        .body {
          display: none;
        }
        .stop-strip {
          flex: 1;
          flex-direction: column;
          overflow-x: hidden;
          overflow-y: auto;
          padding: 8px 16px;
          cursor: default;
          min-height: 0;
          touch-action: pan-y;
          -webkit-overflow-scrolling: touch;
        }
        .stop-strip-spacer {
          min-width: 0;
          min-height: 12px;
        }
        /* stop row: dot on left, name + time on right */
        .stop-item {
          flex-direction: row;
          width: 100%;
          align-items: center;
          gap: 12px;
          padding: 3px 0;
        }
        /* vertical connector line, centered under the dot (dot=14px → center=7px, line=2px → margin=6px) */
        .stop-connector {
          width: 2px;
          height: 22px;
          margin-top: 0;
          margin-left: 6px;
          align-self: flex-start;
        }
        .stop-connector.upcoming {
          background: repeating-linear-gradient(to bottom, #bdbdbd 0, #bdbdbd 4px, transparent 4px, transparent 8px);
        }
        .stop-dot.next {
          margin-top: 0; /* cancel the -1px from default rule */
        }
        .stop-name {
          flex: 1;
          text-align: left;
          max-width: none;
          -webkit-line-clamp: 1;
          margin-top: 0;
        }
        .stop-time {
          text-align: right;
          flex-shrink: 0;
          margin-top: 0;
        }
      }
    `,
  ];

  @property() tripId?: string;
  @property() title = "";
  @property({ type: Boolean }) open = false;

  @state() private _loading = false;
  @state() private _tripData: any = null;
  @state() private _stops: StopInfo[] = [];
  @state() private _currentStopIdx = -1;

  private _map: L.Map | null = null;
  private _mapRef = createRef<HTMLDivElement>();
  private _stripRef = createRef<HTMLDivElement>();
  private _vehicleMarker: L.CircleMarker | null = null;
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
            <button class="close-btn" @click=${this._close}>✕</button>
          </div>
          <div class="body">${this._loading ? html`<div class="loading">Loading…</div>` : html`<div class="map" ${ref(this._mapRef)}></div>`}</div>
          ${this._stops.length ? this._renderStopStrip() : nothing}
        </div>
      </div>
    `;
  }

  private _renderStopStrip() {
    const cur = this._currentStopIdx;
    return html`
      <div class="stop-strip" ${ref(this._stripRef)} @wheel=${this._onStripWheel} @mousedown=${this._onStripMouseDown}>
        <div class="stop-strip-spacer"></div>
        ${this._stops.map((stop, i) => {
          const isNext = cur >= 0 && i === cur + 1;
          const dotClass = i <= cur ? "passed" : isNext ? "next" : "upcoming";
          const itemClass = isNext ? "next" : "";
          const connClass = i <= cur ? "passed" : "upcoming";
          return html`
            ${i > 0 ? html`<div class="stop-connector ${connClass}"></div>` : nothing}
            <div class="stop-item ${itemClass}">
              <div class="stop-dot ${dotClass}"></div>
              <div class="stop-name">${stop.name}</div>
              <div class="stop-time">${formatTime(stop.time)}</div>
            </div>
          `;
        })}
        <div class="stop-strip-spacer"></div>
      </div>
    `;
  }

  private _onStripWheel = (e: WheelEvent) => {
    if (window.matchMedia("(max-width: 600px)").matches) return; // vertical — let browser scroll natively
    const strip = this._stripRef.value;
    if (!strip) return;
    e.preventDefault();
    strip.scrollLeft += e.deltaY !== 0 ? e.deltaY : e.deltaX;
  };

  // Click-and-drag horizontal scrolling
  private _stripDragStart = 0;
  private _stripScrollStart = 0;

  private _onStripMouseDown = (e: MouseEvent) => {
    const strip = this._stripRef.value;
    if (!strip) return;
    const isMobile = window.matchMedia("(max-width: 600px)").matches;
    if (isMobile) {
      this._stripDragStart = e.clientY;
      this._stripScrollStart = strip.scrollTop;
      const onMove = (ev: MouseEvent) => {
        strip.scrollTop = this._stripScrollStart - (ev.clientY - this._stripDragStart);
      };
      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    } else {
      this._stripDragStart = e.clientX;
      this._stripScrollStart = strip.scrollLeft;
      const onMove = (ev: MouseEvent) => {
        strip.scrollLeft = this._stripScrollStart - (ev.clientX - this._stripDragStart);
      };
      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    }
  };

  private _scrollStripToNextStop() {
    const strip = this._stripRef.value;
    if (!strip || !this._stops.length) return;
    const targetIdx = Math.max(0, Math.min(this._currentStopIdx + 1, this._stops.length - 1));
    const items = strip.querySelectorAll<HTMLElement>(".stop-item");
    const item = items[targetIdx];
    if (!item) return;
    const stripRect = strip.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const isMobile = window.matchMedia("(max-width: 600px)").matches;
    if (isMobile) {
      const itemCenterInScroll = itemRect.top - stripRect.top + strip.scrollTop + item.offsetHeight / 2;
      strip.scrollTo({ top: itemCenterInScroll - strip.clientHeight / 2, behavior: "smooth" });
    } else {
      const itemCenterInScroll = itemRect.left - stripRect.left + strip.scrollLeft + item.offsetWidth / 2;
      strip.scrollTo({ left: itemCenterInScroll - strip.clientWidth / 2, behavior: "smooth" });
    }
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

    console.info("[TripMapPopup] fetch data");

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
        L.circleMarker([stop.lat, stop.lon], { radius: 5, color: "#fff", weight: 1.5, fillColor: "#1565c0", fillOpacity: 1 }).bindPopup(`<b>${stop.name}</b>`).addTo(this._map!);
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
        if (nowMs >= this._stops[i].time.getTime()) newStopIdx = i;
        else break;
      }
      if (newStopIdx !== this._currentStopIdx) this._currentStopIdx = newStopIdx;

      // Update vehicle marker
      const pos = interpolatePosition(timeline, polyline, now);
      if (!pos || !this._map) return;

      const tooltip = nowMs < startMs ? "Noch nicht gestartet" : nowMs > endMs ? "Bereits angekommen" : "Aktuell";
      const color = nowMs >= startMs && nowMs <= endMs ? "#f57c00" : "#757575";

      if (!this._vehicleMarker) {
        this._vehicleMarker = L.circleMarker(pos, { radius: 9, color: "#fff", weight: 3, fillColor: color, fillOpacity: 1 }).bindTooltip(tooltip).addTo(this._map);
      } else {
        this._vehicleMarker.setLatLng(pos);
      }
    };

    update();
    this._positionInterval = setInterval(update, POSITION_UPDATE_INTERVAL_MS);
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
