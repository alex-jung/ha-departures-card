import { customElement } from "lit/decorators.js";
import { Content } from "./content";
import { contenBlueSky } from "../styles";
import { html, TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { getContrastTextColor } from "../helpers";
import { DeparturesDataRow } from "../types";
import { DepartureTime } from "../data/departure-time";
import { lightFormat } from "date-fns";
import { classMap } from "lit/directives/class-map.js";

@customElement("card-content-blue-sky")
export abstract class ContentBlueSky extends Content {
  static styles = [Content.styles, contenBlueSky];

  protected renderDepartureLine(departure: DeparturesDataRow): TemplateResult {
    let classes = this.getDepartureLineClasses(departure);

    return html`
      <div class="departure-line ${classMap(classes)}">
        ${this.renderCellLineName(departure.lineName, departure.lineColor)} ${this.renderCellDestination(departure.destinationName)} ${this.renderCellTime(departure.time)}
        ${this.renderCellTimeEstimated(departure.time)}
      </div>
    `;
  }

  protected renderCellLineName(name: string | null, lineColor: string | null = null): TemplateResult {
    const contrastTextColor = getContrastTextColor(lineColor ?? "#ffffff");

    const styles = {
      backgroundColor: lineColor,
      color: lineColor ? contrastTextColor : "",
      width: "40px",
    };

    return html`<div class="cell-line"><div style="${styleMap(styles)}">${name}</div></div>`;
  }

  protected renderCellTime(time: DepartureTime): TemplateResult {
    return html`<div class="cell-time">${lightFormat(time.planned, "HH:mm")}</div>`;
  }

  protected renderCellTimeEstimated(time: DepartureTime): TemplateResult {
    let cellClasses = {
      delayed: false,
      earlier: false,
    };

    let estTime = time.estimated;

    if (!time.estimated) {
      estTime = time.planned;
    }

    if (time.isDelayed) {
      cellClasses.delayed = true;
    }
    if (time.isEarlier) {
      cellClasses.earlier = true;
    }

    return html`
      <div class="cell-estimated-time ${classMap(cellClasses)}">
        <div>${lightFormat(estTime as Date, "HH:mm")}</div>
      </div>
    `;
  }
}
