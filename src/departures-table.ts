import { css, html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { cardStyles } from './styles.js';
import { HomeAssistant } from 'custom-card-helpers';
import { HassEntity } from 'home-assistant-js-websocket'
import { Config } from './types.js';
import { text } from './texts.js';

@customElement('departures-table')
export class DeparturesTable extends LitElement {
    static styles = [
        cardStyles,
        css`
        :host {
            display: flex;
            flex-direction: column;
        }
        table-header {
            display: flex;
            padding-top: 20px;
            justify-content: space-between;
            font-weight: bold;
        }

        @media (max-width: 500px) {
            table-header {
                display: none;
            }
        }
    `];

    @property({attribute: false}) 
    public hass!: HomeAssistant;

    @property({attribute: false})
    private config!: Config;

    @property({attribute: false})
    private moreInfo: boolean = false;

    /**
     * Retrieves the state of a specified Home Assistant entity.
     *
     * @param entityName - The ID of the Home Assistant entity.
     * @returns The state of the specified entity as a `HassEntity` object if available,
     *          or an empty object if the `hass` property is not defined.
     */
    private getState(entityName:string): HassEntity | {} {
        if(this.hass)
            return this.hass.states[entityName]

        return {}
    }

    protected render(): TemplateResult {
        const language = this.hass.locale?.language
        const showAnimation = this.config.showAnimation === undefined ? true : this.config.showAnimation
        const showTransportIcon = this.config.showTransportIcon === undefined ? false : this.config.showTransportIcon
        let departuresToShow = this.config.departuresToShow === undefined ? 1 : this.config.departuresToShow

        if(this.moreInfo) { 
            departuresToShow = 5
        }

        return html`
            <table-header>
                ${this.config.showTransportIcon ? html`<div class="cell-icon">Icon</div>`: nothing}    
                <div class="cell-line">${text("line", language)}</div>
                <div class="cell-destination">${text("destination", language)}</div>
                <div>${text("departures", language)}</div>
            </table-header>
            <hr style="width:100%"/>
            ${this.config.entities ? this.config.entities.map((entityConfig) => {
              return html`
                <departures-row 
                    .config=${entityConfig}
                    .hass=${this.hass} 
                    .showIcon=${showTransportIcon}
                    .debug=${this.config.debug === true}
                    .state=${this.getState(entityConfig.entity)}
                    .timesToShow=${departuresToShow}
                    .showAnimation=${showAnimation}/>
                `
            }) : nothing}
        `;
    }
}
