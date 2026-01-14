import { customElement } from "lit/decorators.js";
import { Content } from "./content";
import { css, html, nothing, TemplateResult } from "lit";
import { CardOrientation, CardTheme, DeparturesDataRow, LayoutCell } from "../types";
import { groupBy } from "lodash";
import { DepartureTime } from "../data/departure-time";
import { lightFormat } from "date-fns";
import { classMap } from "lit/directives/class-map.js";
import { DEFAULT_ENTITY_ICON } from "../constants";
import { Layout } from "../data/layout";
import { styleMap } from "lit/directives/style-map.js";

@customElement("card-content-table")
export class ContentTable extends Content {
  static styles = [
    Content.styles,
    css`
      .table-content {
        display: flex;
        flex-direction: column;
      }
      .table-row {
        display: grid;
        align-items: stretch;
        column-gap: 5px;
        padding: 10px 5px;
        margin: 5px 0px;
      }
      .table-times {
        display: flex;
        justify-content: flex-end;
        gap: 5px;
      }
      .table-time {
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-end;
        min-width: 50px;
        position: relative;
      }
      .table-time-diff {
        align-self: center;
      }
      .table-time-delay {
        position: absolute;
        top: -13px;
        right: 0px;
        text-align: right;
        font-size: 0.8em;
        border-radius: 3px;
        height: 16px;
        padding: 0px 3px;
        color: white;
      }
      .table-time.earlier > .table-time-delay {
        background-color: var(--departures-delay-ok);
      }
      .table-time.delayed > .table-time-delay {
        background-color: var(--departures-delay-bad);
      }
      @media (min-width: 100px) and (max-width: 500px) {
        .list-header {
          display: none;
        }
        .table-row {
          display: flex;
          gap: 10px;
          flex-direction: row;
          flex-wrap: wrap;
          height: auto;
          margin-bottom: 10px;
        }
        .cell-transport-icon {
          display: none;
        }
        .cell-line {
          font-weight: bold;
          background-color: none;
        }
        .cell-destination {
          display: flex;
          overflow: visible;
        }
        .table-times {
          display: flex;
          width: 100%;
          justify-content: flex-start;
          flex-direction: row;
          flex-wrap: wrap;
          align-content: center;
          align-items: center;
          background-color: rgba(218 215 205 / 20%);
        }
      }
    `,
  ];

  protected createLayout(): Layout {
    return new Layout(this.cardConfig.layout, CardOrientation.HORIZONTAL);
  }

  public renderContent() {
    let mapDepartures = new Map(Object.entries(groupBy(this.departures || [], "entity")));
    let contentRows: Array<TemplateResult> = [];

    if (this.cardConfig.sortDepartures == false) {
      this.cardConfig?.entities?.forEach((entity) => {
        const departures = mapDepartures.get(entity.entity);

        if (departures) {
          contentRows.push(this._renderRow(departures));
        }
      });
    } else {
      mapDepartures.forEach((departures) => {
        contentRows.push(this._renderRow(departures));
      });
    }

    return html`<div class="table-content" id="content-background" theme="${this.theme}">${this.renderListHeader()}${contentRows}</div>`;
  }

  protected getQueryLineElements(): string {
    return ".table-row";
  }

  protected getQueryTimeElements(): string {
    return ".table-time";
  }

  private _renderRow(row: Array<DeparturesDataRow>): TemplateResult {
    if (!row) {
      return html``;
    }

    let layoutCells = this.layout?.getCells();

    if (!layoutCells) {
      return html`Please define layout!`;
    }

    let content: Array<TemplateResult> = [];

    let styles = {
      "grid-template-columns": this.layout?.getColumns(),
      borderLeft: "none",
    };
    let classes = {
      arriving: row.some((data) => {
        return data.time.isArriving(this.cardConfig.arrivalTimeOffset);
      }),
    };

    const times = row.map((dataRow) => dataRow.time);
    const departure = row[0];
    const icon = this.getDepartureIcon() ?? departure.icon ?? DEFAULT_ENTITY_ICON;

    layoutCells.forEach((cell) => {
      switch (cell) {
        case LayoutCell.ICON:
          content.push(this.renderTransportIcon(departure));
          break;
        case LayoutCell.LINE:
          content.push(this.renderCellLineName(departure));
          break;
        case LayoutCell.DESTINATION:
          content.push(this.renderCellDestination(departure));
          break;
        case LayoutCell.TIME_DIFF:
          content.push(this._renderTimes(times, icon));
          break;
      }
    });

    switch (this.theme) {
      case CardTheme.CAPPUCINO:
        styles = { ...styles, borderLeft: `8px solid ${departure.lineColor ?? ""}` };
    }

    return html` <div class="table-row ${classMap(classes)}" theme=${this.cardConfig.theme} style=${styleMap(styles)}>${content}</div> `;
  }

  private _renderTimes(times: Array<DepartureTime>, icon: string | null): TemplateResult {
    let slicedTimes = times.slice(0, this.cardConfig.departuresToShow);

    return html`<div class="table-times">${slicedTimes.map((time) => this._renderTime(time, icon))}</div>`;
  }

  private _renderTime(time: DepartureTime, icon: string | null): TemplateResult {
    let htmlDelay: TemplateResult = html``;
    let strDelay: string = "";

    const htmlIcon = icon ?? DEFAULT_ENTITY_ICON;
    const arriving = time.isArriving(this.cardConfig.arrivalTimeOffset);

    let classes = {
      timestamp: time.timeDiff > 60,
      arriving: arriving,
      delayed: time.isDelayed,
      earlier: time.isEarlier,
    };

    if (time.isDelayed) {
      strDelay = `+${time.delay}`;
    } else if (time.isEarlier) {
      strDelay = `${time.delay}`;
    }

    if (time.timeDiff == 0) {
      htmlDelay = html`<ha-icon icon=${htmlIcon}></ha-icon>`;
    } else if (time.timeDiff > 60) {
      htmlDelay = html`${lightFormat(time.time, "HH:mm")}`;
    } else {
      htmlDelay = html`${time.timeDiff} min`;
    }

    return html`<div class="table-time ${classMap(classes)}">
      <div class="table-time-diff">${htmlDelay}</div>
      ${arriving || !time.delay ? nothing : html`<div class="table-time-delay">${strDelay}</div>`}
    </div>`;
  }
}
