import { css } from "lit";

export const cardStyles = css`
  .content {
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
  .content {
    padding: 0px 0px;
  }
`;
export const contentCore = css`
  .list-header-content,
  .departure-line {
    display: grid;
    column-gap: 5px;
    padding: 5px 5px;
    align-items: end;
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
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
  .cell-delay {
    width: 100%;
    text-align: center;
    border-radius: 1000px;
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
    background: var(--departures-bg);
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
    padding: 8px;
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
    padding: 10px;
    color: white;
  }
  .list-header-content[theme="cappucino"] {
    padding-left: 13px; // 5px standard + 8px left color border!
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

  /* Blue Ocean theme */
  #content-background[theme="blue-ocean"] {
    padding: 10px;
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
