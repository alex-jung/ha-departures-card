import { html, css, LitElement, nothing, TemplateResult } from 'lit';
import { property, customElement, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { EntityConfig } from './types.js';
import { HassEntity } from 'home-assistant-js-websocket'
import { cardStyles } from './styles.js';
import { EntityAttributes } from './types.js'
import './departure.ts'

@customElement('departures-row')
export class DeparturesRow extends LitElement {
    static styles = [
        cardStyles,
        css`
        :host {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
        }
    `];

    @property({attribute: false}) 
    public config!: EntityConfig

    @property({attribute: false}) 
    public state!: HassEntity

    @property({attribute: false})
    public destination: string = ""

    @property({attribute: false})
    public lineName: string = ""

    @property({attribute: false})
    public lineColor: string = ""

    @property({type: Boolean})
    public showIcon: boolean = false

    @state()
    private _times: Array<Array<string | null>> = []

    private updateTimes = () => {
        this._times = []

        this._times.push([this.state?.attributes[EntityAttributes.PLANNED_TIME], this.state?.attributes[EntityAttributes.ESTIMATED_TIME]])
        this._times.push([this.state?.attributes[EntityAttributes.PLANNED_TIME_1], this.state?.attributes[EntityAttributes.ESTIMATED_TIME_1]])
        this._times.push([this.state?.attributes[EntityAttributes.PLANNED_TIME_2], this.state?.attributes[EntityAttributes.ESTIMATED_TIME_2]])
        this._times.push([this.state?.attributes[EntityAttributes.PLANNED_TIME_3], this.state?.attributes[EntityAttributes.ESTIMATED_TIME_3]])
        this._times.push([this.state?.attributes[EntityAttributes.PLANNED_TIME_4], this.state?.attributes[EntityAttributes.ESTIMATED_TIME_4]])
        
        if(this.state)
        {
            console.log(this.destination, this._times)
        }
    }

    protected render(): TemplateResult {        
        this.updateTimes()

        return html`
            ${this.renderIcon()}
            ${this.renderLine()}
            ${this.renderDestination()}
            ${this.renderDepartureTime()}
        `;
    }

    private renderIcon() {
        if(!this.showIcon){
            return nothing
        }

        let icon = this.state.attributes[EntityAttributes.ICON] ?? "mdi:train-bus"

        return html`<ha-icon icon=${icon}></ha-icon>`
    }

    private renderLine(){
        const line = this.config?.line_name ?? this.state.attributes[EntityAttributes.LINE_NAME]

        const lineStyles = {
            background: this.config?.line_color || ""
        }

        return html`
            <div class="cell-line">
                <div class="line-number" style=${styleMap(lineStyles)}>${line}</div>
            </div>
        `
    }

    private renderDestination(){
        let destination = this.config?.destination_name ?? this.state.attributes[EntityAttributes.DIRECTION]

        return html`
            <div class="cell-destination">${destination}</div>
        `
    }

    private renderDepartureTime(){
        return html`
            ${this._times.map(times => 
                html`
                <departure-text .planned=${times[0]} .estimated=${times[1]}></departure-text>`)}
        `
    }
}
