import { css } from "lit";

export const cardStyles = css`
  .content[data-theme="dark"] {
    --departures-bg: #363636;
    --departures-text: #cccccc;
    --departures-delay-ok: #23a043;
    --departures-delay-bad: #f44336;
    --departures-delay-none: #252525;
    --departures-border-color: lightgrey;
  }
  .content[data-theme="light"] {
    --departures-bg: #ffffff;
    --departures-text: #222;
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
  }
  .content {
    padding: 16px 0px;
  }
`;

export const contentCore = css`
  .splide-root {
    border-radius: 5px;
    background: var(--departures-bg);
    color: var(--departures-text);
  }
  .departure-line {
    display: grid;
    column-gap: 5px;
    width: 100%;
    padding: 5px;
  }
  .splide__slide {
    display: flex;
    align-items: center;
  }
  .departure-line.arriving {
    animation: flash 2s ease-in-out infinite;
  }
  .departure-line.delayed > .cell-delay {
    color: var(--departures-delay-bad);
  }
  .cell-destination {
    flex-grow: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .cell-line {
    text-align: center;
  }
  .cell-time-diff {
    text-align: center;
  }
  .cell-planned-time {
    text-align: center;
  }
  .cell-estimated-time {
    text-align: center;
  }
  .cell-delay {
    width: 100%;
    text-align: center;
  }
  .error {
    display: grid;
    grid-template-columns: 30px 1fr;
    border-left: 5px solid red;
    border: 1px solid red;
    padding: 5px;
    margin: 10px 0px;
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
export const contentBasic = css`
  .splide-root {
    background-color: transparent;
  }
  .cell-line {
    border-radius: 10px;
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
  .cell-time-diff {
    min-width: 55px;
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
    font-size: 1.2em;
    font-weight: bold;
  }
  .departure-line {
    border-left: 5px solid grey;
    background-color: #f5efe6;
    color: #6f4e37;
  }
  .cell-delay {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
export const contenBlueSky = css`
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
`;
