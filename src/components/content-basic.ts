import { customElement } from "lit/decorators.js";
import { Content } from "./content";
import { contentBasic } from "../styles";
import { html, TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { getContrastTextColor } from "../helpers";
import { DeparturesDataRow } from "../types";

@customElement("card-content-basic")
export abstract class ContentBasic extends Content {
  static styles = [Content.styles, contentBasic];

  protected renderCellLineName(name: string | null, lineColor: string | null = null): TemplateResult {
    const contrastTextColor = getContrastTextColor(lineColor ?? "#ffffff");

    const styles = {
      backgroundColor: lineColor,
      color: lineColor ? contrastTextColor : "",
    };

    return html`<div class="cell-line" style="${styleMap(styles)}">${name}</div>`;
  }
}
