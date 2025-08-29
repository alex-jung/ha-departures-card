import { prepareDate } from './helpers';
import { differenceInMinutes, isPast, isThisMinute, lightFormat } from "date-fns";
import { EntityConfig } from './types';

export enum DepartureTimeMode {
    NONE      = "none",
    TIMESTAMP = "timestamp",
    DIFF      = "diff",
    NOW       = "now",
    PAST      = "past",
}

export class DepartureTime{
    private _delay: number = 0;
    private _realTime: boolean = false;
    private _prefix: string = "";
    private _postfix: string = "";
    private _time: string = "";
    private _mode: DepartureTimeMode = DepartureTimeMode.NONE;
    private _styleMode: string = "dynamic";

    constructor(styleMode:string) 
    {
        if(styleMode == "timestamp"){
            this._styleMode = "timestamp";
        }
        else{
            this._styleMode = "dynamic";
        }
    }

    public updateTime(plannedDepartureTime: Date | null, actualDepartureTime: Date | null) {
        this._realTime = actualDepartureTime ? true: false;

        let tNow = prepareDate(Date());
        let tPlanned = prepareDate(plannedDepartureTime);
        let tActual = prepareDate(actualDepartureTime);
        
        if(!tPlanned) {
            this._updateMode(DepartureTimeMode.NONE);
            return;
        }

        if(!tActual) {
            tActual = tPlanned;
        }

        // calculate delay
        this.delay = differenceInMinutes(tActual, tPlanned);


        if(isThisMinute(tActual)) {
            this._updateMode(DepartureTimeMode.NOW);

            return;
        }

        if(isPast(tActual)) {
            this._updateMode(DepartureTimeMode.PAST);

            return;
        }

        // calculate time to next departure
        const diffMins = tActual && tNow ? differenceInMinutes(tActual, tNow) : 0;
        
        if(this._styleMode == "dynamic")
        {
            if(diffMins >= 60)
                {
                    this._updateMode(DepartureTimeMode.TIMESTAMP, lightFormat(tActual, "HH:mm"));
                }
                else
                {
                    this._updateMode(DepartureTimeMode.DIFF, diffMins.toString());
                }
        }else
        {
            this._updateMode(DepartureTimeMode.TIMESTAMP, lightFormat(tActual, "HH:mm"));
        }

    }

    public _updateMode(mode: DepartureTimeMode, data: string = "") {
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
                this._prefix = "";
                this._postfix = "";
                this._time = "-";
                break;
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

export class EntityTab {
    uuid: string;
    index: number;
    config: EntityConfig;

    constructor(uuid: string, index: number, config: EntityConfig | undefined) {
        this.uuid = uuid;
        this.index = index;

        if (config === undefined) {
            this.config = <EntityConfig>{
                entity: "",
                lineColor: null,
                lineName: null,
                timeStyle: "dynamic",
                destinationName: null,
                nowIcon: null,
            };
        }else
            {
            this.config = config;
        }
        
    }
}