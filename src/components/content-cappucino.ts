import { customElement } from "lit/decorators.js";
import { Content } from "./content";
import { contentCappucino } from "../styles";
import { html, TemplateResult } from "lit";
import { DepartureTime } from "../data/departure-time";
import { DeparturesDataRow } from "../types";

@customElement("card-content-cappucino")
export abstract class ContentCappucino extends Content {
  static styles = [Content.styles, contentCappucino];

  protected renderTransportIcon(transportIcon: string | null): TemplateResult {
    return html``;
  }

  protected getDepartureLineStyles(departure: DeparturesDataRow) {
    return {
      "border-left": `5px solid ${departure.lineColor}`,
    };
  }

  protected renderDelay(time: DepartureTime): TemplateResult {
    let delayColor = "var(--departures-delay-none)";

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
