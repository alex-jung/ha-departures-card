import { customElement } from "lit/decorators.js";
import { Content } from "./content";
import { contentBasic } from "../styles";
import { html, TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { DeparturesDataRow } from "../types";

@customElement("card-content-eco-green")
export abstract class ContentEcoGreen extends Content {
  static styles = [Content.styles, contentBasic];
}
