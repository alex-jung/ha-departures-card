import { css } from "lit";

export const cardStyles = css`
  .content[data-theme="dark"] {
    --departures-bg: #363636;
    --departures-delay-ok: #23a043;
    --departures-delay-bad: #f44336;
    --departures-delay-none: #252525;
    --departures-border-color: lightgrey;
  }
  .content[data-theme="light"] {
    --departures-bg: #ffffff;
    --departures-delay-ok: #23a043;
    --departures-delay-bad: #f44336;
    --departures-delay-none: #6b6b6b;
    --departures-border-color: darkgrey;
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
  .list-header,
  .departure-line {
    display: grid;
    column-gap: 5px;
    width: 100%;
    padding: 5px 5px;
  }
  .list-header {
    font-size: 0.8em;
    font-weight: bold;
    width: 98%;
  }
  .list-header-icon,
  .cell-transport-icon {
    text-align: center;
  }
  .list-header-line,
  .cell-line {
    text-align: center;
    min-width: 40px;
    padding: 0px 5px;
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
  .departure-line.arriving {
    animation: flash 2s ease-in-out infinite;
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
  .departure-line.delayed .cell-delay {
    background-color: var(--departures-delay-bad);
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

  @keyframes flash {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
`;
export const scrollableContent = css`
  .splide-root {
    border-radius: 5px;
    background: var(--departures-bg);
    color: var(--departures-text);
  }
  .splide__slide {
    display: flex;
    align-items: center;
  }
`;
export const contentBasic = css`
  .splide-root {
    background-color: transparent;
  }
  .cell-line {
    border-radius: 3px;
  }
  .departure-line {
    border-radius: 3px;
    border: 1px solid var(--departures-border-color);
  }
`;
export const contentBlackWhite = css`
  .splide-root {
    padding: 10px;
    border-radius: 6px;
    background-color: #000000;
    color: white;
    font-family: "Roboto Mono", monospace;
  }
  .cell-line {
    font-weight: bold;
  }
  .cell-destination {
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  .departure-line {
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  }
`;
export const contentCappucino = css`
  .splide-root {
    background-color: transparent;
  }
  .cell-line {
    font-weight: bold;
  }
  .departure-line {
    background-color: #f5efe6;
    color: #6f4e37;
  }
  .cell-delay {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
export const contenBlueOcean = css`
  .splide-root {
    padding: 10px;
    background-color: #0d2f55;
    color: white;
  }
  .departure-line.arriving {
    animation: flash 2s ease-in-out infinite;
  }
  .departure-line > div {
    padding-bottom: 3px;
    border-bottom: 1px solid white;
  }
  .cell-line {
    padding: 0px;
  }
  .cell-estimated-time > div {
    background: lightgray;
    color: black;
  }
  .cell-estimated-time.delayed {
    color: var(--departures-delay-bad);
  }
  .cell-estimated-time.earlier {
    color: var(--departures-delay-ok);
  }
  .cell-delay {
    border-radius: 0;
  }
`;
export const contentTable = css`
  .table-content {
    display: flex;
    flex-direction: column;
  }
  .table-row {
    display: flex;
    align-items: center;
    height: 40px;
    gap: 5px;
  }
  .cell-line {
    text-align: center;
    min-width: 40px;
    border-radius: 5px;
    font-weight: bold;
  }
  .cell-destination {
    display: flex;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    flex-grow: 2;
    font-weight: bold;
  }
  .table-times {
    display: flex;
  }
  .table-time {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-end;
    margin: 5px 5px;
    min-width: 50px;
    position: relative;
  }
  .table-time.arriving {
    justify-content: center;
  }
  .table-time-diff {
    align-self: end;
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
    background-color: var(--departures-delay-ok);
  }
  .table-time.delayed > .table-time-delay {
    background-color: var(--departures-delay-bad);
  }

  @media (min-width: 100px) and (max-width: 500px) {
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
`;
