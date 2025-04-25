export enum DepartureTimeMode {
    NONE      = "none",
    TIMESTAMP = "timestamp",
    DIFF      = "diff",
    NOW       = "now",
    PAST      = "past",
}

export class DepartureTime{
    private _delay: number;
    private _realTime: boolean;
    private _prefix: string;
    private _postfix: string;
    private _time: string;
    private _mode: DepartureTimeMode = DepartureTimeMode.NONE;

    constructor(realTime:boolean) {
        this._realTime = realTime;
        this._delay = 0;
        this._time = "-"
        this._prefix = "";
        this._postfix = "";
    }

    public updateTime(mode: DepartureTimeMode, data: string = "") {
        this._mode = mode;

        switch(mode) {
            case DepartureTimeMode.TIMESTAMP:
                this._prefix = "";
                this._postfix = "";
                this._time = data;
                break;
            case DepartureTimeMode.DIFF:
                this._prefix = "in";
                this._postfix = "min";
                this._time = data;
                break;
            case DepartureTimeMode.NOW:
                this._prefix = "";
                this._postfix = "";
                this._time = "Now";
                break;
            case DepartureTimeMode.NONE:
            case DepartureTimeMode.PAST:
                this._prefix = "";
                this._postfix = "";
                this._time = "...";
                break;
            default:
                console.warn("Unknown mode", mode);
        }
    }

    set delay(value: number) {
        this._delay = value;
    }
    get mode(): DepartureTimeMode {
        return this._mode;
    }
    get delay(): number {
        return this._delay;
    }
    get realTime(): boolean {
        return this._realTime;
    }
    get prefix(): string {
        return this._prefix;
    }
    get postfix(): string {
        return this._postfix;
    }
    get time(): string {
        return this._time;
    }
}