import { html, LitElement } from 'lit';
import { state, property, customElement } from 'lit/decorators.js';
import { Config } from './types.js';
import { HomeAssistant } from 'custom-card-helpers';
import { cardStyles } from './styles.js';
import './departures-table.js'
import './departures-row.js'
import { text } from './texts.js';

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

  @state()
  private _open: boolean = false;
  
  public static getStubConfig(): Record<string, unknown> {
    return {};
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

  private _handleClick(event: Event) {
    console.log("Clicked on departures-table", event);
    this._open = !this._open;
  }

  render() {
    const title = this.config.title || text("departures", this.hass.locale?.language)
    const icon = this.config.icon || "mdi:bus"

    return html`
      <ha-card>
        <div class="card-content">
          <div class="card-header">
            ${title}
            <ha-icon icon="${icon}"></ha-icon>
          </div> 
          <departures-table 
            @click="${this._handleClick}" 
            .config=${this.config}
            .hass=${this.hass}>
          </departures-table>
        </div>
      </ha-card>
      <ha-dialog ?open="${this._open}">
        <h2>Mein Dialog</h2>
        <p>Dies ist ein Beispiel für einen Dialog mit LitElement.</p>
        <button @click="${this._handleClick}">Schließen</button>
      </ha-dialog>
    `;
  }
}