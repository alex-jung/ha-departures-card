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
            justify-content: space-between;
            align-items:baseline;
        }
    `];

    @property({attribute: false}) 
    public config!: EntityConfig

    @property({attribute: false}) 
    public state!: HassEntity

    /**
     * Indicates whether an transport type icon should be displayed.
     * When set to `true`, the icon (first columnt in the table) will be shown; otherwise, it will be hidden.
     */
    @property({attribute: false})
    public showIcon: boolean = false

    /**
     * Customizable background color for the line.
     * 
     * @type {string}
     * @default ""
     */
    @property({attribute: false})
    public lineColor: string = ""

    /**
     * Specifies the number of departure times to display.
     * 
     * @property
     * @type {number}
     * @default 1
     */
    @property({attribute: false})
    public timesToShow: number = 1

    /**
     * Indicates whether the pulsating animation for departures time < in 5 min. should be displayed.
     * When set to `true`, animations will be enabled; otherwise, they will be disabled.
     */
    @property({attribute: false})
    public showAnimation: boolean = true

    @state()
    private times: Array<Array<string | null>> = []

    private updateTimes() {
        this.times = []

        this.times.push([this.state?.attributes[EntityAttributes.PLANNED_TIME], this.state?.attributes[EntityAttributes.ESTIMATED_TIME]])
        this.times.push([this.state?.attributes[EntityAttributes.PLANNED_TIME_1], this.state?.attributes[EntityAttributes.ESTIMATED_TIME_1]])
        this.times.push([this.state?.attributes[EntityAttributes.PLANNED_TIME_2], this.state?.attributes[EntityAttributes.ESTIMATED_TIME_2]])
        this.times.push([this.state?.attributes[EntityAttributes.PLANNED_TIME_3], this.state?.attributes[EntityAttributes.ESTIMATED_TIME_3]])
        this.times.push([this.state?.attributes[EntityAttributes.PLANNED_TIME_4], this.state?.attributes[EntityAttributes.ESTIMATED_TIME_4]])
    }

    protected render(): TemplateResult {        
        this.updateTimes()

        return html`
            ${this.renderIcon()}
            ${this.renderLine()}
            ${this.renderDestination()}
            ${this.renderDepartureTimes()}
        `;
    }

    private renderIcon() {
        if(!this.showIcon){
            return nothing
        }

        let icon = this.state.attributes[EntityAttributes.ICON] ?? "mdi:train-bus"

        return html`
            <div class="cell-icon">
                <ha-icon icon=${icon}></ha-icon>
            </div>
        `
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

    private renderDepartureTimes(){
        let times = this.times.slice(0, this.timesToShow)

        return html`
            ${times.map(times => 
                html`
                <departure-text .planned=${times[0]} .estimated=${times[1]} .showAnimation=${this.showAnimation}></departure-text>`)}
        `
    }
}
