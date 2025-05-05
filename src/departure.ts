import { classMap } from 'lit/directives/class-map.js';
import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DepartureTime, DepartureTimeMode } from './data-classes';

@customElement('departure-text')
export class Departure extends LitElement {
    static styles = [
        css`
        :host {
            display: flex;
        }
        .container {
            width: 50px;
            margin: 5px;
            display: grid;
            justify-self: center;
            justify-content: center;
            grid-template-columns: min-content min-content min-content;
            grid-template-rows: 15px 20px;
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
            justify-self: start;
        }
        .green {
            color: var(--success-color);
        }
        .red {
            color: var(--error-color);
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
            align-self: end;
            align-content: center;
            line-height: 24px;
        }
        .pulsating {
            animation: pulsieren 1.5s infinite;
        }
        @media (min-width: 100px) and (max-width: 500px){
            :contianer {
                margin: 5px 0px 5px 0px;
            }
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

    @property({ attribute: false }) 
    public time!: DepartureTime;

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

        if(!this.time) {
            return html`<div class="text">-</div>`;
        }

        switch(this.time.mode) {
            case DepartureTimeMode.NOW:
                innerHtml = html`<ha-icon icon=${nowIcon}></ha-icon>`;
                pulsating = this.showAnimation && true;
                break;
            case DepartureTimeMode.DIFF:
                let diffMins = Number(this.time.time)

                if(diffMins >= 0 && diffMins <= 5) {
                    pulsating = this.showAnimation && true;
                }
            case DepartureTimeMode.TIMESTAMP:
            case DepartureTimeMode.NONE:
            case DepartureTimeMode.PAST:
                innerHtml = html`${this.time.time}`;
                break;
        }

        const textClasses = {
            "pulsating": pulsating,
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

        if(!this.time) {
            return html`<div class="delay"></div>`;
        }

        if(this.time.realTime && this.time.mode == DepartureTimeMode.DIFF) {
            delayHtml = this.time.delay >= 0 ? `+${this.time.delay}` : `${this.time.delay}`;
        }

        const delayClasses = {
            "green": this.time.delay <= 0,
            "red": this.time.delay > 0,
        }

        return html`<div class="delay ${classMap(delayClasses)}">${delayHtml}</div>`
    }

    private getPostfixHtml(): TemplateResult {
        if(!this.time) {
            return html`<div class="postfix"></div>`;
        }
        
        return html`
            <div class="postfix">${this.time.postfix}</div>
        `;
    }

    protected render(): TemplateResult {
        return html`
            <div class="container">
                ${this.getTimeHtml()}
                ${this.getPostfixHtml()}
                ${this.getDelayHtml()}
            </div>
            `;
  }
}