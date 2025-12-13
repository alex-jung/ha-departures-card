import { css, unsafeCSS, html, LitElement, nothing, PropertyValues, TemplateResult, CSSResultGroup } from "lit-element";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { Config, DeparturesDataRow } from "../types";
import { ClassTimer } from "../helpers";
import { DepartureTime } from "../data/departure-time";
import { lightFormat } from "date-fns";
import { contentCore } from "../styles";

import Splide, { Options as SplideOptions } from "@splidejs/splide";
import cssText from "@splidejs/splide/dist/css/splide.min.css";
import { DEFAULT_DEPARTURE_ROW_GAP, DEFAULT_DEPARTURE_ROW_HEIGHT, DEFAULT_DEPARTURES_TO_SHOW, DEFAULT_SCROLL_BACK_TIMEOUT, DEFAULT_SHOW_SCROLLBUTTONS } from "../constants";

export abstract class Content extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(cssText)}
    ` as CSSResultGroup,
    contentCore as CSSResultGroup,
  ];

  @property({ attribute: false })
  departures!: Array<DeparturesDataRow>;

  @property({ attribute: false })
  errors!: Array<string>;

  @property({ attribute: false })
  cardConfig!: Config;

  private splide: Splide | null = null;

  private scrollBackTimer: ClassTimer | null = null;

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this._initializeSplide();
    this._initializeScrollbackTimer();
  }

  protected updated(_changedProperties: PropertyValues): void {
    if (_changedProperties.get("cardConfig")) {
      console.debug("Card config has been changed, reinitialze splide.");
      this._initializeScrollbackTimer();
      this._initializeSplide();
    } else if (_changedProperties.get("departures")) {
      console.debug("Departures have been changed, refresh splide.");
      this.splide?.refresh();
    }
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();

    this.scrollBackTimer?.stop();
    this.scrollBackTimer = null;
  }

  public render(): TemplateResult {
    if (!this.cardConfig) {
      return html`Card configuration is not available!`;
    }

    return html`
    <div class="splide-root">
      <div class="splide">
        <div style="position:relative">
          <div class="splide__arrows"></div>
            <div class="splide__track">
              <ul class="splide__list">
                ${this.departures.map((entry) => html`<li class="splide__slide">${this.renderDepartureLine(entry)}</li>`)}
              </ul>
            </div>
          </div>
        </div>
      </div>
      ${this.errors ? html`${this._renderErrors()}` : nothing}
    </div>
    `;
  }

  protected renderDelay(time: DepartureTime) {
    let htmlText: string = "";

    if (!time || time.isArriving) {
      return html``;
    }

    if (time.delay != undefined && time.delay != 0) {
      if (time.delay > 0) {
        htmlText = `(+${time.delay})`;
      } else {
        htmlText = `(-${time.delay})`;
      }
    }

    return html`<div class="cell-delay">${htmlText}</div>`;
  }

  protected renderTransportIcon(transportIcon: string | null) {
    let icon = transportIcon ?? "mdi:train-bus";

    return html`<div class="cell-transport-icon"><ha-icon icon=${icon}></ha-icon></div>`;
  }

  protected renderCellLineName(name: string | null, lineColor: string | null = null): TemplateResult {
    return html`<div class="cell-line">${name}</div>`;
  }

  protected renderCellDestination(destinationName: string | null): TemplateResult {
    return html`<div class="cell-destination">${destinationName}</div>`;
  }

  protected renderCellTime(time: DepartureTime): TemplateResult {
    let htmlText: TemplateResult = html``;

    let classes = {
      arriving: false,
    };

    if (time.isArriving) {
      classes.arriving = true;
      htmlText = html`<ha-icon icon="mdi:bus"></ha-icon>`;
    } else if (time.timeDiff > 60) {
      htmlText = html`${lightFormat(time.time, "HH:mm")}`;
    } else {
      htmlText = html`${time.timeDiff} min`;
    }

    return html`<div class="cell-time ${classMap(classes)}">${htmlText}</div>`;
  }

  protected renderDepartureLine(departure: DeparturesDataRow): TemplateResult {
    let classes = this.getDepartureLineClasses(departure);
    let styles = this.getDepartureLineStyles(departure);

    return html`
      <div class="departure-line ${classMap(classes)}" style="${styleMap(styles)}">
        ${this.renderTransportIcon(departure.icon)} ${this.renderCellLineName(departure.lineName, departure.lineColor)} ${this.renderCellDestination(departure.destinationName)}
        ${this.renderCellTime(departure.time)} ${this.renderDelay(departure.time)}
      </div>
    `;
  }

  protected getDepartureLineStyles(departure: DeparturesDataRow) {
    return {};
  }

  protected getDepartureLineClasses(departure: DeparturesDataRow) {
    let classes = {
      arriving: departure.time.isArriving,
      delayed: departure.time.isDelayed,
    };

    return classes;
  }

  private _getContentHeight(): number {
    const depsToShow = this.cardConfig.departuresToShow ?? DEFAULT_DEPARTURES_TO_SHOW;

    return depsToShow * DEFAULT_DEPARTURE_ROW_HEIGHT + depsToShow * DEFAULT_DEPARTURE_ROW_GAP;
  }

  private _renderErrors() {
    return html`
      ${this.errors.map((entity) => {
        return html`<div class="error">
          <ha-icon icon="mdi:alert"></ha-icon>
          <div>The entity '<span>${entity}</span>' is not supported!</div>
        </div>`;
      })}
    `;
  }

  private _restartscrollBackTimer() {
    if (this.scrollBackTimer == null) {
      this._initializeScrollbackTimer();
    }

    if (!this.scrollBackTimer) {
      return;
    }

    if (!this.scrollBackTimer.isRunning()) {
      this.scrollBackTimer.start(() => {
        this.splide?.go(0);
      });
    } else {
      this.scrollBackTimer.restart();
    }
  }

  private _initializeScrollbackTimer() {
    if (this.scrollBackTimer) {
      this.scrollBackTimer.stop();
      this.scrollBackTimer = null;
    }

    if (this.cardConfig.scrollBackTimeout == 0) {
      return;
    }

    const timeout = (this.cardConfig.scrollBackTimeout || DEFAULT_SCROLL_BACK_TIMEOUT) * 1000;

    console.debug("Initialize scrollback timer with timeout", timeout);

    this.scrollBackTimer = new ClassTimer(timeout);
  }

  private _initializeSplide(): void {
    if (this.splide) {
      console.debug("Splide object already exists, destroy it!");
      this.splide.destroy();
    }

    const root = this.renderRoot.querySelector(".splide") as HTMLElement;
    const visibleRows = this.cardConfig.departuresToShow ?? DEFAULT_DEPARTURES_TO_SHOW;

    if (!root || root === undefined) {
      console.debug("Splide root element not found.");
      return;
    }

    const options: SplideOptions = {
      type: "slide",
      perPage: visibleRows,
      autoplay: false,
      pagination: false,
      arrows: this.cardConfig.showScrollButtons ?? DEFAULT_SHOW_SCROLLBUTTONS,
      gap: DEFAULT_DEPARTURE_ROW_GAP,
      direction: "ttb",
      height: this._getContentHeight(),
      drag: true,
      wheel: true,
    };

    console.debug("Create new splide with following options", options);

    this.splide = new Splide(root, options);

    this.splide.on("moved scrolled dragged", (newIndex) => {
      console.debug("Splide moved to ", newIndex);

      if (newIndex == 0) {
        this.scrollBackTimer?.stop();
      } else {
        this._restartscrollBackTimer();
      }
    });

    this.splide.mount();
  }
}
