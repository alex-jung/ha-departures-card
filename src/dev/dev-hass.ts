import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { getHassStub } from "./stubs";
import { HomeAssistant } from "custom-card-helpers";

@customElement("dev-hass")
export class DevHass extends LitElement {
  @state()
  config: HomeAssistant = getHassStub();

  render() {
    return html`
      <form style="padding: 10px 0px;">
        <sl-input .value=${this.config.selectedLanguage}></sl-input>
      </form>
    `;
  }

  private _updateData() {
    this.dispatchEvent(new CustomEvent("hass-config-changed", { detail: { data: this.config }, bubbles: true, composed: true }));
  }
}
