import { customElement } from "lit/decorators.js";
import { Content } from "./content";
import { contenBlueOcean } from "../styles";
import { html, TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { getContrastTextColor } from "../helpers";
import { DeparturesDataRow } from "../types";
import { DepartureTime } from "../data/departure-time";
import { lightFormat } from "date-fns";
import { classMap } from "lit/directives/class-map.js";

@customElement("card-content-blue-ocean")
export abstract class ContentBlueOcean extends Content {
  static styles = [Content.styles, contenBlueOcean];

  protected renderCellLineName(departure: DeparturesDataRow): TemplateResult {
    const contrastTextColor = getContrastTextColor(departure.lineColor ?? "#ffffff");

    const styles = {
      backgroundColor: departure.lineColor,
      color: departure.lineColor ? contrastTextColor : "",
      padding: "0px 5px",
    };

    return html`<div class="cell-line">
      <div style="${styleMap(styles)}">${departure.lineName}</div>
    </div>`;
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
