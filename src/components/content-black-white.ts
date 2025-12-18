import { customElement } from "lit/decorators.js";
import { Content } from "./content";
import { contentBlackWhite } from "../styles";
import { html, TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { DeparturesDataRow } from "../types";

@customElement("card-content-black-white")
export abstract class ContentBlackWhite extends Content {
  static styles = [Content.styles, contentBlackWhite];

  protected renderCellLineName(departure: DeparturesDataRow): TemplateResult {
    const styles = {
      color: departure.lineColor,
    };

    return html`<div class="cell-line" style="${styleMap(styles)}">${departure.lineName}</div>`;
  }
}
