import { customElement } from "lit/decorators.js";
import { Content } from "./content";
import { contentCappucino } from "../styles";
import { html, TemplateResult } from "lit";
import { DeparturesDataRow } from "../types";

@customElement("card-content-cappucino")
export class ContentCappucino extends Content {
  static styles = [Content.styles, contentCappucino];

  protected getDepartureLineStyles(departure: DeparturesDataRow) {
    const borderLeftColor = departure.lineColor ?? "grey";

    return {
      ...super.getDepartureLineStyles(departure),
      "border-left": `5px solid ${borderLeftColor}`,
    };
  }

  protected renderDelay(departure: DeparturesDataRow): TemplateResult {
    let delayColor = "var(--departures-delay-none)";
    const time = departure.time;

    if (time.isDelayed) {
      delayColor = "var(--departures-delay-bad)";
    } else if (time.isEarlier) {
      delayColor = "var(--departures-delay-ok)";
    } else {
      delayColor = "grey";
    }

    return html` <div class="cell-delay">
      <div style="border: 1px solid ${delayColor}; border-radius:50%;height:10px;width:10px;"></div>
    </div>`;
  }
}
