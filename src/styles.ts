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
    grid-template-columns: auto auto 1fr auto 40px;
    align-items: center;
    column-gap: 5px;
    justify-content: center;
    width: 100%;
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
    justify-self: center;
    padding: 0px 10px;
  }
  .cell-time {
    width: 100%;
    text-align: center;
  }
  .cell-delay {
    justify-self: center;
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
    display: grid;
    grid-template-columns: auto auto 1fr 50px 30px;
    align-items: center;
    column-gap: 5px;
    justify-content: center;
    padding: 5px;
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
    font-size: 1.2em;
    font-weight: bold;
  }
  .cell-destination {
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  .departure-line {
    display: grid;
    grid-template-columns: auto auto 1fr 60px 30px;
    align-items: center;
    column-gap: 5px;
    justify-content: center;
    padding: 5px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  }
  .cell-time {
    width: 100%;
    text-align: center;
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
    display: grid;
    grid-template-columns: auto 1fr 60px 30px;
    align-items: center;
    column-gap: 5px;
    justify-content: center;
    width: 100%;
    border-left: 5px solid grey;
    background-color: #f5efe6;
    color: #6f4e37;
  }
  .cell-delay {
    justify-content: center;
    margin: 0px 10px;
  }
`;
export const contenBlueSky = css`
  .splide-root {
    padding: 10px;
    background-color: #0d2f55;
    color: white;
  }
  .departure-line {
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    column-gap: 5px;
    width: 100%;
  }
  .departure-line.arriving {
    animation: flash 2s ease-in-out infinite;
  }
  .cell-line {
    border-bottom: 1px solid white;
    padding: 0px 0px 3px 0px;
    text-align: center;
  }
  .cell-destination {
    border-bottom: 1px solid white;
    padding-bottom: 3px;
  }
  .cell-time {
    border-bottom: 1px solid white;
    padding-bottom: 3px;
  }
  .cell-estimated-time {
    border-bottom: 1px solid white;
  }
  .cell-estimated-time > div {
    padding: 0px 5px;
    margin-bottom: 3px;
    background: lightgray;
    color: black;
  }

  .cell-estimated-time.delayed > div {
    color: var(--departures-delay-bad);
  }
  .cell-estimated-time.earlier > div {
    color: var(--departures-delay-ok);
  }
`;
