import { LitElement, TemplateResult, html } from "lit-element";
import { CardTheme, Config, DeparturesDataRow } from "../types";
import { HomeAssistant } from "custom-card-helpers";
import { cardStyles } from "../styles";
import { DepartureTimesPool } from "../data/data-pool";

import "./content-black-white";
import "./content-cappucino";
import "./content-basic";
import "./content-blue-sky";

import "../editor/departures-card-editor.js";

import { customElement, property, state } from "lit/decorators.js";
import { localize } from "../locales/localize";
import {
  DEFAULT_CARD_ICON,
  DEFAULT_CARD_THEME,
  DEFAULT_DEPARTURES_TO_SHOW,
  DEFAULT_SCROLL_BACK_TIMEOUT,
  DEFAULT_SHOW_CARD_HEADER,
  DEFAULT_SHOW_SCROLLBUTTONS,
  DEFAULT_UPDATE_INTERVAL,
} from "../constants";

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "departures-card",
  name: "Departures Card",
  description: "Display departure times for different public transports",
});

const version = "3.0.0";
const repoUrl = "https://github.com/alex-jung/ha-departures-card";

console.groupCollapsed(`%cDepartures-Card ${version}`, "color:black; font-weight: bold; background: tomato; padding: 2px; border-radius: 5px;");
console.log(`Github repository: ${repoUrl}`);
console.groupEnd();

@customElement("departures-card")
export class DeparturesCard extends LitElement {
  static styles = [cardStyles];

  @state()
  private config!: Config;

  private dataPool = new DepartureTimesPool();

  @property({ attribute: false })
  public hass!: HomeAssistant;

  private _updateTimer: any;

  static getConfigElement() {
    return document.createElement("departures-card-editor");
  }

  public static getStubConfig(hass: HomeAssistant): Record<string, unknown> {
    return {
      type: "custom:departures-card",
      title: localize("card.departures", hass.locale?.language) || "Departures",
      showCardHeader: DEFAULT_SHOW_CARD_HEADER,
      departuresToShow: DEFAULT_DEPARTURES_TO_SHOW,
      showScrollButtons: DEFAULT_SHOW_SCROLLBUTTONS,
      scrollBackTimeout: DEFAULT_SCROLL_BACK_TIMEOUT,
      theme: DEFAULT_CARD_THEME,
      entities: [],
    };
  }

  public setConfig(config: Config) {
    if (!config) {
      throw new Error("No configuration object provided!");
    }

    this.config = config;
  }

  connectedCallback() {
    super.connectedCallback();
    this._updateTimer = setInterval(() => {
      this.requestUpdate();
    }, DEFAULT_UPDATE_INTERVAL);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._updateTimer);
  }

  public render() {
    const cardConfig = this.config || DeparturesCard.getStubConfig(this.hass);
    const darkTheme = Object(this.hass?.selectedTheme)["dark"] ?? false;
    const cardTitle = cardConfig.title || localize("card.departures", this.hass.locale?.language);
    const cardIcon = cardConfig.icon || DEFAULT_CARD_ICON;

    console.debug("Card configuration", cardConfig);

    // console.groupCollapsed("Card config");
    // console.log(`departuresToShow: ${cardConfig.departuresToShow}`);
    // console.log(`scrollBackTimeout: ${cardConfig.scrollBackTimeout}`);
    // console.log(`icon: ${cardConfig.icon}`);
    // console.log(`showCardHeader: ${cardConfig.showCardHeader}`);
    // console.log(`showScrollButtons: ${cardConfig.showScrollButtons}`);
    // console.log(`title: ${cardConfig.title}`);
    // console.log(`theme: ${cardConfig.theme}`);
    // console.log(`dark theme: ${darkTheme}`);
    // console.groupEnd();

    this.dataPool.update(this.hass, this.config.entities);

    const departures: Array<DeparturesDataRow> = this.dataPool.getDepartures(true);
    const content = this._getCardContent(cardConfig, departures);

    return html`
      <ha-card>
        <div class="card-content">
          ${cardConfig.showCardHeader
            ? html`
                <div class="card-header">
                  ${cardTitle}
                  <ha-icon icon="${cardIcon}"></ha-icon>
                </div>
              `
            : ""}
          <div class="content" data-theme=${darkTheme ? "dark" : "light"}>${content}</div>
        </div>
      </ha-card>
    `;
  }

  private _getCardContent(cardConfig: Config, departures: Array<DeparturesDataRow>): TemplateResult {
    const basic = html`<card-content-basic .departures=${departures} .cardConfig=${cardConfig} .errors=${this.dataPool.unsupportedEntities}></card-content-basic>`;
    const blackWhite = html`<card-content-black-white .departures=${departures} .cardConfig=${cardConfig} .errors=${this.dataPool.unsupportedEntities}></card-content-black-white>`;
    const cappucino = html`<card-content-cappucino .departures=${departures} .cardConfig=${cardConfig} .errors=${this.dataPool.unsupportedEntities}></card-content-cappucino>`;
    const blueSky = html`<card-content-blue-sky .departures=${departures} .cardConfig=${cardConfig} .errors=${this.dataPool.unsupportedEntities}></card-content-blue-sky>`;

    switch (cardConfig.theme) {
      case CardTheme.BASIC:
        return basic;
      case CardTheme.BLACK_WHITE:
        return blackWhite;
      case CardTheme.CAPPUCINO:
        return cappucino;
      case CardTheme.BLUE_SKY:
        return blueSky;
      default:
        return basic;
    }
  }
}
