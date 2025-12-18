import { css, html, LitElement, nothing } from "lit";
import { state, property, customElement } from "lit/decorators.js";
import { Config } from "../types";
import { HomeAssistant, fireEvent, LovelaceCardEditor } from "custom-card-helpers";
import "./departures-entity-editor";
import { localize } from "../locales/localize";

import { mdiPlus } from "@mdi/js";
import { cardStyles } from "../styles";
import { EntityTab } from "./entity-tab";
import { DEFAULT_LAYOUT } from "../constants";

@customElement("departures-card-editor")
export class DeparturesCardEditor extends LitElement implements LovelaceCardEditor {
  static styles = [
    cardStyles,
    css`
      .entity-editor-content {
        border: 1px solid var(--divider-color);
        padding: 10px;
      }
      .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      ha-expansion-panel {
        margin-top: 20px;
      }
      ha-tab-group {
        flex: 1;
        margin-right: 5px;
        max-width: 400px;
      }
    `,
  ];
  @property({ attribute: false })
  public hass!: HomeAssistant;

  @state()
  private _config!: Config;

  @state()
  private _tabs: EntityTab[] = [];

  @state()
  private _currTab: string = "1";

  public setConfig(config: Config) {
    console.debug("Set config in card editor", config);

    this._config = config;
    this._tabs = config.entities?.map((config, index) => new EntityTab(Number(index + 1), config)) || [];
  }

  private SCHEMA = [
    {
      name: "",
      type: "grid",
      column_min_width: "100px",
      schema: [
        {
          name: "title",
          required: false,
          selector: { text: {} },
        },
        { name: "icon", selector: { icon: {} } },
      ],
    },

    {
      name: "",
      type: "grid",
      column_min_width: "100px",
      schema: [
        {
          name: "showScrollButtons",
          type: "boolean",
        },
        {
          name: "showCardHeader",
          type: "boolean",
          default: true,
        },
      ],
    },
    {
      name: "theme",
      type: "select",
      required: true,
      options: [
        ["basic", "Basic"],
        ["black-white", "Black-White"],
        ["cappucino", "Cappucino"],
        ["blue-ocean", "Blue Ocean"],
      ],
      default: "basic",
    },
    {
      name: "departuresToShow",
      selector: {
        number: {
          min: 1,
          max: 20,
          step: 1,
          mode: "slider",
        },
      },
    },
    {
      name: "scrollBackTimeout",
      selector: {
        number: {
          min: 0,
          max: 20,
          step: 1,
          mode: "slider",
        },
      },
    },
    {
      name: "layout",
      type: "string",
      required: false,
      default: Array.from(DEFAULT_LAYOUT.keys()).join(" "),
    },
  ] as const;

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    if (this._tabs.length === 0) {
      this.addEntity();
    }

    return html`
      <ha-form .schema="${this.SCHEMA}" .data="${this._config}" .hass="${this.hass}" .computeLabel=${this.computeLabelCallback} @value-changed=${this.configChanged}> </ha-form>

      <ha-expansion-panel .leftChevron=${true}>
        <span slot="header">Entities</span>
        <div class="card-config">
          <div class="toolbar">
            <ha-tab-group @wa-tab-show=${this.handleTabChanged}>
              ${this._tabs.map(
                (tab) => html` <ha-tab-group-tab slot="nav" .panel=${tab.index} .active=${this._currTab === tab.index.toString()}> ${tab.index} </ha-tab-group-tab> `,
              )}
            </ha-tab-group>
            <ha-icon-button .path=${mdiPlus} .label=${localize("card.editor.addEntity", this.hass.locale?.language)} @click=${this.addEntity}></ha-icon-button>
          </div>
          <departures-entity-editor .hass=${this.hass} .data=${this.getTabData()} @onDelete=${this.removeEntity} @onChange=${this.updateEntity}></departures-entity-editor>
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
  private getTabData(): EntityTab {
    const index = parseInt(this._currTab) - 1;

    if (index >= 0 && index < this._tabs.length) {
      return this._tabs[index];
    }

    throw Error("No");
  }

  private computeLabelCallback = (schema: any) => localize(`card.editor.${schema.name}`, this.hass.locale?.language);

  private addEntity() {
    if (!this._config) {
      return;
    }

    let newTab = new EntityTab(this._tabs.length + 1, undefined);

    this._tabs = [...this._tabs, newTab];
    this._currTab = `${this._tabs.length}`;

    this.updateConfig();
  }

  private removeEntity(ev: Event) {
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

  private updateConfig() {
    const config = { ...this._config };

    config.entities = this._tabs.map((tab) => tab.config);
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

    fireEvent(this, "config-changed", { config: this._config });
  }
}
