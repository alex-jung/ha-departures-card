import { html, css, LitElement, nothing } from 'lit';
import { property, customElement, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { EntityConfig } from './types.js';
import { HomeAssistant } from 'custom-card-helpers';
import { HassEntity } from 'home-assistant-js-websocket'
import { isThisMinute, intlFormatDistance, differenceInMinutes, lightFormat  } from "date-fns";
import { cardStyles } from './styles.js';
import { EntityAttributes } from './types.js'

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
    public hass!: HomeAssistant;

    @property({type: Boolean})
    public showDelay = true

    @property({type: Boolean})
    public showIcon: boolean = false

    @property({type: Boolean})
    public showTimestamp: boolean = false

    @state()
    private _departure: string = "-:-"

    @state()
    private _delay: number = 0

    @state()
    private _now: boolean = false

    @state()
    private _state!: HassEntity

    private intervalTimer?: NodeJS.Timeout | undefined
    private INTERVAL = 10000 // update every 10 sec

    override connectedCallback(): void {
      super.connectedCallback();
      this.intervalTimer = setInterval(this.updateTime, this.INTERVAL)
    }
  
    override disconnectedCallback(): void {
      super.disconnectedCallback()
      clearInterval(this.intervalTimer)
      this.intervalTimer = undefined
    }
  
    updateTime = () => {
        this._state = this.getState() as HassEntity
        this._departure = this.calculateDeparture(this._state?.state)
        this._delay = this.calculateDelay(this._state?.state, this._state?.attributes[EntityAttributes.PLANNED_TIME])
    }

    private calculateDeparture(date: string | null): string{
        if(!date || date == "unknown"){
            return "-:-"
        }
        
        let _param_date = new Date(date).setSeconds(0,0)
        let _now_date = new Date().setSeconds(0,0)
        
        if(isThisMinute(_param_date)){
            this._now = true

            return "Jetzt"
        }
        else
        {
            this._now = false
        }

        if(this.showTimestamp){
            return lightFormat(_param_date, "HH:mm")
        }

        return intlFormatDistance(_param_date, _now_date, { style: 'short' })
    }

    private calculateDelay(currentDate: string, plannedDate: string): number
    {
        if(!currentDate || currentDate === "unknown"){
            return 0
        }
        if(!plannedDate || plannedDate === "unknown"){
            return 0
        }

        return differenceInMinutes(currentDate, plannedDate)
    }

    private getState(): HassEntity | {} {
        if(this.hass)
            return this.hass.states[this.config.entity]

        return {}
    }

    render() {      
        this.updateTime()

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

        let icon = this._state.attributes[EntityAttributes.ICON] ?? "mdi:train-bus"

        return html`<ha-icon icon=${icon}></ha-icon>`
    }

    private renderLine(){
        const line = this.config.line_name || this._state.attributes[EntityAttributes.LINE_NAME]
        const line_styles = {
            background: this.config.line_color || ""
        }

        return html`
            <div class="cell-line">
                <div class="line-number" style=${styleMap(line_styles)}>${line}</div>
            </div>
        `
    }

    private renderDestination(){
        const destination = this.config.destination_name || this._state.attributes[EntityAttributes.DIRECTION]

        return html`
            <div class="cell-destination">${destination}</div>
        `
    }

    private renderDepartureTime(){
        return html`
            ${this._departure}
            ${this.renderDelay()}
        `
    }

    private renderDelay() {
        if(!this.showDelay || this._now){
            return nothing
        }

        const delayed = this._delay >= 0
        const sign = delayed ? "+" : "-"
        
        return html`<span class="delay" delayed=${delayed}>(${sign}${this._delay})</span>`
    }
}
