import { Observable, defer, interval } from "rxjs";
import {concatMap} from 'rxjs/operators'
import { Event } from "../../types/Event";
import { PowershellCommands, GetEventsParams } from "./powershell-commands";
import { EventFiltersVm } from "../../types/viewmodels/EventFiltersVm";
import { EventLog } from "../../types/EventLog";

export class PowershellMonitor {
    private _eventLog: EventLog;
    private _filters: EventFiltersVm;

    constructor(eventLog: EventLog, filters:EventFiltersVm) {
        this._eventLog = eventLog;
        this._filters = filters;
        this.observable$ = interval(1000).pipe(   //every one second
            concatMap(() => this._getLogs())
        );
    }
    
    private _lastEvent: Event;
    public observable$: Observable<Event[]>;
    
    //#region Implementation

    private _getLogs(): Observable<Event[]> {
        const logsPromise: Promise<Event[]> = 
        PowershellCommands.getEvents(new GetEventsParams(this._eventLog, this._filters)
        ,this._lastEvent ? this._lastEvent.originalTimeString : undefined
        , this._lastEvent ? undefined : 1)
        .then((newLogs:Event[]) => {
            if (!(newLogs || []).length) return [];

            if (!this._lastEvent) {
                this._lastEvent = newLogs[0];
                return [];
            }

            newLogs = newLogs.filter(newLog => newLog.Index > this._lastEvent.Index);
            this._lastEvent = newLogs[0];
            return newLogs;
        });
        
        return defer(() => logsPromise);
    }
    //#endregion Implmenetation
}