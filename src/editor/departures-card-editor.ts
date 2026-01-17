import { css, html, LitElement, nothing, PropertyValues } from "lit";
import { state, property, customElement } from "lit/decorators.js";
import { CardOrientation, CardTheme, Config, LayoutCell } from "../types";
import { HomeAssistant, fireEvent, LovelaceCardEditor } from "custom-card-helpers";
import "./departures-entity-editor";
import { localize } from "../locales/localize";

import { mdiPlus } from "@mdi/js";
import { cardStyles, contentCore } from "../styles";
import { EntityTab } from "./entity-tab";
import { mdiTableRow, mdiPalette, mdiFormatListBulleted, mdiAnimation } from "@mdi/js";
import { AnimatePreset, animatePresets } from "../animate-presets";
import { DEFAULT_ARRIVAL_OFFSET, DEFAULT_DEPARTURE_ANIMATION, DEFAULT_DEPARTURES_TO_SHOW, DEFAULT_SCROLL_BACK_TIMEOUT } from "../constants";

@customElement("departures-card-editor")
export class DeparturesCardEditor extends LitElement implements LovelaceCardEditor {
  static styles = [
    cardStyles,
    contentCore,
    css`
      .entity-editor-content {
        border: 1px solid var(--divider-color);
        padding: 10px;
      }
      .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      ha-form {
        display: block;
        padding: 10px;
      }
      ha-expansion-panel {
        margin-top: 20px;
      }
      ha-tab-group {
        flex: 1;
        margin-right: 5px;
        max-width: 400px;
      }
    `,
  ];
  @property({ attribute: false })
  public hass!: HomeAssistant;

  @state()
  private _config?: Config;

  @state()
  private _tabs: EntityTab[] = [];

  @state()
  private _currTab: string = "1";

  public connectedCallback(): void {
    super.connectedCallback();

    this._renderAnimatePreview();
  }

  protected updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);

    this._renderAnimatePreview();
  }

  public setConfig(config: Config) {
    let newConfig = { ...config };

    if (typeof config.layout === "string") {
      newConfig = { ...newConfig, layout: (config.layout as string).split(" ") };
    }
    if (config.arrivalTimeOffset == undefined) {
      newConfig = { ...newConfig, arrivalTimeOffset: DEFAULT_ARRIVAL_OFFSET };
      console.warn("No arrivalTimeOffset found, set default value");
    }
    if (config.departureAnimation == undefined) {
      newConfig = { ...newConfig, departureAnimation: DEFAULT_DEPARTURE_ANIMATION };
      console.warn("No departureAnimation found, set default value");
    }
    if (config.departuresToShow == undefined) {
      newConfig = { ...newConfig, departuresToShow: DEFAULT_DEPARTURES_TO_SHOW };
      console.warn("No departuresToShow found, set default value");
    }
    if (config.scrollBackTimeout == undefined) {
      newConfig = { ...newConfig, scrollBackTimeout: DEFAULT_SCROLL_BACK_TIMEOUT };
      console.warn("No scrollBackTimeout found, set default value");
    }

    this._config = newConfig;

    console.debug("Set config in card editor", this._config);

    this._tabs = config.entities?.map((config, index) => new EntityTab(Number(index + 1), config)) || [];
  }

  private _schemaGeneral = (showCardHeader: boolean) => [
    {
      name: "showCardHeader",
      selector: { boolean: {} },
    },
    ...(showCardHeader
      ? [
          {
            name: "",
            type: "grid",
            column_min_width: "100px",
            schema: [
              {
                name: "title",
                required: false,
                selector: { text: {} },
              },
              { name: "icon", required: false, selector: { icon: {} } },
            ],
          },
        ]
      : []),
  ];

  private _schemaDesign = (localize: Function, orientation: CardOrientation) => [
    {
      name: "cardOrientation",
      required: true,
      selector: {
        select: {
          mode: "box",
          options: [
            {
              label: "Vertical",
              value: CardOrientation.VERTICAL,
              description: localize({ name: "cardOrientationVerticalDescription" }),
            },
            {
              label: "Horizontal",
              value: CardOrientation.HORIZONTAL,
              description: localize({ name: "cardOrientationHorizontalDescription" }),
            },
          ],
        },
      },
    },
    {
      name: "theme",
      type: "select",
      required: true,
      selector: {
        select: {
          options: [
            {
              label: "Basic",
              value: CardTheme.BASIC,
            },
            {
              label: "Black-White",
              value: CardTheme.BLACK_WHITE,
            },
            {
              label: "Blue Ocean",
              value: CardTheme.BLUE_OCEAN,
            },
            {
              label: "Cappucino",
              value: CardTheme.CAPPUCINO,
            },
          ],
          mode: "dropdown",
        },
      },
    },
    {
      name: "showListHeader",
      selector: { boolean: {} },
    },
    ...(orientation == CardOrientation.VERTICAL
      ? [
          {
            name: "showScrollButtons",
            selector: { boolean: {} },
          },
          {
            name: "scrollBackTimeout",
            selector: {
              number: {
                min: 0,
                max: 20,
                step: 1,
                mode: "slider",
              },
            },
          },
        ]
      : [
          {
            name: "sortDepartures",
            selector: { boolean: {} },
          },
        ]),
    {
      name: "departuresToShow",
      selector: {
        number: {
          min: 1,
          max: 20,
          step: 1,
          mode: "slider",
        },
      },
    },
  ];

  private _schemaLayout = (localize: Function) => [
    {
      name: "layout",
      selector: {
        select: {
          reorder: true,
          multiple: true,
          custom_value: false,
          options: [LayoutCell.ICON, LayoutCell.LINE, LayoutCell.DESTINATION, LayoutCell.PLANNED_TIME, LayoutCell.ESTIMATED_TIME, LayoutCell.TIME_DIFF, LayoutCell.DELAY].map(
            (cellName) => {
              return { value: cellName, label: localize({ name: `layout-cells.${cellName}` }) };
            },
          ),
          default: [LayoutCell.ICON, LayoutCell.DESTINATION],
        },
      },
    },
  ];

  private _schemaAnimation = (localize: Function) => [
    {
      name: "departureIcon",
      required: false,
      selector: { icon: {} },
    },
    {
      name: "animateLine",
      required: false,
      selector: { boolean: {} },
    },
    {
      name: "arrivalTimeOffset",
      selector: {
        number: {
          min: 0,
          max: 60,
          step: 1,
          mode: "slider",
        },
      },
    },
    {
      name: "departureAnimation",
      type: "select",
      required: true,
      selector: {
        select: {
          options: [
            { value: "none", label: localize({ name: "noAnimation" }) },
            { value: "bounce", label: "Bounce" },
            { value: "flash", label: "Flash" },
            { value: "shakeX", label: "Shake X" },
            { value: "shakeY", label: "Shake Y" },
            { value: "fadeIn", label: "Fade In" },
            { value: "fadeOut", label: "Fade Out" },
            { value: "zoomIn", label: "Zoom In" },
            { value: "zoomOut", label: "Zoom Out" },
            { value: "flipInX", label: "FlipIn X" },
            { value: "flipOutX", label: "FlipOut X" },
          ],
          mode: "dropdown",
          default: "none",
        },
      },
    },
    {
      name: "departureAnimationDuration",
      selector: {
        number: {
          min: 0,
          max: 5000,
          step: 100,
          default: 100,
          mode: "slider",
        },
      },
    },
  ];

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    if (this._tabs.length === 0) {
      this.addEntity();
    }

    const lang = this.hass.locale?.language;

    const schemaGeneral = this._schemaGeneral(this._config!.showCardHeader);
    const schemaDesign = this._schemaDesign(this.computeLabelCallback, this._config.cardOrientation);
    const schemaLayout = this._schemaLayout(this.computeLabelCallback);
    const schemaAnimation = this._schemaAnimation(this.computeLabelCallback);

    return html`
      <ha-form
        .schema="${schemaGeneral}"
        .data="${this._config}"
        .hass="${this.hass}"
        .computeLabel=${this.computeLabelCallback}
        .computeHelper=${this.computeHelperCallback}
        @value-changed=${this.configChanged}>
      </ha-form>

      <ha-expansion-panel outlined>
        <ha-svg-icon slot="leading-icon" .path=${mdiPalette}></ha-svg-icon>
        <span slot="header">${localize("card.editor.design-expandable", lang)}</span>
        <div style="padding: 16px 0px;">
          <ha-form
            .schema="${schemaDesign}"
            .data="${this._config}"
            .hass="${this.hass}"
            .computeLabel=${this.computeLabelCallback}
            .computeHelper=${this.computeHelperCallback}
            @value-changed=${this.configChanged}></ha-form>
        </div>
      </ha-expansion-panel>

      <ha-expansion-panel outlined>
        <ha-svg-icon slot="leading-icon" .path=${mdiTableRow}></ha-svg-icon>
        <span slot="header">${localize("card.editor.layout-expandable", lang)}</span>
        <div style="padding: 16px 0px;">
          <ha-form
            .schema="${schemaLayout}"
            .data="${this._config}"
            .hass="${this.hass}"
            .computeLabel=${this.computeLabelCallback}
            .computeHelper=${this.computeHelperCallback}
            @value-changed=${this.configChanged}></ha-form>
        </div>
        ${this._config?.cardOrientation == CardOrientation.HORIZONTAL
          ? html`<div class="error">
              <ha-icon icon="mdi:alert"></ha-icon>
              <div>
                ${localize("card.editor.layoutWarning", lang)}:
                <ul>
                  <li><span>${localize("card.editor.layout-cells.planned-time", lang)}</span></li>
                  <li><span>${localize("card.editor.layout-cells.estimated-time", lang)}</span></li>
                  <li><span>${localize("card.editor.layout-cells.delay", lang)}</span></li>
                </ul>
              </div>
            </div>`
          : nothing}
      </ha-expansion-panel>

      <ha-expansion-panel outlined>
        <ha-svg-icon slot="leading-icon" .path=${mdiAnimation}></ha-svg-icon>
        <span slot="header">${localize("card.editor.animation-expandable", lang)}</span>
        <div style="padding: 16px 0px;">
          <ha-form
            .schema="${schemaAnimation}"
            .data="${this._config}"
            .hass="${this.hass}"
            .computeLabel=${this.computeLabelCallback}
            .computeHelper=${this.computeHelperCallback}
            @value-changed=${this.configChanged}></ha-form>
          <div style="padding:0px 10px;">
            <h4>Animation Preview</h4>
            ${this._renderAnimatePreview()}
          </div>
        </div>
      </ha-expansion-panel>

      <ha-expansion-panel outlined>
        <ha-svg-icon slot="leading-icon" .path=${mdiFormatListBulleted}></ha-svg-icon>
        <span slot="header">${localize("card.editor.entities-expandable", lang)}</span>
        <div class="card-config">
          <div class="toolbar">
            <ha-tab-group @wa-tab-show=${this.handleTabChanged}>
              ${this._tabs.map(
                (tab) => html` <ha-tab-group-tab slot="nav" .panel=${tab.index} .active=${this._currTab === tab.index.toString()}> ${tab.index} </ha-tab-group-tab> `,
              )}
            </ha-tab-group>
            <ha-icon-button .path=${mdiPlus} .label=${localize("card.editor.addEntity", lang)} @click=${this.addEntity}></ha-icon-button>
          </div>
          <departures-entity-editor .hass=${this.hass} .data=${this.getTabData()} @onDelete=${this.removeEntity} @onChange=${this.updateEntity}></departures-entity-editor>
        </div>
      </ha-expansion-panel>
    `;
  }

  /**
   * Retrieves the data for the currently selected tab.
   *
   * Converts the current tab identifier (`_currTab`) to a zero-based index,
   * then returns the corresponding tab data from the `_tabs` array if the index is valid.
   *
   * @returns The `EntityTab` data for the selected tab, or `undefined` if the index is out of bounds.
   */
  private getTabData(): EntityTab {
    const index = parseInt(this._currTab) - 1;

    if (index >= 0 && index < this._tabs.length) {
      return this._tabs[index];
    }

    throw Error(`Wrong entity tab index detected: ${index}. Tabs length: ${this._tabs.length}`);
  }

  private computeLabelCallback = (schema: any) => localize(`card.editor.${schema.name}`, this.hass.locale?.language);

  private computeHelperCallback(schema: any) {
    let help_text = localize(`card.editor.help.${schema.name}`, this.hass.locale?.language);

    return !help_text.endsWith(schema.name) ? help_text : undefined;
  }

  private addEntity() {
    if (!this._config) {
      return;
    }

    let newTab = new EntityTab(this._tabs.length + 1, undefined);

    this._tabs = [...this._tabs, newTab];
    this._currTab = `${this._tabs.length}`;

    this.updateEntitiesConfig();
  }

  private removeEntity(ev: Event) {
    if (!this._config) {
      return;
    }

    const index = parseInt(this._currTab) - 1;

    this._tabs.splice(index, 1);
    this.updateEntitiesConfig();

    this._currTab = Math.max(1, index).toString();
  }

  private updateEntity(event: CustomEvent) {
    event.stopPropagation();

    let tab = this.getTabData();

    if (!tab) {
      console.warn("No tab found for config change", this._tabs, this._currTab);
      return;
    }

    tab.config = event.detail;

    this.updateEntitiesConfig();
  }

  private updateEntitiesConfig() {
    const config = { ...this._config };

    config.entities = this._tabs.map((tab) => tab.config);

    fireEvent(this, "config-changed", { config: config });
  }

  private handleTabChanged(event: CustomEvent) {
    const newTab = event.detail.name.toString();

    if (newTab === this._currTab) {
      return;
    }

    this._currTab = newTab;
  }

  private configChanged(event: CustomEvent) {
    event.stopPropagation();

    if (!this._config || !this.hass) {
      return;
    }

    const newConfig = { ...(event.detail.value as Config) } as Config;

    if (this._config?.departureAnimation != newConfig.departureAnimation) {
      this._cancelPreviewAnimations();
    }

    console.log("configChanged", newConfig);

    fireEvent(this, "config-changed", { config: newConfig });
  }

  private _renderAnimatePreview() {
    const theme = this._config?.theme ?? CardTheme.BASIC;
    const animation = this._config?.departureAnimation ?? "none";
    const animateLine = this._config?.animateLine ?? false;
    const icon = !this._config?.departureIcon || this._config?.departureIcon === "" || this._config?.departureIcon == undefined ? "mdi:bus" : this._config?.departureIcon;

    const elLine = this.shadowRoot?.querySelector(".departure-line");
    const elTime = this.shadowRoot?.querySelector(".cell-time-diff");

    let preset: AnimatePreset | undefined = undefined;

    if (animation != "none" && animation in animatePresets) {
      preset = animatePresets[animation];
    } else {
      elTime?.getAnimations().forEach((animation) => {
        animation.cancel();
      });
      elLine?.getAnimations().forEach((animation) => {
        animation.cancel();
      });
    }

    if (preset) {
      const customDuration = this._config?.departureAnimationDuration ?? 0;
      const duration = customDuration != 0 ? customDuration : preset.options?.duration;
      const options = { ...preset.options, duration: duration };

      if (animateLine) {
        elLine?.animate(preset.keyframes, options);
        elTime?.getAnimations().forEach((animation) => {
          animation.cancel();
        });
      } else {
        elTime?.animate(preset.keyframes, options);
        elLine?.getAnimations().forEach((animation) => {
          animation.cancel();
        });
      }
    }

    return html`
      <div class="content">
        <div class="splide-root" id="content-background" theme=${theme}>
          <div class="departure-line arriving delayed" theme=${theme} style="grid-template-columns:50px 1fr 70px 30px; margin-bottom:10px;">
            <div class="cell-line">U1</div>
            <div class="cell-destination">Airport</div>
            <div>
              <div class="cell-time-diff"><ha-icon icon=${icon}></ha-icon></div>
            </div>
            <div><div class="cell-delay delayed" theme=${theme}>+2</div></div>
          </div>
          <div class="departure-line" theme=${theme} style="grid-template-columns:50px 1fr 70px 30px;">
            <div class="cell-line">54</div>
            <div class="cell-destination">Center</div>
            <div class="cell-time-diff">11:23</div>
            <div class="cell-delay" theme=${theme}></div>
          </div>
        </div>
      </div>
    `;
  }

  private _cancelPreviewAnimations() {
    const elLine = this.shadowRoot?.querySelector(".departure-line");
    const elTime = this.shadowRoot?.querySelector(".cell-time-diff");

    elTime?.getAnimations().forEach((animation) => {
      animation.cancel();
    });
    elLine?.getAnimations().forEach((animation) => {
      animation.cancel();
    });
  }
}
