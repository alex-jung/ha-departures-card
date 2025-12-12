import { customElement } from "lit/decorators.js";
import { Content } from "./content";
import { contentCappucino } from "../styles";
import { html, TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";

@customElement("card-content-cappucino")
export abstract class ContentCappucino extends Content {
  static styles = [Content.styles, contentCappucino];

  protected renderCellLineName(name: string | null, lineColor: string | null = null): TemplateResult {
    const styles = {
      backgroundColor: lineColor,
    };

    return html`<div class="cell-line" style="${styleMap(styles)}">${name}</div>`;
  }
}
