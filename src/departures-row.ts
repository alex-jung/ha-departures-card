import { html, css, LitElement, nothing, TemplateResult } from 'lit';
import { property, customElement, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { EntityConfig } from './types.js';
import { HassEntity } from 'home-assistant-js-websocket'
import { cardStyles } from './styles.js';
import { EntityAttributes } from './types.js'
import './departure.ts'
import { DepartureTime, DepartureTimeMode } from './data-classes.js';

@customElement('departures-row')
export class DeparturesRow extends LitElement {
    static styles = [
        cardStyles,
        css`
        :host {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: baseline;
        }
        destination-container{
            display: flex;     
            flex: 2; 
            justify-content: space-between; 
            align-items: center;
        }
        times-container{
            display: flex;     
            flex: 1; 
            justify-content: flex-end; 
            align-items: center;
        }
        debug-info {
            display: flex;
            width: 100%;
            font-size: 0.8em;
            color: white;
            padding: 10px;
            background-color: black;
        }
        @media (min-width: 100px) and (max-width: 500px){
            :host {
                display: grid;
                grid-template-columns: 100%;
                grid-template-rows: auto auto;
            }
            destination-container{
                flex: 1; 
                display: flex; 
                justify-content: flex-start; 
                align-items: center;
                background: var(--primary-color);
            }
            times-container{
                flex: 2;
                display: flex;
                justify-content: flex-start;
            }
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

    @property({attribute: false})
    public debug: boolean = false

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

    /**
     * Holds an array of departure times.
     * This state property is used to manage and track the list of departure times
     * for the component.
     */
    @state()
    private times: Array<DepartureTime> = []

    private intervalId?: number
    private INTERVAL = 10000 // update every 10 sec

    override connectedCallback(): void {
      super.connectedCallback();
      
      this.intervalId = window.setInterval(() => {
        this._updateTimes()
      }, this.INTERVAL)

      this._updateTimes();
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback()

      if (this.intervalId !== undefined) {
        clearInterval(this.intervalId)
      }
    }

    /**
     * Updates the `times` array with new `DepartureTime` instances and populates them
     * with planned and estimated time attributes from the current state.
     *
     * Each `DepartureTime` instance corresponds to a specific planned and estimated
     * time attribute (e.g., `PLANNED_TIME`, `PLANNED_TIME_1`, etc.) from the `state` object.
     *
     * The method initializes the `times` array with five `DepartureTime` objects and
     * updates their values using the `updateTime` method, passing the relevant planned
     * and estimated time attributes.
     *
     * @private
     */
    private _updateTimes() {
        let timeStyle = this.config?.timeStyle ?? "dynamic"

        this.times = [new DepartureTime(timeStyle), 
            new DepartureTime(timeStyle), 
            new DepartureTime(timeStyle),
            new DepartureTime(timeStyle), 
            new DepartureTime(timeStyle)]

        this.times[0].updateTime(this.state?.attributes[EntityAttributes.PLANNED_TIME], this.state?.attributes[EntityAttributes.ESTIMATED_TIME])
        this.times[1].updateTime(this.state?.attributes[EntityAttributes.PLANNED_TIME_1], this.state?.attributes[EntityAttributes.ESTIMATED_TIME_1])
        this.times[2].updateTime(this.state?.attributes[EntityAttributes.PLANNED_TIME_2], this.state?.attributes[EntityAttributes.ESTIMATED_TIME_2])
        this.times[3].updateTime(this.state?.attributes[EntityAttributes.PLANNED_TIME_3], this.state?.attributes[EntityAttributes.ESTIMATED_TIME_3])
        this.times[4].updateTime(this.state?.attributes[EntityAttributes.PLANNED_TIME_4], this.state?.attributes[EntityAttributes.ESTIMATED_TIME_4])

        /*
        console.log(this.times[0].mode, this.times[0].time, this.times[0].delay, this.state?.attributes[EntityAttributes.PLANNED_TIME])
        console.log(this.times[1].mode, this.times[1].time, this.times[1].delay, this.state?.attributes[EntityAttributes.PLANNED_TIME_1]) 
        console.log(this.times[2].mode, this.times[2].time, this.times[2].delay, this.state?.attributes[EntityAttributes.PLANNED_TIME_2])
        console.log(this.times[3].mode, this.times[3].time, this.times[3].delay, this.state?.attributes[EntityAttributes.PLANNED_TIME_3])
        console.log(this.times[4].mode, this.times[4].time, this.times[4].delay, this.state?.attributes[EntityAttributes.PLANNED_TIME_4])

        console.log("-----------------------------")
        */
    }

    /**
     * Retrieves the icon to be used for the "now" state.
     *
     * The method checks for a custom icon in the configuration (`config.nowIcon`).
     * If not found, it attempts to use the icon from the entity's state attributes (`state.attributes[EntityAttributes.ICON]`).
     * If neither is available, it returns a default Material Design Icon (`mdi:train-bus`).
     *
     * @returns {string} The icon string to be used for the "now" state.
     */
    private _getNowIcon(): string {
        if (this.config?.nowIcon) {
            return this.config.nowIcon;
        }
        if (this.state?.attributes[EntityAttributes.ICON]) {
            return this.state.attributes[EntityAttributes.ICON];
        }

        return "mdi:train-bus"; // Default icon if none is provided
    }

    protected render(): TemplateResult {   
        return html`
            <destination-container>
                ${this.renderIcon()}
                ${this.renderLine()}
                ${this.renderDestination()}
            </destination-container>
            <times-container>
                ${this.renderDepartureTimes()}
            </times-container>
            ${this.debug ? this.renderDebugInfo() : nothing}
        `;
    }

    private renderIcon() {
        if(!this.showIcon){
            return nothing
        }

        let icon = this.state?.attributes[EntityAttributes.ICON] ?? "mdi:train-bus"

        return html`
            <div class="cell-icon">
                <ha-icon icon=${icon}></ha-icon>
            </div>
        `
    }

    private renderLine(){
        const line = this.config?.lineName ?? this.state?.attributes[EntityAttributes.LINE_NAME]

        const lineStyles = {
            background: this.config?.lineColor || ""
        }

        return html`
            <div class="cell-line">
                <div class="line-number" style=${styleMap(lineStyles)}>${line}</div>
            </div>
        `
    }

    private renderDestination(){
        let destination = this.config?.destinationName ?? this.state?.attributes[EntityAttributes.DIRECTION]

        return html`
            <div class="cell-destination">${destination}</div>
        `
    }

    private renderDepartureTimes(){
        let times = this.times.filter((time) => time.mode != DepartureTimeMode.PAST)
        
        const missing = this.timesToShow - times.length

        if(missing <=0 ){
            times = times.slice(0, this.timesToShow) 
        }
        else{
            times = times.concat(new Array(missing).fill(null))
        }

        let icon = this._getNowIcon() 

        return html`
            ${times.map(time => 
                html`
                <departure-text 
                    .time=${time} 
                    .showAnimation=${this.showAnimation}
                    .nowIcon=${icon}>
                </departure-text>`)}
        `
    }

    private renderDebugInfo() {
        return html`
            <debug-info>
                <pre>${JSON.stringify(this.state?.attributes, null, 1)}</pre></br>
            </debug-info>
        `;
    }
}
