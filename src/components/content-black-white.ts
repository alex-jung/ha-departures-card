import { customElement } from "lit/decorators.js";
import { contentBlackWhite } from "../styles";
import { html, TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { DeparturesDataRow } from "../types";
import { ScrollableContent } from "./scrollable-content";

@customElement("card-content-black-white")
export class ContentBlackWhite extends ScrollableContent {
  static styles = [ScrollableContent.styles, contentBlackWhite];

  protected renderCellLineName(departure: DeparturesDataRow): TemplateResult {
    const styles = {
      color: departure.lineColor,
    };

    return html`<div class="cell-line" style="${styleMap(styles)}">${departure.lineName}</div>`;
  }
}
