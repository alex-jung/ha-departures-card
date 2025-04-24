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
            margin: 0 0 10px 0;
            display: grid;
            justify-self: center;
            grid-template-columns: min-content min-content min-content;
            grid-template-rows: 13px 20px;
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

    /**
     * Indicates whether the pulsating animation should be displayed.
     * 
     * @property
     * @type {boolean}
     * @default true
     */
    @property({ attribute: false })
    public showAnimation: boolean = true;

    /**
     * Represents the state of departure time data.
     * 
     * @private
     * @type {DepartureTime}
     * @default A new instance of `DepartureTime` initialized with `false`.
     */
    @state()
    private data: DepartureTime = new DepartureTime(false);

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

    /**
     * Updates the departure time data by calculating the difference
     * between the planned and estimated times. The result is stored
     * in the `data` property.
     *
     * @private
     */
    private updateTime = () => {
        this.data = calculateDepartureTime(this.planned, this.estimated);
    }

    /**
     * Generates the HTML template for displaying the departure time.
     *
     * Depending on the `mode` of the departure time, this method dynamically
     * creates the appropriate HTML content. It supports different modes such as:
     * - `NOW`: Displays an icon indicating transport arrival and optionally applies
     *   a pulsating animation if `showAnimation` is enabled.
     * - `DIFF`: Displays the time difference in minutes and applies a pulsating
     *   animation if the difference is within a specific range (0 to 5 minutes) 
     *   and `showAnimation` is enabled.
     * - `TIMESTAMP` and `NONE`: Displays the raw time value as provided in the data.
     *
     * @returns {TemplateResult} The HTML template for the departure time, including
     * a pulsating animation if applicable.
     */
    private getTimeHtml(): TemplateResult {
        let innerHtml;
        const nowIcon = "mdi:bus-side";
        let pulsating = false;

        switch(this.data.mode) {
            case DepartureTimeMode.NOW:
                innerHtml = html`<ha-icon icon=${nowIcon}></ha-icon>`;
                pulsating = this.showAnimation && true;
                break;
            case DepartureTimeMode.DIFF:
                let diffMins = Number(this.data.time)

                if(diffMins >= 0 && diffMins <= 5) {
                    pulsating = this.showAnimation && true;
                }
            case DepartureTimeMode.TIMESTAMP:
            case DepartureTimeMode.NONE:
                innerHtml = html`${this.data.time}`;
                break;
        }

        const textClasses = {
            "pulsating": pulsating
        }

        return html`
            <div class="text ${classMap(textClasses)}">${innerHtml}</div>
        `;
    }

    /**
     * Generates an HTML template representing the delay information for a departure.
     *
     * The delay is displayed with a "+" sign if it is positive, or as-is if it is negative.
     * The delay text is styled with CSS classes based on whether the delay is positive or non-positive.
     *
     * @returns {TemplateResult} An HTML template containing the delay information with appropriate styling.
     */
    private getDelayHtml(): TemplateResult {
        let delayHtml;

        if(this.data.realTime && this.data.mode == DepartureTimeMode.DIFF) {
            delayHtml = this.data.delay >= 0 ? `+${this.data.delay}` : `${this.data.delay}`;
        }

        const delayClasses = {
            "green": this.data.delay <= 0,
            "red": this.data.delay > 0,
        }

        return html`<div class="delay ${classMap(delayClasses)}">${delayHtml}</div>`
    }

    protected render(): TemplateResult {
        return html`
            <div class="container">
                <div class="prefix">${this.data.prefix}</div>
                ${this.getTimeHtml()}
                <div class="postfix">${this.data.postfix}</div>
                ${this.getDelayHtml()}
            </div>
            `;
  }
}