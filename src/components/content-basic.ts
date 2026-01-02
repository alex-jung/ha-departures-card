import { customElement } from "lit/decorators.js";
import { Content } from "./content";
import { contentBasic } from "../styles";
import { html, TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { getContrastTextColor } from "../helpers";
import { DeparturesDataRow } from "../types";

@customElement("card-content-basic")
export class ContentBasic extends Content {
  static styles = [Content.styles, contentBasic];

  protected renderCellLineName(departure: DeparturesDataRow): TemplateResult {
    const contrastTextColor = getContrastTextColor(departure.lineColor ?? "#ffffff");

    const styles = {
      backgroundColor: departure.lineColor,
      color: departure.lineColor ? contrastTextColor : "",
    };

    return html`<div class="cell-line" style="${styleMap(styles)}">${departure.lineName}</div>`;
  }
}
