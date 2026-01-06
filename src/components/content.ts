import { html, LitElement, nothing, TemplateResult, CSSResultGroup } from "lit-element";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { Config, DeparturesDataRow, LayoutCell } from "../types";
import { lightFormat } from "date-fns";
import { contentCore } from "../styles";
import { DEFAULT_ENTITY_ICON } from "../constants";
import { Layout } from "../data/layout";

import { localize } from "../locales/localize";

export abstract class Content extends LitElement {
  static styles = [contentCore as CSSResultGroup];

  @property({ attribute: false })
  departures!: Array<DeparturesDataRow>;

  @property({ attribute: false })
  language!: string;

  @property({ attribute: false })
  errors!: Array<string>;

  @property({ attribute: false })
  cardConfig!: Config;

  /**
   * The layout configuration for the departure rows.
   * @type {Layout | null}
   */
  protected layout: Layout | null = null;

  public render(): TemplateResult {
    if (!this.cardConfig) {
      return html`Card configuration is not available!`;
    }

    if (!this.layout) {
      this.layout = new Layout(this.cardConfig.layout);
    }

    return html` <div class="content">${this.renderContent()} ${this.errors ? html`${this._renderErrors()}` : nothing}</div> `;
  }

  /**
   * Renders the content.
   * This function should be implemented in sub classes.
   */
  protected abstract renderContent(): TemplateResult;

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
      }
    });

    return html` <div class="list-header" style="${styleMap(styles)}">${content}</div>
      <hr />`;
  }

  /**
   * Renders a single departure line with the configured layout cells.
   * @param departure - The departure data row to render
   * @returns A TemplateResult containing the rendered departure line with applied classes and styles
   */
  protected renderDepartureLine(departure: DeparturesDataRow): TemplateResult {
    let classes = this.getDepartureLineClasses(departure);
    let styles = this.getDepartureLineStyles(departure);
    let layoutCells = this.layout?.getCells();

    if (!layoutCells) {
      return html``;
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

    return html` <div class="departure-line ${classMap(classes)}" style="${styleMap(styles)}">${content}</div> `;
  }

  /**
   * Renders a transport icon for a departure.
   * @param departure - The departure data row containing icon information
   * @returns A template result containing the rendered icon element
   */
  protected renderTransportIcon(departure: DeparturesDataRow): TemplateResult {
    let icon = departure.icon ?? "mdi:train-bus";

    return html`<div class="cell-transport-icon"><ha-icon icon=${icon}></ha-icon></div>`;
  }

  /**
   * Renders a cell displaying the line name of a departure.
   * @param departure - The departure data row containing line information
   * @returns A template result containing the rendered line name cell
   */
  protected renderCellLineName(departure: DeparturesDataRow): TemplateResult {
    return html`<div class="cell-line">${departure.lineName}</div>`;
  }

  /**
   * Renders a destination cell for a departure row.
   * @param departure - The departure data row containing destination information
   * @returns A template result containing the rendered destination cell HTML
   */
  protected renderCellDestination(departure: DeparturesDataRow): TemplateResult {
    return html`<div class="cell-destination">${departure.destinationName}</div>`;
  }

  /**
   * Renders the planned time cell for a departure row.
   * @param departure - The departure data row containing time information
   * @returns A template result containing the formatted planned time or a dash if unavailable
   */
  protected renderCellPlannedTime(departure: DeparturesDataRow): TemplateResult {
    const time = departure.time.planned;
    const htmlText = time ? lightFormat(time, "HH:mm") : "-";

    return html`<div class="cell-planned-time">${htmlText}</div>`;
  }

  /**
   * Renders the estimated time cell for a departure row.
   * @param departure - The departure data row containing time information
   * @returns A template result containing the formatted estimated time or a dash if unavailable
   */
  protected renderCellEstimatedTime(departure: DeparturesDataRow): TemplateResult {
    const time = departure.time.estimated;
    const htmlText = time ? lightFormat(time, "HH:mm") : "-";

    return html`<div class="cell-estimated-time">${htmlText}</div>`;
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
    const icon = departure.icon ?? DEFAULT_ENTITY_ICON;

    let classes = {
      arriving: false,
    };

    if (time.isArriving) {
      classes.arriving = true;
      htmlText = html`<ha-icon icon=${icon}></ha-icon>`;
    } else if (time.timeDiff > 60) {
      htmlText = html`${lightFormat(time.time, "HH:mm")}`;
    } else {
      htmlText = html`${time.timeDiff} min`;
    }

    return html`<div class="cell-time-diff ${classMap(classes)}">${htmlText}</div>`;
  }

  /**
   * Renders the delay information for a departure.
   * @param departure - The departure data containing time information
   * @returns A TemplateResult containing a div with the delay value, prefixed with '+' for delays or '-' for earlier arrivals
   */
  protected renderDelay(departure: DeparturesDataRow): TemplateResult {
    let htmlText: string = "";
    const time = departure.time;

    if (time.delay != undefined) {
      if (time.isDelayed) {
        htmlText = `+${time.delay}`;
      } else if (time.isEarlier) {
        htmlText = `-${time.delay}`;
      }
    }

    return html`<div class="cell-delay">${htmlText}</div>`;
  }

  protected getDepartureLineStyles(departure: DeparturesDataRow | null) {
    return {
      "grid-template-columns": this.layout?.getColumns(),
    };
  }

  /**
   * Gets the CSS classes to apply to a departure line based on its status.
   * @param departure - The departure data row to get classes for
   * @returns An object containing boolean flags for CSS classes:
   *   - arriving: true if the departure is arriving
   *   - delayed: true if the departure is delayed
   */
  protected getDepartureLineClasses(departure: DeparturesDataRow) {
    let classes = {
      arriving: departure.time.isArriving,
      delayed: departure.time.isDelayed,
    };

    return classes;
  }

  /**
   * Renders error messages for unsupported entities.
   * @returns {TemplateResult} A template containing error messages for each unsupported entity,
   * displaying an alert icon and a message indicating the entity is not supported.
   */
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
}
