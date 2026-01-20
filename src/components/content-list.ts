import Splide, { Options as SplideOptions } from "@splidejs/splide";
import { Content } from "./content";
import { ClassTimer } from "../helpers";
import { css, CSSResultGroup, html, PropertyValues, unsafeCSS } from "lit";
import { DEFAULT_DEPARTURE_ROW_GAP, DEFAULT_DEPARTURE_ROW_HEIGHT, DEFAULT_DEPARTURES_TO_SHOW, DEFAULT_SCROLL_BACK_TIMEOUT, DEFAULT_SHOW_SCROLLBUTTONS } from "../constants";
import { customElement } from "lit/decorators.js";
import { Layout } from "../data/layout";
import { CardOrientation } from "../types";

import cssText from "@splidejs/splide/dist/css/splide.min.css";

@customElement("card-content-list")
export class ContentList extends Content {
  static styles = [
    css`
      ${unsafeCSS(cssText)}
    ` as CSSResultGroup,
    Content.styles,
  ];
  private splide: Splide | null = null;

  private scrollBackTimer: ClassTimer | null = null;

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this._initializeSplide();
    this._initializeScrollbackTimer();
  }

  protected updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);

    if (_changedProperties.get("cardConfig")) {
      console.debug("Card config has been changed, reinitialze splide.");
      this._initializeScrollbackTimer();
      this._initializeSplide();
    } else if (_changedProperties.get("departures")) {
      console.debug("Departures have been changed, refresh splide.");
      this.splide?.refresh();
    }
  }

  protected createLayout(): Layout {
    return new Layout(this.cardConfig.layout, CardOrientation.VERTICAL);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();

    this.scrollBackTimer?.stop();
    this.scrollBackTimer = null;
  }

  protected renderContent() {
    return html`
    <div class="splide-root" id="content-background" theme=${this.theme}>
      ${this.renderListHeader()}
      <div class="splide">
        <div style="position:relative">
          <div class="splide__arrows"></div>
            <div class="splide__track">
              <ul class="splide__list">
                ${this.departures.map((entry) => html`<li class="splide__slide">${this.renderDepartureLine(entry)}</li>`)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  protected getQueryLineElements(): string {
    return ".departure-line";
  }

  protected getQueryTimeElements(): string {
    return ".cell-time-diff";
  }

  private _restartscrollBackTimer() {
    if (this.scrollBackTimer == null) {
      console.debug("Scrollback timer is null, create a new instance");
      this._initializeScrollbackTimer();
    }

    if (!this.scrollBackTimer) {
      console.error("Scrollback timer has not been created!");
      return;
    }

    if (!this.scrollBackTimer.isRunning()) {
      this.scrollBackTimer.start(() => {
        this.splide?.go(0);
      });
    } else {
      this.scrollBackTimer.restart();
    }
  }

  private _initializeScrollbackTimer() {
    if (this.scrollBackTimer) {
      this.scrollBackTimer.stop();
      this.scrollBackTimer = null;
    }

    if (this.cardConfig.scrollBackTimeout == 0) {
      return;
    }

    const timeout = (this.cardConfig.scrollBackTimeout || DEFAULT_SCROLL_BACK_TIMEOUT) * 1000;

    console.debug("Initialize scrollback timer with timeout", timeout);

    this.scrollBackTimer = new ClassTimer(timeout);
  }

  private _initializeSplide(): void {
    if (this.splide) {
      console.debug("Splide object already exists, destroy it!");
      this.splide.destroy();
    }

    const root = this.renderRoot.querySelector(".splide") as HTMLElement;
    const visibleRows = this.cardConfig.departuresToShow ?? DEFAULT_DEPARTURES_TO_SHOW;

    if (!root || root === undefined) {
      console.debug("Splide root element not found.");
      return;
    }

    const options: SplideOptions = {
      type: "slide",
      perPage: visibleRows,
      autoplay: false,
      pagination: false,
      arrows: this.cardConfig.showScrollButtons ?? DEFAULT_SHOW_SCROLLBUTTONS,
      gap: DEFAULT_DEPARTURE_ROW_GAP,
      direction: "ttb",
      height: this._getContentHeight(),
      drag: true,
      wheel: true,
    };

    console.debug("Create new splide with following options", options);

    this.splide = new Splide(root, options);

    this.splide.on("moved scrolled dragged", (newIndex) => {
      console.debug("Splide moved to ", newIndex);

      if (newIndex == 0) {
        this.scrollBackTimer?.stop();
      } else {
        this._restartscrollBackTimer();
      }
    });

    this.splide.mount();
  }

  private _getContentHeight(): number {
    const depsToShow = this.cardConfig.departuresToShow ?? DEFAULT_DEPARTURES_TO_SHOW;

    return depsToShow * DEFAULT_DEPARTURE_ROW_HEIGHT + depsToShow * DEFAULT_DEPARTURE_ROW_GAP;
  }
}
