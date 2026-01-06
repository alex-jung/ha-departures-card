import { customElement } from "lit/decorators.js";
import { Content } from "./content";
import { html, nothing, TemplateResult } from "lit";
import { DeparturesDataRow } from "../types";
import { contentTable } from "../styles";
import { groupBy } from "lodash";
import { DepartureTime } from "../data/departure-time";
import { lightFormat } from "date-fns";
import { classMap } from "lit/directives/class-map.js";
import { DEFAULT_ENTITY_ICON } from "../constants";
import { getContrastTextColor } from "../helpers";
import { styleMap } from "lit/directives/style-map.js";

@customElement("card-content-table")
export class ContentTable extends Content {
  static styles = [Content.styles, contentTable];

  public renderContent() {
    let mapDepartures = new Map(Object.entries(groupBy(this.departures || [], "entity")));
    let contentRows: Array<TemplateResult> = [];

    this.cardConfig?.entities?.forEach((entity) => {
      const departures = mapDepartures.get(entity.entity);

      if (departures) {
        contentRows.push(this._renderRow(departures));
      }
    });

    return html`<div class="table-content">${contentRows}</div>`;
  }

  protected renderCellLineName(departure: DeparturesDataRow): TemplateResult {
    const contrastTextColor = getContrastTextColor(departure.lineColor ?? "#ffffff");

    const styles = {
      backgroundColor: departure.lineColor,
      color: departure.lineColor ? contrastTextColor : "",
    };

    return html`<div class="cell-line" style="${styleMap(styles)}">${departure.lineName}</div>`;
  }

  private _renderRow(row: Array<DeparturesDataRow>): TemplateResult {
    if (!row) {
      return html``;
    }

    const times = row.map((dataRow) => dataRow.time);
    const departure = row[0];
    const icon = departure.icon;

    return html`
      <div class="table-row">
        ${this.renderTransportIcon(departure)}${this.renderCellLineName(departure)}${this.renderCellDestination(departure)}${this._renderTimes(times, icon)}
      </div>
    `;
  }

  private _renderTimes(times: Array<DepartureTime>, icon: string | null): TemplateResult {
    let slicedTimes = times.slice(0, this.cardConfig.departuresToShow);

    return html`<div class="table-times">${slicedTimes.map((time) => this._renderTime(time, icon))}</div>`;
  }

  private _renderTime(time: DepartureTime, icon: string | null): TemplateResult {
    let htmlDelay: TemplateResult = html``;
    let strDelay: string = "";
    const htmlIcon = icon ?? DEFAULT_ENTITY_ICON;

    let classes = {
      timestamp: time.timeDiff > 60,
      arriving: false,
      delayed: time.isDelayed,
    };

    if (time.isDelayed) {
      strDelay = `+${time.delay}`;
    } else if (time.isEarlier) {
      strDelay = `-${time.delay}`;
    }

    if (time.isArriving) {
      classes.arriving = true;
      htmlDelay = html`<ha-icon icon=${htmlIcon}></ha-icon>`;
    } else if (time.timeDiff > 60) {
      htmlDelay = html`${lightFormat(time.time, "HH:mm")}`;
    } else {
      htmlDelay = html`${time.timeDiff} min`;
    }

    return html`<div class="table-time ${classMap(classes)}">
      <div class="table-time-diff">${htmlDelay}</div>
      ${time.isArriving || !time.delay ? nothing : html`<div class="table-time-delay">${strDelay}</div>`}
    </div>`;
  }
}
