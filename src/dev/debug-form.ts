// set the base path for Shoelace assets
import { customElement, query, state } from "lit/decorators.js";
import { Config, EntityConfig } from "../types";
import { html, css, LitElement, PropertyValues } from "lit";
import { DeparturesCard } from "../components/ha-departures-card";
import { HomeAssistant } from "custom-card-helpers";
import { cardStyles } from "./debug-styles";
import "../components/ha-departures-card";
import "./entity-data";
import "./dev-config";
import "./dev-entities";
import "./dev-hass";
import { getConfigStub, getHassStub } from "./stubs";
import { HassEntities } from "home-assistant-js-websocket";

@customElement("debug-form")
export class DebugForm extends LitElement {
  static styles = [
    cardStyles,
    css`
      :host {
        margin: 40px;
        display: flex;
        flex-wrap: nowrap;
        align-items: baseline;
      }
      .simulation-data {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .preview {
        margin-left: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    `,
  ];

  @query("departures-card")
  card!: DeparturesCard;

  @state()
  mockHass: HomeAssistant = getHassStub();

  @state() config: Config = getConfigStub();

  @state() entities: Array<any> = [
    {
      entityId: "sensor-1",
      attributes: {
        friendly_name: "Train Departure 1",
        departure_time: "2024-06-01T12:30:00",
        destination: "Central Station",
        transport_type: "train",
      },
      state: "on time",
    },
    {
      entityId: "sensor-2",
      attributes: {
        friendly_name: "Train Departure 1",
        departure_time: "2024-06-01T12:30:00",
        destination: "Central Station",
        transport_type: "train",
      },
      state: "on time",
    },
  ];

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);

    this._updateData();
  }

  render() {
    return html`
      <div class="cfg-container">
        <h1>Configuration</h1>

        <sl-tab-group placement="start">
          <sl-tab slot="nav" panel="cfg-hass">Config HASS</sl-tab>
          <sl-tab slot="nav" panel="cfg-card">Config Card</sl-tab>
          <sl-tab slot="nav" panel="cfg-entities">Entities</sl-tab>

          <sl-tab-panel name="cfg-hass">
            <dev-hass @hass-config-changed=${this._updateData}></dev-hass>
          </sl-tab-panel>
          <sl-tab-panel name="cfg-card">
            <dev-config @card-config-changed=${this._updateData}></dev-config>
          </sl-tab-panel>
          <sl-tab-panel name="cfg-entities">
            <dev-entities @entity-data-changed=${this._updateData}> </dev-entities>
          </sl-tab-panel>
        </sl-tab-group>
      </div>

      <div class="preview-container">
        <h1>Preview</h1>
        <div class="card-container">
          <departures-card></departures-card>
        </div>
      </div>
    `;
  }

  private _updateData(e?: CustomEvent) {
    console.debug("Updating data...");

    switch (e?.type) {
      // udpate card configuration
      case "card-config-changed":
        this.config = e!.detail.data as Config;
        console.debug("New card config:", this.config);
        break;
      // update hass configuration
      case "hass-config-changed":
        let hass = e!.detail.data as HomeAssistant;
        console.debug("New hass config:", hass);
        break;
      // update entity data
      case "entity-data-changed":
        let eConfigs = e!.detail.configs as Array<EntityConfig>;
        let eStates = e!.detail.states as HassEntities;

        console.debug("New entity configs:", eConfigs);
        console.debug("New entity states:", eStates);

        this.config.entities = eConfigs;
        this.mockHass.states = eStates;

        break;
      default:
        break;
    }

    if (!this.card) return;

    this.card.hass = this.mockHass;
    this.card.setConfig(this.config);

    this.card.requestUpdate();
  }
}
