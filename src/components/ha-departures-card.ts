import { LitElement, TemplateResult, html } from "lit-element";
import { CardOrientation, Config, DeparturesDataRow } from "../types";
import { HomeAssistant } from "custom-card-helpers";
import { cardStyles } from "../styles";
import { DepartureTimesPool } from "../data/data-pool";

import "./content-table";
import "./content-list";

import "../editor/departures-card-editor.js";

import { customElement, property, state } from "lit/decorators.js";
import {
  DEFAULT_ANIMATE_LINE,
  DEFAULT_ARRIVAL_OFFSET,
  DEFAULT_CARD_ICON,
  DEFAULT_CARD_ORIENTATION,
  DEFAULT_CARD_THEME,
  DEFAULT_CARD_TITLE,
  DEFAULT_DEPARTURE_ANIMATION,
  DEFAULT_DEPARTURE_ICON,
  DEFAULT_DEPARTURES_TO_SHOW,
  DEFAULT_LAYOUT,
  DEFAULT_SCROLL_BACK_TIMEOUT,
  DEFAULT_SHOW_CARD_HEADER,
  DEFAULT_SHOW_LIST_HEADER,
  DEFAULT_SHOW_SCROLLBUTTONS,
  DEFAULT_SORT_DEPARTURES,
  DEFAULT_UPDATE_INTERVAL,
} from "../constants";
import { localize } from "../locales/localize";

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "departures-card",
  name: "Departures Card",
  description: "Display departure times for different public transports",
});

const version = "3.3.0";
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
      title: DEFAULT_CARD_TITLE,
      icon: DEFAULT_CARD_ICON,
      departuresToShow: DEFAULT_DEPARTURES_TO_SHOW,
      showCardHeader: DEFAULT_SHOW_CARD_HEADER,
      showListHeader: DEFAULT_SHOW_LIST_HEADER,
      scrollBackTimeout: DEFAULT_SCROLL_BACK_TIMEOUT,
      showScrollButtons: DEFAULT_SHOW_SCROLLBUTTONS,
      cardOrientation: DEFAULT_CARD_ORIENTATION,
      theme: DEFAULT_CARD_THEME,
      sortDepartures: DEFAULT_SORT_DEPARTURES,
      departureIcon: DEFAULT_DEPARTURE_ICON,
      animateLine: DEFAULT_ANIMATE_LINE,
      departureAnimation: DEFAULT_DEPARTURE_ANIMATION,
      arrivalTimeOffset: DEFAULT_ARRIVAL_OFFSET,
      layout: DEFAULT_LAYOUT,
      entities: [],
    };
  }

  public setConfig(config: Config) {
    if (!config) {
      throw new Error("No configuration provided!");
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
    const cardTitle = cardConfig.title ?? DEFAULT_CARD_TITLE;
    const cardIcon = cardConfig.icon ?? DEFAULT_CARD_ICON;

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
          ${content}
        </div>
      </ha-card>
    `;
  }

  private _getCardContent(cardConfig: Config, departures: Array<DeparturesDataRow>): TemplateResult {
    const language = this.hass.locale?.language ?? "en";
    const cardTheme = cardConfig.theme;
    const cardOrientation = cardConfig.cardOrientation;

    switch (cardOrientation) {
      case CardOrientation.VERTICAL:
        return html`<card-content-list
          .language=${language}
          .theme=${cardTheme}
          .departures=${departures}
          .cardConfig=${cardConfig}
          .errors=${this.dataPool.errors}></card-content-list>`;
      case CardOrientation.HORIZONTAL:
        return html`<card-content-table
          .language=${language}
          .theme=${cardTheme}
          .departures=${departures}
          .cardConfig=${cardConfig}
          .errors=${this.dataPool.errors}></card-content-table>`;
      default:
        return html`<div>${localize("card.errors.no-card-orientation-set", this.hass.locale?.language)}</div>`;
    }
  }
}
