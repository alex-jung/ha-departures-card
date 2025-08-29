import { html, LitElement, TemplateResult } from 'lit';
import { state, property, customElement } from 'lit/decorators.js';
import { Config } from './types.js';
import { HomeAssistant } from 'custom-card-helpers';
import { cardStyles } from './styles.js';
import './departures-table.js'
import './departures-row.js'
import './editor/departures-card-editor.js';
import { localize } from './localize.js';

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'departures-card',
  name: 'Departures Card',
  description: 'Display departure times for different public transports',
});

const version = "2.0.0"
const repoUrl = "https://github.com/alex-jung/ha-departures-card"

console.groupCollapsed(`%cDepartures-Card ${version}`, "color:black; font-weight: bold; background: tomato; padding: 2px; border-radius: 5px;")
console.log(`Github repository: ${repoUrl}`)
console.groupEnd()

@customElement('departures-card')
export class DeparturesCard extends LitElement 
{
  static styles = cardStyles;

  @property({ attribute: false }) 
  public hass!: HomeAssistant;

  @state() 
  private config!: Config;

  /**
   * Indicates whether the "more info" popup is currently open.
   * This state is used to toggle the visibility of additional information popup.
   * 
   * @private
   */
  @state()
  private moreInfoOpen: boolean = false;
  
  public static getStubConfig(hass: HomeAssistant): Record<string, unknown> {
    return {
      "type": "custom:departures-card",
      "title": localize("card.departures", hass.locale?.language) || "Departures",
      "entity": []
    };
  }

  static getConfigElement() {
    return document.createElement("departures-card-editor");
  }

  /**
   * Calculates and returns the size of the card.
   * 
   * The size is determined based on the configuration of the card. If no configuration
   * is provided, the default size is 1. If the configuration includes entities, the size
   * is calculated as the number of entities plus 1.
   * 
   * @returns {Promise<number>} A promise that resolves to the size of the card.
   */
  public async getCardSize(): Promise<number> {
    if (!this.config) 
      return 1;

    return this.config.entities ? this.config.entities.length + 1 : 1;
  }

  /**
   * Sets the configuration for the departures card.
   * 
   * @param config - The configuration object to set.
   * @throws {Error} If the provided configuration is invalid.
   * @throws {Error} If no entities are defined in the configuration or the entities array is empty.
   */
  public setConfig(config: Config) {
    if(!config){
      throw new Error("Invalid configuration");
    }

    this.config = config

    if (!this.config.entities || this.config.entities.length <= 0) {
      throw new Error("Please define at least one entity in the configuration.");
    }
  }

  protected render(): TemplateResult { 
    const title = this.config.title || localize("card.departures", this.hass.locale?.language)
    const icon = this.config.icon || "mdi:bus"

    return html`
      <ha-card>
        <div class="card-content">
          <div class="card-header">
            ${title}
            <ha-icon icon="${icon}"></ha-icon>
          </div> 
          <departures-table 
            @click="${() => this.moreInfoOpen = true}" 
            .config=${this.config}
            .hass=${this.hass}>
          </departures-table>
        </div>
      </ha-card>
      <ha-dialog hideactions ?open="${this.moreInfoOpen}" @closed="${() => this.moreInfoOpen = false}">
        <div class="card-header">
          <ha-icon-button @click="${() => this.moreInfoOpen = false}" aria-label="Close" title="Close">
            <ha-icon icon="mdi:close" style="display: flex;"></ha-icon>
          </ha-icon-button>
          ${title}
          <ha-icon icon="${icon}"></ha-icon>
        </div>
        <div class="content">
          <departures-table
            .config=${this.config}
            .moreInfo=${true}
            .hass=${this.hass}>
          </departures-table>
        </div>
      </ha-dialog>
    `;
  }
}