import { classMap } from 'lit/directives/class-map.js';
import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { calculateDepartureTime } from './helpers';
import { DepartureTime, DepartureTimeMode } from './data-classes';

@customElement('departure-text')
export class Departure extends LitElement {
    static styles = [
        css`
        :host {
            width: 90px;
        }
        .container {
            margin: 5px;
            display: grid;
            justify-self: center;
            grid-template-columns: min-content min-content min-content;
            grid-template-rows: 10px 20px;
            gap: 0px 3px;
            grid-auto-flow: row;
            grid-template-areas:
                "prefix text delay"
                "prefix text postfix"
        }
        .prefix { 
            grid-area: prefix; 
            align-self: end;
            justify-self: start;
        }
        .delay { 
            grid-area: delay; 
            font-size: 0.8em;
            justify-self: start;
        }
        .green {
            color: limegreen;
        }
        .red {
            color: #F72C5B;
        }
        .postfix { 
            grid-area: postfix; 
            align-self: end;
            justify-self: end;
        }
        .text {
            grid-area: text;    
            font-size: 1.3em;
            font-weight: bold;
            color: var(--primary-text-color);
            align-self: end;
            align-content: center;
            line-height: 1.3em;
        }

        .pulsating {
            animation: pulsieren 1.5s infinite;
        }

        @keyframes pulsieren {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.2);
            }
            100% {
                transform: scale(1);
            }
        }
    `];
    /**
     * Represents the planned departure time.
     * This property holds a `Date` object indicating the scheduled time of departure,
     * or `null` if no planned time is available.
     */
    @property({ attribute: false }) 
    public planned: Date | null  = null;
    /**
     * Represents the estimated departure time.
     * This property can either hold a `Date` object indicating the estimated time
     * or `null` if no estimation is available.
     */
    @property({ attribute: false }) 
    public estimated: Date | null  = null;

    @state()
    private _data: DepartureTime = new DepartureTime(false);

    private intervalTimer?: NodeJS.Timeout | undefined
    private INTERVAL = 10000 // update every 10 sec

    override connectedCallback(): void {
      super.connectedCallback();
      this.intervalTimer = setInterval(this.updateTime, this.INTERVAL)

      this.updateTime();
    }
  
    override disconnectedCallback(): void {
      super.disconnectedCallback()
      clearInterval(this.intervalTimer)
      this.intervalTimer = undefined
    }

    private updateTime = () => {
        this._data = calculateDepartureTime(this.planned, this.estimated);
    }

    private _getTimeHtml(): TemplateResult {
        let innerHtml;
        const nowIcon = "mdi:bus-side";
        let pulsating = false

        switch(this._data.mode) {
            case DepartureTimeMode.NOW:
                innerHtml = html`<ha-icon icon=${nowIcon}></ha-icon>`;
                pulsating = true;
                break;
            case DepartureTimeMode.DIFF:
                let diffMins = Number(this._data.time)

                if(diffMins >= 0 && diffMins <= 5) {
                    pulsating = true
                }
            case DepartureTimeMode.TIMESTAMP:
            case DepartureTimeMode.NONE:
                innerHtml = html`${this._data.time}`;
                break;
        }

        const textClasses = {
            "pulsating": pulsating
        }

        return html`
            <div class="text ${classMap(textClasses)}">${innerHtml}</div>
        `;
    }

    private _getDelayHtml(): TemplateResult {
        let delayHtml;

        if(this._data.realTime && this._data.mode == DepartureTimeMode.DIFF) {
            delayHtml = this._data.delay >= 0 ? `+${this._data.delay}` : `${this._data.delay}`;
        }

        const delayClasses = {
            "green": this._data.delay <= 0,
            "red": this._data.delay > 0,
        }

        return html`<div class="delay ${classMap(delayClasses)}">${delayHtml}</div>`
    }

    protected render(): TemplateResult {
        //console.log("render departure", this._data)

        this.updateTime();

        let _prefix = this._data.prefix;
        let _postfix = this._data.postfix;

        //console.debug("Departure", this._data.mode);


        return html`
            <div class="container">
                <div class="prefix">${_prefix}</div>
                ${this._getTimeHtml()}
                <div class="postfix">${_postfix}</div>
                ${this._getDelayHtml()}
            </div>
            `;
  }
}