import Splide, { Options as SplideOptions } from "@splidejs/splide";
import { Content } from "./content";
import { ClassTimer, getRowsFittingHeight } from "../helpers";
import { css, CSSResultGroup, html, PropertyValues, unsafeCSS } from "lit";
import { DEFAULT_DEPARTURE_ROW_GAP, DEFAULT_DEPARTURE_ROW_HEIGHT, DEFAULT_DEPARTURES_TO_SHOW, DEFAULT_SCROLL_BACK_TIMEOUT, DEFAULT_SHOW_SCROLLBUTTONS } from "../constants";
import { customElement, state } from "lit/decorators.js";
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
    css`
      /* Sections view with a fixed number of rows: fill the available space and stretch the departure rows */
      :host([fixed-height]) {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      :host([fixed-height]) .content,
      :host([fixed-height]) .splide-root,
      :host([fixed-height]) .splide {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
      }
      :host([fixed-height]) .splide__slide > .departure-line {
        height: 100%;
        box-sizing: border-box;
        align-items: center;
      }
    `,
  ];

  private splide: Splide | null = null;
  private scrollBackTimer: ClassTimer | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private availableHeight = 0;

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this._initializeSplide();
    this._initializeScrollbackTimer();
    this._observeAvailableHeight();
  }

  public connectedCallback(): void {
    super.connectedCallback();

    // re-attached to the DOM (e.g. card moved in edit mode)
    if (this.hasUpdated) {
      this._observeAvailableHeight();
    }
  }

  protected updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);

    if (_changedProperties.get("cardConfig")) {
      console.debug("Card config has been changed, reinitialze splide.");
      this._initializeScrollbackTimer();
      this._initializeSplide();
    }

    if (_changedProperties.has("fixedHeight") && _changedProperties.get("fixedHeight") !== undefined) {
      console.debug("Height mode has been changed, reinitialze splide.");
      this.availableHeight = 0;
      this._initializeSplide();
      this._observeAvailableHeight();
    }
  }

  protected createLayout(): Layout {
    return new Layout(this.cardConfig.layout, CardOrientation.VERTICAL, this.cardConfig.cellWidths);
  }

  public disconnectedCallback(): void {
    console.debug("ContentList disconnected from DOM -> stop scrollback timer.");

    super.disconnectedCallback();

    this.scrollBackTimer?.stop();
    this.scrollBackTimer = null;

    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
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
                ${this.departures.map(
                  (entry, idx) => html`<li class="splide__slide" data-departure-idx=${idx}>${this.renderDepartureLine(entry)}</li>`,
                )}
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
    const visibleRows = this._getVisibleRows();

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

  /**
   * Observes the space available for the departure list if the height is defined by the dashboard grid.
   */
  private _observeAvailableHeight() {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    if (!this.fixedHeight) {
      return;
    }

    const root = this.renderRoot.querySelector(".splide") as HTMLElement | null;

    if (!root) {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      const height = Math.floor(root.clientHeight);

      if (height <= 0 || height === this.availableHeight) {
        return;
      }

      console.debug("Available height changed to", height);

      this.availableHeight = height;

      if (this.splide) {
        this.splide.options = { height: this._getContentHeight(), perPage: this._getVisibleRows() };
      }
    });
    this.resizeObserver.observe(root);
  }

  /**
   * Number of departure rows to show. If the height is defined by the dashboard grid, as many rows as fit into
   * the available space are shown (stretched to fill it), otherwise the configured number of departures.
   */
  private _getVisibleRows(): number {
    if (this.fixedHeight && this.availableHeight > 0) {
      return getRowsFittingHeight(this.availableHeight, DEFAULT_DEPARTURE_ROW_HEIGHT, DEFAULT_DEPARTURE_ROW_GAP);
    }

    return this.cardConfig.departuresToShow ?? DEFAULT_DEPARTURES_TO_SHOW;
  }

  private _getContentHeight(): number {
    const depsToShow = this.cardConfig.departuresToShow ?? DEFAULT_DEPARTURES_TO_SHOW;

    if (this.fixedHeight && this.availableHeight > 0) {
      return this.availableHeight;
    }

    return depsToShow * DEFAULT_DEPARTURE_ROW_HEIGHT + depsToShow * DEFAULT_DEPARTURE_ROW_GAP;
  }
}
