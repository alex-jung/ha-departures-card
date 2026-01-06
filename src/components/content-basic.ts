import { customElement } from "lit/decorators.js";
import { contentBasic } from "../styles";
import { html, TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { getContrastTextColor } from "../helpers";
import { DeparturesDataRow } from "../types";
import { ScrollableContent } from "./scrollable-content";

@customElement("card-content-basic")
export class ContentBasic extends ScrollableContent {
  static styles = [ScrollableContent.styles, contentBasic];

  protected renderCellLineName(departure: DeparturesDataRow): TemplateResult {
    const contrastTextColor = getContrastTextColor(departure.lineColor ?? "#ffffff");

    const styles = {
      backgroundColor: departure.lineColor,
      color: departure.lineColor ? contrastTextColor : "",
    };

    return html`<div class="cell-line" style="${styleMap(styles)}">${departure.lineName}</div>`;
  }
}
