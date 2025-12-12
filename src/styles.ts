import { css } from "lit";

export const cardStyles = css`
  .content[data-theme="dark"] {
    --departures-bg: #363636;
    --departures-text: #cccccc;
    --departures-delay-ok: #4caf50;
    --departures-delay-bad: #f44336;
  }
  .content[data-theme="light"] {
    --departures-bg: #ffffff;
    --departures-text: #222;
    --departures-delay-ok: #4caf50;
    --departures-delay-bad: #f44336;
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
  .departure-line.arriving > * {
    animation: flash 2s ease-in-out infinite;
  }
  .departure-line.delayed > .cell-delay {
    color: var(--departures-delay-bad);
  }
  .cell-transport-icon {
    padding: 0px 5px;
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
    justify-self: center;
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
  .splide {
    color: white;
  }
  .cell-line {
    text-transform: uppercase;
    border-radius: 10px;
  }
  .departure-line {
    display: grid;
    grid-template-columns: auto auto 1fr 60px 40px;
    align-items: center;
    column-gap: 5px;
    justify-content: center;
    padding: 5px;
    border-radius: 5px;
    background: #002b55;
  }
  .cell-time {
    background-color: lightgrey;
    width: 100%;
    text-align: center;
    color: black;
  }
`;
export const contentBlackWhite = css`
  .splide-root {
    padding: 10px;
    border-radius: 6px;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  .splide {
    font-family: "Roboto Mono", monospace;
  }
  .cell-line {
    text-transform: uppercase;
  }
  .departure-line {
    display: grid;
    grid-template-columns: auto auto 1fr auto 40px;
    align-items: center;
    column-gap: 5px;
    justify-content: center;
    padding: 5px;
    background: #f8f8f8;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  }
`;
export const contentCappucino = css``;
