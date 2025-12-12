import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { EntityConfig } from "../types";
import { getEntityConfigStub } from "./stubs";
import { HassEntities, HassEntity } from "home-assistant-js-websocket";

@customElement("dev-entities")
export class DevEntities extends LitElement {
  @state()
  configs = Array<EntityConfig>();

  @state()
  states: HassEntities = {};

  renderEntity(entity: EntityConfig) {
    return html`<form>
        <sl-details summary=${entity.entity}>
            <sl-input
              label="Entity"
              placeholder=${entity.entity}
              .value=${entity.entity}
              @sl-input=${(e: Event) => {
                entity.entity = (e.target as HTMLInputElement).value;
                this.requestUpdate();
              }}></sl-input
            >
            <br />
            <sl-input
              label="Line Name"
              placeholder=${entity.lineName ?? ""}
              .value=${entity.lineName ?? ""}
              @sl-input=${(e: Event) => {
                entity.lineName = (e.target as HTMLInputElement).value;
              }}></sl-input
            >
            <br />
            <sl-input
              label="Line Color"
              placeholder=${entity.lineColor ?? ""}
              .value=${entity.lineColor ?? ""}
              @sl-input=${(e: Event) => {
                entity.lineColor = (e.target as HTMLInputElement).value;
              }}></sl-input
            >
            <br />
            <sl-input
              label="Destination Name"
              placeholder=${entity.destinationName ?? ""}
              .value=${entity.destinationName ?? ""}
              @sl-input=${(e: Event) => {
                entity.destinationName = (e.target as HTMLInputElement).value;
              }}></sl-input
            >
            <br />
            <sl-input
              label="Now Icon"
              placeholder=${entity.icon ?? ""}
              .value=${entity.icon ?? ""}
              @sl-input=${(e: Event) => {
                entity.icon = (e.target as HTMLInputElement).value;
              }}></sl-input
            >
            <br />
            <sl-textarea label="Attributes(JSON)" .value=${this._getEntityData(entity.entity, "attributes")} @sl-input=${(e: Event) => {
      const value = (e.target as HTMLInputElement).value;

      this._setEntityData(entity.entity, "attributes", value);
    }}></sl-textarea>
            <br />
        </sl-details></br>
        </form>`;
  }

  render() {
    return html`
      <div style="padding: 10px 0px;">
        <div>${this.configs.map((entity) => html`${this.renderEntity(entity)}`)}</div>
        <div style="padding: 20px 0px;">
          <sl-button @click=${this._handleAddEntity}>Add</sl-button>
          <sl-button variant="primary" @click=${this._updateData}>Save</sl-button>
        </div>
      </div>
    `;
  }

  private _setEntityData(id: string, key: string, data: any) {
    let entity = this._getEntity(id);

    if (!entity) {
      return;
    }

    switch (key) {
      case "attributes":
        try {
          const attributes = JSON.parse(data);
          entity.attributes = attributes;
        } catch (e) {
          console.warn("Failed parsing attributes");
        }
        break;
      case "state":
        entity.state = data;
        break;
      case "last_changed":
        entity.last_changed = data;
        break;
      case "last_updated":
        entity.last_updated = data;
        break;
    }

    this.requestUpdate();
  }

  private _getEntityData(id: string, key: string) {
    let entity = this._getEntity(id);

    if (!entity) {
      return "";
    }

    switch (key) {
      case "attributes":
        return JSON.stringify(entity.attributes);
      case "state":
        return entity.state;
      case "last_changed":
        return entity.last_changed;
      case "last_updated":
        return entity.last_updated;
    }

    return "";
  }

  private _handleAddEntity(): HassEntity {
    let stub = getEntityConfigStub(this.configs.length + 1);
    let entity = {} as HassEntity;

    const now = new Date();

    entity.entity_id = stub.entity;
    entity.state = "good";
    entity.last_changed = "";
    entity.last_updated = "";
    entity.attributes = {
      line_name: "Bus 67",
      line_id: "van:09999: :R:j25",
      transport: "CITY_BUS",
      direction: "Mock bus",
      data_provider: "https://bahnland-bayern.de/efa/",
      times: [
        {
          planned: new Date(now.setMinutes(now.getMinutes() + this._getRandomNumber(1, 30))),
          estimated: new Date(now.setMinutes(now.getMinutes() + this._getRandomNumber(1, 30))),
        },
        {
          planned: new Date(now.setMinutes(now.getMinutes() + this._getRandomNumber(1, 30))),
          estimated: new Date(now.setMinutes(now.getMinutes() + this._getRandomNumber(1, 30))),
        },
      ],
      icon: "mdi:bus",
    };
    entity.context = {
      id: "",
      user_id: "",
      parent_id: "",
    };

    this.configs = [...this.configs, stub];
    this.states[entity.entity_id] = entity;

    return entity;
  }

  private _getEntity(id: string) {
    return this.states[id];
  }

  private _getRandomNumber(min: number, max: number): number {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  }

  private _updateData() {
    this.dispatchEvent(new CustomEvent("entity-data-changed", { detail: { configs: this.configs, states: this.states }, bubbles: true, composed: true }));
  }
}
