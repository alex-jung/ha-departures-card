import { css, html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { cardStyles } from './styles.js';
import { HomeAssistant } from 'custom-card-helpers';
import { HassEntity } from 'home-assistant-js-websocket'
import { Config } from './types.js';

@customElement('departures-table')
export class DeparturesTable extends LitElement {
    static styles = [
        cardStyles,
        css`
        :host {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
        }
        .table-header {
            display: flex;
            padding-top: 20px;
            flex-wrap: nowrap;
            justify-content: space-between;
        }
    `];

    @property({attribute: false}) 
    public hass!: HomeAssistant;

    @property({attribute: false})
    private config!: Config;

    private getState(entityName:string): HassEntity | {} {
        if(this.hass)
            return this.hass.states[entityName]

        return {}
    }

    protected render(): TemplateResult {
        return html`
        <div>
            <div class="table-header">
                <div class="cell-line">Linie</div>
                <div class="cell-destination">Ziel</div>
                <div>Abfahrt</div>
            </div>
            <hr/>
            ${this.config.entities ? this.config.entities.map((entityConfig) => {
              return html`
                <departures-row 
                    .config=${entityConfig}
                    .hass=${this.hass} 
                    .destination=${entityConfig.destination_name}
                    .lineName=${entityConfig.line_name}
                    .lineColor=${entityConfig.line_color}
                    .animation=${this.config.animation}
                    .state=${this.getState(entityConfig.entity)}
                    .showIcon=${this.config.showTransportIcon}>
                </departures-row>`
            }) : nothing}
        </div>
        `;
    }
}
