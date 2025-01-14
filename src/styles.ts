import { css } from 'lit';

export const cardStyles = css`
    ha-card {
        display: block;
        height: auto;
        padding: 16px;
    }
    card-header {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
    }
    .card-title {
        font-size: 2em;
    }
    .table-header {
        display: flex;
        padding-top: 20px;
        flex-wrap: nowrap;
        justify-content: space-between;
    }
    .cell-line {
        display: flex;
        align-items: center;
        width: 70px;
    }
    .cell-destination {
        display: flex;
        align-items: left;
        flex: 2;
    }
    .line-number {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 5px;
        border-radius: 5px;
        width: 130px;
        height: 25px;
        font-size: 1.2em;
        font-weight: bold;
        background: none;
    }
    .delay {
        color: limegreen;
    }
    .delay[delayed] {
        color: #F72C5B;
    }
    `;