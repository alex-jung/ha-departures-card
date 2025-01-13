import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { cardStyles } from './styles.js';
import { HomeAssistant } from 'custom-card-helpers';
import { Config } from './types.js';
import { styleMap } from 'lit/directives/style-map.js';

@customElement('departures-table')
export class DeparturesTable extends LitElement {
    static styles = cardStyles;

    @property({attribute: false}) 
    public hass!: HomeAssistant;

    @property({attribute: false})
    private config!: Config;

    render() 
    {
        const styles = {
            width: this.config.showTransportIcon ? '100px' : '70px',
        };

        return html`
        <div>
            <div class="table-header">
                <div class="cell-line" style=${styleMap(styles)}>Linie</div>
                <div class="cell-destination">Ziel</div>
                <div>Abfahrt</div>
            </div>
            <hr/>
            ${this.config.entities ? this.config.entities.map((entity) => {
              return html`
                <departures-row 
                    .config=${entity} 
                    .hass=${this.hass} 
                    .showDelay=${this.config.showDelay} 
                    .showIcon=${this.config.showTransportIcon}
                    .showTimestamp=${this.config.showTimestamp}>
                </departures-row>`
            }) : nothing}
        </div>
        `;
    }
}
