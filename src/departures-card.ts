import { html, LitElement } from 'lit';
import { state, property } from 'lit/decorators.js';
import { customElement } from 'lit/decorators.js';
import { Config } from './types.js';
import { HomeAssistant } from 'custom-card-helpers';
import { cardStyles } from './styles.js';
import './card-header.js'
import './departures-table.js'
import './departures-row.js'

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'departures-card',
  name: 'Departures Card',
  description: 'Display departure times for different public transports',
});

const version = "0.0.1"
const repoUrl = "https://github.com/alex-jung/ha-departures-card"

console.groupCollapsed(`%cDepartures-Card ${version}`, "color:black; font-weight: bold; background: tomato")
console.log(`Github repository: ${repoUrl}`)
console.groupEnd()

@customElement('departures-card')
export class DeparturesCard extends LitElement 
{
  static styles = cardStyles;

  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config!: Config;
  
  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  public async getCardSize(): Promise<number> {
    if (!this._config) 
      return 1;

    return this._config.entities ? this._config.entities.length + 1 : 1;
  }

  public setConfig(config: Config) {
    if(!config){
      throw new Error("Invalid configuration");
    }

    this._config = config
  }

  render() {
    return html`
      <ha-card>
        <div>
          <card-header .title=${this._config.title} .icon=${this._config.icon}></card-header>
          <departures-table .config=${this._config} .hass=${this.hass} />
        </div>
      </ha-card>
    `;
  }
}