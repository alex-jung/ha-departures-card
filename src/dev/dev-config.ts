import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { CardStyles, Config } from "../types";
import { getConfigStub } from "./stubs";

@customElement("dev-config")
export class DevConfig extends LitElement {
  @state()
  config: Config = getConfigStub();

  render() {
    return html`
      <form style="padding: 10px 0px;">
        <sl-input label="Type" placeholder=${this.config.type} disabled></sl-input>
        <br />
        <sl-input
          label="Title"
          placeholder=${this.config.title}
          .value=${this.config.title}
          @sl-input=${(e: Event) => {
            this.config.title = (e.target as HTMLInputElement).value;
          }}></sl-input>
        <br />
        <sl-input
          label="Icon"
          placeholder=${this.config.icon}
          .value=${this.config.icon}
          @sl-input=${(e: Event) => {
            this.config.icon = (e.target as HTMLInputElement).value;
          }}></sl-input>
        <br />
        <sl-select
          label="Theme"
          placeholder="Basic"
          @sl-input=${(e: Event) => {
            this.config.cardStyle = (e.target as HTMLInputElement).value as CardStyles;
          }}>
          <sl-option value="basic">Basic</sl-option>
          <sl-option value="black-white">Black White</sl-option>
          <sl-option value="cappucino">Cappucino</sl-option>
        </sl-select>
        <br />
        <sl-range
          label="Departures to show"
          min="1"
          max="50"
          .value=${this.config.departuresToShow}
          @sl-input=${(e: Event) => {
            this.config.departuresToShow = parseInt((e.target as HTMLInputElement).value, 10);
          }}></sl-range>
        <br />
        <sl-range
          label="Scroll back timeout"
          min="0"
          max="20"
          .value=${this.config.scrollBackTimeout}
          @sl-input=${(e: Event) => {
            this.config.scrollBackTimeout = parseInt((e.target as HTMLInputElement).value, 10);
          }}></sl-range>
        <br />
        <sl-checkbox
          ?checked=${this.config.showCardHeader}
          @sl-input=${(e: Event) => {
            this.config.showCardHeader = (e.target as HTMLInputElement).checked;
          }}
          >Show Card Header</sl-checkbox
        >
        <br />
        <sl-checkbox
          ?checked=${this.config.showScrollButtons}
          @sl-input=${(e: Event) => {
            this.config.showScrollButtons = (e.target as HTMLInputElement).checked;
          }}
          >Show scroll buttons</sl-checkbox
        >
        <br />
        <div style="padding: 20px 0px;">
          <sl-button variant="primary" @click=${this._updateData}>Save</sl-button>
        </div>
      </form>
    `;
  }

  private _updateData() {
    const newConfig = {
      ...this.config,
    } as Config;
    this.dispatchEvent(new CustomEvent("card-config-changed", { detail: { data: newConfig }, bubbles: true, composed: true }));
  }
}
