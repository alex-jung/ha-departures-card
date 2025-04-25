import { css } from 'lit';

export const cardStyles = css`
    ha-card {
        display: block;
        height: auto;
        width: 100%;
        cursor: pointer;
        overflow: hidden;
    }
    .card-header {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;
        font-size: 2em;
    }
    .cell-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
    }
    .cell-line {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 70px;
    }
    .cell-destination {
        display: flex;
        flex: 2;
        white-space: nowrap;
    }
    .line-number {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 5px;
        border-radius: 5px;
        width: 100%;
        height: 25px;
        font-size: 1.2em;
        font-weight: bold;
    }
    @media (min-width: 600px) and (min-height: 501px) {
      ha-dialog {
        --mdc-dialog-min-width: 650px !important;
        --mdc-dialog-max-width: 100vw !important;
      }
    }
    `;