import { css, html, LitElement, nothing } from "lit";
import { state, property, customElement } from 'lit/decorators.js';
import { Config } from "../types";
import { HomeAssistant, fireEvent, LovelaceCardEditor  } from "custom-card-helpers";
import "./departures-entity-editor";
import { localize } from "../localize";

import {
  mdiPlus
} from "@mdi/js";
import { cardStyles } from "../styles";
import { EntityTab } from "../data-classes";


@customElement('departures-card-editor')
export class DeparturesCardEditor extends LitElement implements LovelaceCardEditor {
  static styles = [
      cardStyles,
      css`
      .entity-editor-content{
          border: 1px solid var(--divider-color);
          padding: 10px;
      }
      .toolbar {
        display: flex; 
        justify-content: space-between; 
        align-items: flex-start;
      }
      sl-tab-group {
        flex: 1; 
        margin-right: 5px; 
        max-width:400px; 
        --ha-tab-track-color:var(--card-background-color)  
      }
      ha-expansion-panel {
        margin-top: 20px;
      }
      .card-options{
          display: flex;
          justify-content: flex-end;
          width: 100%;
      }
  `];
  @property({ attribute: false }) 
  public hass!: HomeAssistant;

  @state() 
  private _config!: Config;

  @state()
  private _tabs:EntityTab[] = [];

  @state() 
  private _currTab: string = "1";
  
  public setConfig(config: Config) 
  {
    this._config = config;
    this._tabs = config.entities?.map((config, index) => new EntityTab(Number(index + 1), config)) || [];
  }

  private SCHEMA = [
        {
          name: "",
          type: "grid",
          schema: [
            {
              name: "cardTitle",
              required: false,
              selector: { text: {} },
            },
            { name: "cardIcon", selector: { icon: {} } },
          ]
        },
        {
          name: "",
          type: "grid",
          column_min_width: "100px",
          schema: [
            {
              name: "showAnimation", type: "boolean",
            },
            {
              name: "showTransportIcon", type: "boolean",
            },
            {
              name: "debug", type: "boolean",
            }
          ],
        },
        {
          name: "departuresToShow",
          type: "integer",
          required: true,
          default: 3,
          valueMin: 1,
          valueMax: 5,
        },
  ] as const;

  protected render() { 
    if (!this.hass || !this._config) {
      return nothing;
    }

    if(this._tabs.length === 0) {
      this.addEntity();
    }

    return html`
        <ha-form
          .schema="${this.SCHEMA}"
          .data="${this._config}"
          .hass="${this.hass}"
          .computeLabel=${this.computeLabelCallback}
          @value-changed=${this.configChanged}
        >
        </ha-form>

        <ha-expansion-panel .leftChevron=${true}>
          <span slot="header">Entities</span>
          <div class="card-config">
            <div class="toolbar">
              <sl-tab-group @sl-tab-show=${this.handleTabChanged}>
              ${this._tabs.map(
                (tab) => html`
                  <sl-tab slot="nav" .panel=${tab.index} .active=${this._currTab === tab.index.toString()}>
                    ${tab.index}
                  </sl-tab>
                `
              )}
              </sl-tab-group>
              <ha-icon-button
                .path=${mdiPlus}
                .label=${localize("card.editor.addEntity", this.hass.locale?.language)}
                @click=${this.addEntity}
              ></ha-icon-button>
            </div>
              <departures-entity-editor 
                .hass=${this.hass}
                .data=${this.getTabData()}
                @onDelete=${this.removeEntity}
                @onChange=${this.updateEntity}
                />
          </div>
        </ha-expansion-panel>
    `;
  }

  /**
   * Retrieves the data for the currently selected tab.
   *
   * Converts the current tab identifier (`_currTab`) to a zero-based index,
   * then returns the corresponding tab data from the `_tabs` array if the index is valid.
   *
   * @returns The `EntityTab` data for the selected tab, or `undefined` if the index is out of bounds.
   */
  private getTabData(): EntityTab | undefined {
    const index = parseInt(this._currTab) - 1;

    if(index >= 0 && index < this._tabs.length) {
      return this._tabs[index];
    }

    return undefined;
  }

  private computeLabelCallback = (schema: any) => 
    localize(`card.editor.${schema.name}`, this.hass.locale?.language)


  private addEntity() {
    if (!this._config) {
      return;
    }

    let newTab = new EntityTab(this._tabs.length + 1, undefined);

    this._tabs = [...this._tabs, newTab];
    this._currTab = `${this._tabs.length}`;

    this.updateConfig();
  }

  private removeEntity(ev:Event) {
    if (!this._config) {
      return;
    }

    const index = parseInt(this._currTab) - 1;

    this._tabs.splice(index, 1);
    this.updateConfig();

    this._currTab = Math.max(1, index).toString();
  }

  private updateEntity(event: CustomEvent) {
    event.stopPropagation();

    let tab = this.getTabData();

    if (!tab) {
      console.warn("No tab found for config change", this._tabs, this._currTab);
      return;
    }

    tab.config = event.detail;

    this.updateConfig();

    fireEvent(this, "config-changed", { config: this._config });
  }

  private updateConfig(){
    const config = {...this._config};
    
    config.entities = this._tabs.map(tab => tab.config);
    this._config = config;

    fireEvent(this, "config-changed", { config: this._config });
  }

  private handleTabChanged(event: CustomEvent) {
    const newTab = event.detail.name.toString();

    if (newTab === this._currTab) {
      return;
    }

    this._currTab = newTab;
  }

  private configChanged(event: CustomEvent) {
    event.stopPropagation();

    if (!this._config || !this.hass) {
      return;
    }

    this._config = event.detail.value;

    fireEvent(this, 'config-changed', { config: this._config});
  }
}