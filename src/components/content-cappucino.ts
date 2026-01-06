import { customElement } from "lit/decorators.js";
import { contentCappucino } from "../styles";
import { DeparturesDataRow } from "../types";
import { ScrollableContent } from "./scrollable-content";

@customElement("card-content-cappucino")
export class ContentCappucino extends ScrollableContent {
  static styles = [ScrollableContent.styles, contentCappucino];

  protected getDepartureLineStyles(departure: DeparturesDataRow) {
    const borderLeftColor = departure?.lineColor ?? "";

    return {
      ...super.getDepartureLineStyles(departure),
      "border-left": `8px solid ${borderLeftColor}`,
    };
  }
}
