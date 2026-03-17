import { LitElement, css, html, nothing, unsafeCSS, PropertyValues, CSSResultGroup } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Alert, StopInfo, StopTimepoint } from "../types";
import { ref, createRef } from "lit/directives/ref.js";
import L from "leaflet";
import { buildTimeline, buildTripStops, createVehicleIcon, decodePolyline, formatTime, haLocaleToDateFns, interpolatePosition } from "../helpers";
import { CARD_REPO_URL, CARD_VERSION } from "../constants";
import { localize } from "../locales/localize";

import leafletCssText from "leaflet/dist/leaflet.css";
import { formatDistanceToNow } from "date-fns";

const TRIP_API_BASE = __TRANSITOUS_API_BASE__ + "/api/v5/trip?tripId=";
const API_HEADERS = {
  "User-Agent": `ha-departures-card/${CARD_VERSION} (${CARD_REPO_URL})`,
  Accept: "application/json",
};
const POSITION_UPDATE_INTERVAL_MS = 5000;

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
        font-size: 1.1em;
      }
      .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9998;
        display: flex;
        align-items: center;
        justify-content: center;
        overscroll-behavior: none;
        touch-action: none;
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
        to {
          transform: rotate(360deg);
        }
      }
      .refresh-btn .spin-icon {
        display: inline-block;
      }
      .refresh-btn.spinning .spin-icon {
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
        border-top: 1px solid rgba(255, 255, 255, 0.3);
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
        padding: 24px 16px 0;
        touch-action: pan-y;
        cursor: grab;
      }
      .stop-list.dragging {
        cursor: grabbing;
        user-select: none;
      }
      .stop-item {
        display: grid;
        grid-template-columns: 48px 24px 1fr;
        align-items: stretch;
        min-height: 52px;
      }
      .stop-timeline {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .stop-line {
        width: 1px;
        flex: 1;
      }
      .stop-line.passed {
        background: #1976d2;
        width: 2px;
      }
      .stop-line.upcoming {
        width: 2px;
        background-image: repeating-linear-gradient(to bottom, #bdbdbd 0, #bdbdbd 3px, transparent 3px, transparent 7px);
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
      .stop-time-col {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      .stop-time-spacer {
        flex: 1;
      }
      .stop-time-content {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
      .stop-name-section {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 6px;
        padding: 0 0 0 10px;
        min-width: 0;
      }
      .stop-name {
        font-size: 0.85em;
        font-weight: bold;
        line-height: 1.3;
        color: var(--primary-text-color);
        flex: 1;
        min-width: 0;
      }
      .stop-platform {
        font-size: 0.7em;
        font-weight: bold;
        background: var(--secondary-background-color, #e0e0e0);
        color: var(--secondary-text-color);
        border-radius: 3px;
        padding: 2px 6px;
        white-space: nowrap;
        flex-shrink: 0;
      }
      .stop-time-planned {
        font-size: 0.75em;
        white-space: nowrap;
      }
      .stop-time-scheduled {
        font-size: 0.75em;
        font-weight: 600;
        white-space: nowrap;
      }
      .stop-time-scheduled.delayed {
        color: #c62828;
      }
      .stop-time-scheduled.ontime {
        color: #2e7d32;
      }
      .stop-item.next .stop-name {
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
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
      }
      .boarding-stop-label::before {
        display: none;
      }

      /* ── Next-stop map tooltip ──────────────────────────────────── */
      .next-stop-map-label {
        background: #f57c00;
        color: #fff;
        border: none;
        border-radius: 4px;
        font-size: 1.1em;
        font-weight: bold;
        padding: 5px 12px;
        white-space: nowrap;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
      }
      .next-stop-map-label::before {
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
          padding: 16px 16px;
        }
      }
    `,
  ];

  @property() tripId?: string;
  @property() title = "";
  @property({ type: Boolean }) open = false;
  @property() language = "en";

  @state() private _loading = false;
  @state() private _error = false;
  @state() private _tripData: any = null;
  @state() private _alerts: Alert[] = [];
  @state() private _stops: StopInfo[] = [];
  @state() private _currentStopIdx = -1;
  @state() private _nextLabel = "";
  @state() private _destLabel = "";

  private _map: L.Map | null = null;
  private _mapRef = createRef<HTMLDivElement>();
  private _stripRef = createRef<HTMLDivElement>();
  private _vehicleMarker: L.Marker | null = null;
  private _nextStopMarker: L.Marker | null = null;
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
              <button class="refresh-btn ${this._loading ? "spinning" : ""}" ?disabled=${this._loading} @click=${this._fetchTrip}><span class="spin-icon">↻</span></button>
              <button class="close-btn" @click=${this._close}>✕</button>
            </div>
          </div>
          ${this._alerts.length > 0
            ? html`
                <div class="alert-banner">
                  ${this._alerts.map((a) => {
                    const color = a.severityLevel === "SEVERE" ? "#c62828" : a.severityLevel === "INFO" ? "#1565c0" : "#e65100";
                    const icon = a.severityLevel === "SEVERE" ? "mdi:alert-octagon-outline" : a.severityLevel === "INFO" ? "mdi:information-outline" : "mdi:alert-outline";
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
              `
            : nothing}
          <div class="content">
            ${this._error
              ? html`
                  <div class="loading" style="flex:1;flex-direction:column;gap:8px">
                    <ha-icon icon="mdi:alert-circle-outline" style="--mdc-icon-size:36px;opacity:0.4"></ha-icon>
                    <span>${localize("card.popup.no-data", this.language)}</span>
                  </div>
                `
              : html`
                  ${this._stops.length ? this._renderStopList() : nothing}
                  <div class="map-panel">
                    ${this._loading ? html`<div class="loading">${localize("card.popup.loading", this.language)}</div>` : html`<div class="map" ${ref(this._mapRef)}></div>`}
                  </div>
                `}
          </div>
        </div>
      </div>
    `;
  }

  private _renderNextStopBanner() {
    const cur = this._currentStopIdx;
    const next = this._stops[cur + 1];
    if (!next) return nothing;

    const nextTime = next.scheduledTime ?? next.plannedTime;
    this._nextLabel = formatDistanceToNow(nextTime, { includeSeconds: false, addSuffix: true, locale: haLocaleToDateFns(this.language) });

    const dest = this._stops[this._stops.length - 1];
    const destTime = dest ? dest.scheduledTime ?? dest.plannedTime : null;
    this._destLabel = destTime ? formatDistanceToNow(destTime, { includeSeconds: false, addSuffix: true, locale: haLocaleToDateFns(this.language) }) : "";

    return html`
      <div class="next-stop-banner">
        <div class="next-stop-label">${localize("card.popup.next-stop-label", this.language)}</div>
        <div class="next-stop-name">${next.name}</div>
        <div class="next-stop-time">${this._nextLabel}</div>
        ${destTime
          ? html`
              <div class="next-stop-dest-row">
                <span class="next-stop-dest-label">${localize("card.popup.dest-arrival-label", this.language)}</span>
                <span class="next-stop-dest-time">${this._destLabel}</span>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private _renderStopList() {
    const cur = this._currentStopIdx;
    return html`
      <div class="stop-panel">
        ${this._renderNextStopBanner()}
        <div class="stop-list" ${ref(this._stripRef)} @pointerdown=${this._onListPointerDown}>
          ${this._stops.map((stop, i) => {
            const isNext = cur >= 0 && i === cur + 1;
            const dotClass = i <= cur ? "passed" : isNext ? "next" : "upcoming";
            const itemClass = isNext ? "next" : "";
            const lineClass = i <= cur ? "passed" : "upcoming";
            const isLast = i === this._stops.length - 1;
            const delayed = stop.scheduledTime && stop.scheduledTime.getTime() > stop.plannedTime.getTime();

            console.debug("Parsing stop time", stop);

            const estClass = delayed ? "delayed" : "ontime";
            return html`
              <div class="stop-item ${itemClass}">
                <div class="stop-time-col">
                  <div class="stop-time-content">
                    <span class="stop-time-planned">${formatTime(stop.plannedTime)}</span>
                    ${stop.scheduledTime ? html`<span class="stop-time-scheduled ${estClass}">${formatTime(stop.scheduledTime)}</span>` : nothing}
                  </div>
                </div>
                <div class="stop-timeline">
                  <div class="stop-dot ${dotClass}"></div>
                  <div class="stop-line ${isLast ? "hidden" : lineClass}"></div>
                </div>
                <div class="stop-name-section">
                  <div class="stop-name">${stop.name}</div>
                  ${stop.platform ? html`<div class="stop-platform">${localize("card.popup.platform-text", this.language)} ${stop.platform}</div>` : nothing}
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  private _onListPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const list = this._stripRef.value;
    if (!list) return;
    list.setPointerCapture(e.pointerId);
    list.classList.add("dragging");
    const startY = e.clientY;
    const startScroll = list.scrollTop;
    const onMove = (ev: PointerEvent) => {
      list.scrollTop = startScroll - (ev.clientY - startY) * 3;
    };
    const onUp = () => {
      list.classList.remove("dragging");
      list.removeEventListener("pointermove", onMove as EventListener);
      list.removeEventListener("pointerup", onUp);
    };
    list.addEventListener("pointermove", onMove as EventListener);
    list.addEventListener("pointerup", onUp);
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

    try {
      const response = await fetch(url, { headers: API_HEADERS });
      if (response.ok) {
        this._tripData = await response.json();
        this._alerts = (this._tripData?.alerts ?? [])
          .filter((a: any) => a?.headerText)
          .map(
            (a: any): Alert => ({
              headerText: a.headerText,
              descriptionText: a.descriptionText ?? "",
              severityLevel: a.severityLevel,
              cause: a.cause,
              effect: a.effect,
            }),
          );
        this._error = false;
      } else {
        console.error("[TripMapPopup] fetch failed", response.status);
        this._error = true;
      }
    } catch (e) {
      console.error("[TripMapPopup] fetch error", e);
      this._error = true;
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
        const markerOpts = { radius: 5, color: "#fff", weight: 1.5, fillColor: "#1565c0", fillOpacity: 1 };
        const marker = L.circleMarker([stop.lat, stop.lon], markerOpts).bindPopup(`<b>${stop.name}</b>`);
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
    let lastNextIdx = -2;

    const update = () => {
      const now = new Date();
      const nowMs = now.getTime();

      // Update stop strip current index
      let newStopIdx = -1;
      for (let i = 0; i < this._stops.length; i++) {
        if (nowMs >= (this._stops[i].scheduledTime ?? this._stops[i].plannedTime).getTime()) newStopIdx = i;
        else break;
      }
      if (newStopIdx !== this._currentStopIdx) this._currentStopIdx = newStopIdx;

      // Update next-stop map tooltip
      const nextIdx = this._currentStopIdx + 1;
      if (nextIdx !== lastNextIdx) {
        lastNextIdx = nextIdx;
        if (this._nextStopMarker) {
          this._nextStopMarker.remove();
          this._nextStopMarker = null;
        }
        const nextStop = this._stops[nextIdx];
        if (nextStop && this._map) {
          const pos = polyline[nextStop.polylineIdx];
          const emptyIcon = L.divIcon({ html: "", className: "", iconSize: [0, 0] });
          this._nextStopMarker = L.marker(pos, { icon: emptyIcon, interactive: false })
            .bindTooltip(nextStop.name, { permanent: true, direction: "right", offset: [10, 0], className: "next-stop-map-label" })
            .addTo(this._map);
        }
      }

      // Update vehicle marker
      const isActive = nowMs >= startMs && nowMs <= endMs;

      // update next stop banner
      this._renderNextStopBanner();

      if (!isActive) {
        if (this._vehicleMarker) {
          this._vehicleMarker.remove();
          this._vehicleMarker = null;
        }
        return;
      }

      const { pos, heading } = interpolatePosition(timeline, polyline, now);
      if (!pos || !this._map) return;

      const icon = createVehicleIcon("#f57c00", heading);

      if (!this._vehicleMarker) {
        this._vehicleMarker = L.marker(pos, { icon }).bindTooltip(localize("card.popup.vehicle-current", this.language)).addTo(this._map);
      } else {
        this._vehicleMarker.setLatLng(pos);
        this._vehicleMarker.setIcon(icon);
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
    this._nextStopMarker = null;
    if (this._map) {
      this._map.remove();
      this._map = null;
    }
  }

  private _cleanup() {
    this._tripData = null;
    this._alerts = [];
    this._loading = false;
    this._error = false;
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
