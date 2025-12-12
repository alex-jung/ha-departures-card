import { setBasePath } from "@shoelace-style/shoelace";
setBasePath("/node_modules/@shoelace-style/shoelace/dist");

import { EntityConfig } from "../types";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("entity-data")
export class EntityData extends LitElement {
  @property({ type: Object }) data?: any;
  @property({ type: Object }) config?: EntityConfig;

  @property({ type: String })
  state: string = "";

  render() {
    return html`
      <form>
        <sl-input label="Entity ID" placeholder="sensor.example_entity" .value=${this.data?.entityId}></sl-input>
        <br />
        <sl-input label="State" placeholder="on/off or any value" .value=${this.state}></sl-input>
        <br />
        <sl-textarea label="Attributes (JSON)" .value=${JSON.stringify(this.data?.attributes, null, 2)}></sl-textarea>
        <br />
        <sl-input label="Line color" placeholder="" .value=${this.config?.lineColor || ""}></sl-input>
        <br />
        <sl-input label="Line name" placeholder="" .value=${this.config?.lineName || ""}></sl-input>
        <br />
        <sl-input label="Destination name" placeholder="" .value=${this.config?.destinationName || ""}></sl-input>
        <br />
        <sl-input label="Now icon" placeholder="mdi:bus" .value=${this.config?.icon || ""}></sl-input>
      </form>
    `;
  }
}
