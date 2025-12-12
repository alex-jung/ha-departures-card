import { customElement } from "lit/decorators.js";
import { Content } from "./content";
import { contentBlackWhite } from "../styles";
import { html, TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";

@customElement("card-content-black-white")
export abstract class ContentBlackWhite extends Content {
  static styles = [Content.styles, contentBlackWhite];

  protected renderCellLineName(name: string | null, lineColor: string | null = null): TemplateResult {
    const styles = {
      color: lineColor,
    };

    return html`<div class="cell-line" style="${styleMap(styles)}">${name}</div>`;
  }
}
