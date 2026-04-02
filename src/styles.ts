import { css } from "lit";

export const cardStyles = css`
  :host {
    --departures-bg: #363636;
    --departures-delay-ok: #23a043;
    --departures-delay-bad: #f44336;
    --departures-delay-none: #252525;
    --departures-border-color: lightgrey;
  }
  ha-card {
    display: block;
    height: auto;
    width: 100%;
    overflow: hidden;
  }
  .card-header {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    font-size: 2em;
    padding-bottom: 8px;
  }
`;
export const contentCore = css`
  .cell-alert-badge {
    display: inline-flex;
    align-items: center;
    color: #e65100;
    flex-shrink: 0;
    margin-left: 4px;
  }
  .cell-alert-badge ha-icon {
    --mdc-icon-size: 20px;
  }
  .list-header-content,
  .departure-line {
    display: grid;
    column-gap: 5px;
    padding: 5px 5px;
    align-items: end;
    margin: 0px 2px;
    justify-content: space-between;
  }
  .list-header-content {
    font-size: 0.8em;
    font-weight: bold;
  }
  .list-header-icon,
  .cell-transport-icon {
    text-align: center;
  }
  .list-header-line,
  .cell-line {
    text-align: center;
    padding: 0px 5px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .list-header-destination,
  .cell-destination {
    flex-grow: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
    min-width: 0;
  }
  .cell-destination-label {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    min-width: 0;
  }
  .list-header-time-diff,
  .cell-time-diff {
    text-align: center;
  }
  .list-header-planned-time,
  .cell-planned-time {
    text-align: center;
  }
  .list-header-estimated-time,
  .cell-estimated-time {
    text-align: center;
  }
  .list-header-delay,
  .cell-delay {
    width: 100%;
    text-align: center;
    border-radius: 1000px;
  }
  .cell-station-name {
    text-align: center;
  }
  .cell-delay {
    color: white;
  }
  .cell-delay.delayed {
    background-color: var(--departures-delay-bad);
  }
  .cell-delay.earlier {
    background-color: var(--departures-delay-ok);
  }
  .error {
    display: grid;
    grid-template-columns: 30px 1fr;
    border-left: 5px solid red;
    border: 1px solid red;
    padding: 5px;
    margin: 5px 0px;
    align-items: center;
  }
  .error span {
    font-weight: 500;
  }

  #content-background {
    border-radius: 5px;
  }
  .splide__slide {
    align-items: center;
    background-color: transparent;
  }

  /* Basic theme */
  #content-background[theme="basic"] {
    background-color: transparent;
  }
  .departure-line[theme="basic"] {
    border-radius: 3px;
    border: 1px solid var(--departures-border-color);
  }
  .cell-line[theme="basic"] {
    border-radius: 3px;
    background-color: var(--cell-line-background);
  }

  /* Black-White theme */
  #content-background[theme="black-white"] {
    border-radius: 6px;
    background-color: #000000;
    color: white;
    font-family: "Roboto Mono", monospace;
  }
  .departure-line[theme="black-white"] {
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  }
  .cell-line[theme="black-white"] {
    font-weight: bold;
    color: white;
  }
  .cell-destination[theme="black-white"] {
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  /* Cappucino theme */
  #content-background[theme="cappucino"] {
    color: white;
  }
  .list-header-content[theme="cappucino"] {
    border-left: 8px solid transparent;
  }
  .cell-line[theme="cappucino"] {
    font-weight: bold;
  }
  .departure-line[theme="cappucino"],
  .table-row[theme="cappucino"] {
    background-color: #f5efe6;
    color: #6f4e37;
  }
  .cell-delay[theme="cappucino"] {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Dark theme */
  #content-background[theme="dark"] {
    background-color: #1e1e2e;
    color: #cdd6f4;
    border-radius: 8px;
  }
  .departure-line[theme="dark"] {
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .cell-line[theme="dark"] {
    border-radius: 4px;
    font-weight: bold;
  }
  .cell-time-diff[theme="dark"] {
    font-weight: bold;
    color: #cba6f7;
  }
  .cell-delay[theme="dark"] {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Forest theme */
  #content-background[theme="forest"] {
    color: #33691e;
  }
  .list-header-content[theme="forest"] {
    border-left: 8px solid transparent;
  }
  .cell-line[theme="forest"] {
    font-weight: bold;
  }
  .departure-line[theme="forest"],
  .table-row[theme="forest"] {
    background-color: #f1f8e9;
    color: #33691e;
  }
  .cell-delay[theme="forest"] {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Mint theme */
  #content-background[theme="mint"] {
    color: #004d40;
  }
  .list-header-content[theme="mint"] {
    border-left: 8px solid transparent;
  }
  .cell-line[theme="mint"] {
    font-weight: bold;
  }
  .departure-line[theme="mint"],
  .table-row[theme="mint"] {
    background-color: #e0f2f1;
    color: #00695c;
  }
  .cell-delay[theme="mint"] {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Nord theme */
  #content-background[theme="nord"] {
    background-color: #2e3440;
    color: #eceff4;
    border-radius: 8px;
  }
  .departure-line[theme="nord"] {
    border-bottom: 1px solid rgba(236, 239, 244, 0.1);
  }
  .cell-line[theme="nord"] {
    border-radius: 4px;
    font-weight: bold;
  }
  .cell-time-diff[theme="nord"] {
    font-weight: bold;
    color: #88c0d0;
  }
  .cell-delay[theme="nord"] {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Sunset theme */
  #content-background[theme="sunset"] {
    background-color: #1c0f07;
    color: #ffe0b2;
    border-radius: 8px;
  }
  .list-header-content[theme="sunset"] {
    border-left: 8px solid transparent;
  }
  .departure-line[theme="sunset"],
  .table-row[theme="sunset"] {
    background-color: rgba(255, 140, 0, 0.07);
    border-bottom: 1px solid rgba(255, 140, 0, 0.18);
  }
  .cell-line[theme="sunset"] {
    font-weight: bold;
  }
  .cell-time-diff[theme="sunset"] {
    font-weight: bold;
    color: #ffb300;
  }
  .cell-delay[theme="sunset"] {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Blue Ocean theme */
  #content-background[theme="blue-ocean"] {
    background-color: #0d2f55;
    color: white;
  }
  .departure-line[theme="blue-ocean"] > div,
  .table-row[theme="blue-ocean"] > div {
    border-bottom: 1px solid white;
    padding-bottom: 3px;
  }
  .cell-line[theme="blue-ocean"] {
    padding: 0px;
  }
  .cell-estimated-time[theme="blue-ocean"] > div {
    background: lightgray;
    color: black;
  }
  .cell-estimated-time[theme="blue-ocean"].delayed {
    color: var(--departures-delay-bad);
  }
  .cell-estimated-time[theme="blue-ocean"].earlier {
    color: var(--departures-delay-ok);
  }
  .cell-delay[theme="blue-ocean"] {
    border-radius: 0;
  }
`;
