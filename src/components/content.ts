import { html, LitElement, nothing, TemplateResult, CSSResultGroup, PropertyValues } from "lit-element";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { CardTheme, Config, DeparturesDataRow, LayoutCell } from "../types";
import { lightFormat } from "date-fns";
import { contentCore } from "../styles";
import { DEFAULT_ENTITY_ICON } from "../constants";
import { Layout } from "../data/layout";

import { localize } from "../locales/localize";
import { getContrastTextColor } from "../helpers";
import { animatePresets } from "../animate-presets";

export abstract class Content extends LitElement {
  static styles = [contentCore as CSSResultGroup];

  @property({ attribute: false })
  departures!: Array<DeparturesDataRow>;

  @property({ attribute: false })
  language!: string;

  @property({ attribute: false })
  errors!: Array<Error>;

  @property({ attribute: false })
  cardConfig!: Config;

  @property({ attribute: false })
  theme: CardTheme = CardTheme.BASIC;

  /**
   * The layout configuration for the departure rows.
   * @type {Layout}
   */
  protected layout!: Layout;

  protected updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);
    this._animateArriving();
  }

  connectedCallback() {
    super.connectedCallback();
    this._animateArriving();
  }

  public render(): TemplateResult {
    if (!this.cardConfig) {
      return html`Card configuration is not available!`;
    }

    if (!this.layout) {
      this.layout = this.createLayout();
    }

    return html` <div class="content" theme=${this.theme}>${this.renderContent()} ${this.errors ? html`${this._renderErrors()}` : nothing}</div> `;
  }

  private _animateArriving() {
    const animation = this.cardConfig?.departureAnimation ?? "none";
    const animateLine = this.cardConfig?.animateLine ?? false;

    if (animation === "none") {
      return;
    }

    if (!(animation in animatePresets)) {
      console.error("Unknown animation type", animation);
      return;
    }

    const preset = animatePresets[animation];
    const customDuration = this.cardConfig?.departureAnimationDuration ?? 0;
    const duration = customDuration != 0 ? customDuration : preset.options?.duration;
    const options = { ...preset.options, duration: duration };

    let elements;

    if (animateLine) {
      elements = this.shadowRoot?.querySelectorAll(this.getQueryLineElements());
    } else {
      elements = this.shadowRoot?.querySelectorAll(this.getQueryTimeElements());
    }

    elements?.forEach((element) => {
      if (element.classList.contains("arriving")) {
        if (element.getAnimations().length == 0) {
          element.animate(preset.keyframes, options);
        }
      } else {
        element.getAnimations().forEach((animation) => {
          animation.cancel();
        });
      }
    });
  }

  /**
   * Renders the content.
   * This function should be implemented in sub classes.
   */
  protected abstract renderContent(): TemplateResult;

  protected abstract createLayout(): Layout;

  protected abstract getQueryLineElements(): string;

  protected abstract getQueryTimeElements(): string;

  /**
   * Renders the list header.
   * @returns A TemplateResult containing the rendered list header depending on configured layout.
   */
  protected renderListHeader(): TemplateResult {
    if (!this.cardConfig.showListHeader) {
      return html``;
    }

    let layoutCells = this.layout?.getCells();
    let styles = {
      "grid-template-columns": this.layout?.getColumns(),
    };

    if (!layoutCells) {
      return html``;
    }

    let content: Array<TemplateResult> = [];

    layoutCells.forEach((cell) => {
      switch (cell) {
        case LayoutCell.ICON:
          content.push(html`<div class="list-header-icon">${localize("card.list-header.icon", this.language)}</div>`);
          break;
        case LayoutCell.LINE:
          content.push(html`<div class="list-header-line">${localize("card.list-header.line", this.language)}</div>`);
          break;
        case LayoutCell.DESTINATION:
          content.push(html`<div class="list-header-destination">${localize("card.list-header.destination", this.language)}</div>`);
          break;
        case LayoutCell.TIME_DIFF:
          content.push(html`<div class="list-header-time-diff">${localize("card.list-header.time-diff", this.language)}</div>`);
          break;
        case LayoutCell.PLANNED_TIME:
          content.push(html`<div class="list-header-planned-time">${localize("card.list-header.planned-time", this.language)}</div>`);
          break;
        case LayoutCell.ESTIMATED_TIME:
          content.push(html`<div class="list-header-estimated-time">${localize("card.list-header.estimated-time", this.language)}</div>`);
          break;
        case LayoutCell.DELAY:
          content.push(html`<div class="list-header-delay">${localize("card.list-header.delay", this.language)}</div>`);
          break;
      }
    });

    return html`<div class="list-header">
      <div class="list-header-content" theme=${this.theme} style="${styleMap(styles)}">${content}</div>
      <hr width="98%" />
    </div>`;
  }

  /**
   * Renders a single departure line with the configured layout cells.
   * @param departure - The departure data row to render
   * @returns A TemplateResult containing the rendered departure line with applied classes and styles
   */
  protected renderDepartureLine(departure: DeparturesDataRow): TemplateResult {
    let classes = {
      arriving: departure.time.isArriving(this.cardConfig.arrivalTimeOffset),
      delayed: departure.time.isDelayed,
      earlier: departure.time.isEarlier,
    };
    let styles = {};
    const layoutCells = this.layout?.getCells();

    if (!layoutCells) {
      return html``;
    }

    styles = { ...styles, "grid-template-columns": this.layout?.getColumns() };

    switch (this.theme) {
      case CardTheme.CAPPUCINO:
        styles = { ...styles, borderLeft: `8px solid ${departure.lineColor ?? ""}` };
    }

    let content: Array<TemplateResult> = [];

    layoutCells.forEach((cell) => {
      switch (cell) {
        case LayoutCell.ICON:
          content.push(this.renderTransportIcon(departure));
          break;
        case LayoutCell.LINE:
          content.push(this.renderCellLineName(departure));
          break;
        case LayoutCell.DESTINATION:
          content.push(this.renderCellDestination(departure));
          break;
        case LayoutCell.TIME_DIFF:
          content.push(this.renderCellTimeDiff(departure));
          break;
        case LayoutCell.PLANNED_TIME:
          content.push(this.renderCellPlannedTime(departure));
          break;
        case LayoutCell.ESTIMATED_TIME:
          content.push(this.renderCellEstimatedTime(departure));
          break;
        case LayoutCell.DELAY:
          content.push(this.renderDelay(departure));
          break;
      }
    });

    return html` <div class="departure-line  ${classMap(classes)}" theme=${this.theme} style="${styleMap(styles)}">${content}</div> `;
  }

  /**
   * Renders a transport icon for a departure.
   * @param departure - The departure data row containing icon information
   * @returns A template result containing the rendered icon element
   */
  protected renderTransportIcon(departure: DeparturesDataRow): TemplateResult {
    const icon = departure.icon ?? DEFAULT_ENTITY_ICON;

    return html`<div class="cell-transport-icon" theme=${this.theme}><ha-icon icon=${icon}></ha-icon></div>`;
  }

  /**
   * Renders a cell displaying the line name of a departure.
   * @param departure - The departure data row containing line information
   * @returns A template result containing the rendered line name cell
   */
  protected renderCellLineName(departure: DeparturesDataRow): TemplateResult {
    let styles = {};

    let contrastTextColor = "";

    if (departure.lineColor) {
      contrastTextColor = getContrastTextColor(departure.lineColor);
    }

    switch (this.theme) {
      case CardTheme.BLUE_OCEAN:
      case CardTheme.BASIC:
        styles = { backgroundColor: departure.lineColor, color: contrastTextColor };
        break;
      case CardTheme.BLACK_WHITE:
        styles = {
          color: departure.lineColor ?? "white",
        };
        break;
    }

    return html`<div><div class="cell-line" theme=${this.theme} style=${styleMap(styles)}>${departure.lineName}</div></div>`;
  }

  /**
   * Renders a destination cell for a departure row.
   * @param departure - The departure data row containing destination information
   * @returns A template result containing the rendered destination cell HTML
   */
  protected renderCellDestination(departure: DeparturesDataRow): TemplateResult {
    return html`<div class="cell-destination" theme=${this.theme}>${departure.destinationName}</div>`;
  }

  /**
   * Renders the planned time cell for a departure row.
   * @param departure - The departure data row containing time information
   * @returns A template result containing the formatted planned time or a dash if unavailable
   */
  protected renderCellPlannedTime(departure: DeparturesDataRow): TemplateResult {
    const time = departure.time.planned;
    const htmlText = time ? lightFormat(time, "HH:mm") : "-";

    return html`<div class="cell-planned-time" theme=${this.theme}>${htmlText}</div>`;
  }

  /**
   * Renders the estimated time cell for a departure row.
   * @param departure - The departure data row containing time information
   * @returns A template result containing the formatted estimated time or a dash if unavailable
   */
  protected renderCellEstimatedTime(departure: DeparturesDataRow): TemplateResult {
    const time = departure.time.estimated;
    const htmlText = time ? lightFormat(time, "HH:mm") : "-";

    return html`<div class="cell-estimated-time" theme=${this.theme}>${htmlText}</div>`;
  }

  /**
   * Renders a departure time cell with conditional formatting based on arrival status.
   *
   * @param departure - The departure data row containing time and icon information
   * @returns A template result containing the formatted time display with appropriate styling
   *
   * @remarks
   * - If the departure is arriving, displays an icon with the "arriving" class
   * - If the time difference is greater than 60 minutes, displays the time in HH:mm format
   * - Otherwise, displays the time difference in minutes
   */
  protected renderCellTimeDiff(departure: DeparturesDataRow): TemplateResult {
    let htmlText: TemplateResult = html``;
    const time = departure.time;
    const icon = this.getDepartureIcon() ?? departure.icon ?? DEFAULT_ENTITY_ICON;
    const arriving = time.isArriving(this.cardConfig.arrivalTimeOffset);

    let classes = {
      arriving: arriving,
    };

    if (time.timeDiff == 0) {
      htmlText = html`<ha-icon icon=${icon}></ha-icon>`;
    } else if (time.timeDiff > 60) {
      htmlText = html`${lightFormat(time.time, "HH:mm")}`;
    } else {
      htmlText = html`${time.timeDiff} min`;
    }

    return html`<div><div class="cell-time-diff ${classMap(classes)}" theme=${this.theme}>${htmlText}</div></div>`;
  }

  /**
   * Renders the delay information for a departure.
   * @param departure - The departure data containing time information
   * @returns A TemplateResult containing a div with the delay value, prefixed with '+' for delays or '-' for earlier arrivals
   */
  protected renderDelay(departure: DeparturesDataRow): TemplateResult {
    let htmlText: string = "";
    const time = departure.time;
    const arriving = departure.time.isArriving(this.cardConfig.arrivalTimeOffset);

    let classes = {
      arriving: arriving,
      delayed: time.isDelayed,
      earlier: time.isEarlier,
    };

    if (time.delay != undefined) {
      if (time.isDelayed) {
        htmlText = `+${time.delay}`;
      } else if (time.isEarlier) {
        htmlText = `${time.delay}`;
      }
    }

    return html`<div><div class="cell-delay ${classMap(classes)}" theme=${this.theme}>${htmlText}</div></div>`;
  }

  protected getDepartureIcon(): string | undefined {
    let icon = this.cardConfig.departureIcon;

    if (icon && icon != undefined && icon != "") {
      return icon;
    }

    return undefined;
  }

  /**
   * Renders error messages.
   * @returns {TemplateResult} A template containing error messages,
   * displaying an alert icon and a message indicating the entity error.
   */
  private _renderErrors() {
    return html`
      ${this.errors.map((error) => {
        return html`<div class="error">
          <ha-icon icon="mdi:alert"></ha-icon>
          <div>'<span>${error.name}</span>': ${error.message}</div>
        </div>`;
      })}
    `;
  }
}
