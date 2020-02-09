import { Observable, defer, interval, Subject } from "rxjs";
import { Event } from "../../types/Event";
import { PowershellCommands } from "./powershell-commands";
import { EventLog } from "../../types/EventLog";
import { Constants } from "../../types/Constants";


export class PowershellMonitor {
    //#region Private Fields
    private _eventLog: EventLog;
    private _lastEvent: Event;
    private _subject = new Subject<Event[]>();
    private _timeout :NodeJS.Timeout;
    //#endregion Private Fields

    //#region Public Api
    
    public observable$: Observable<Event[]> = this._subject.asObservable();
    constructor(eventLog: EventLog) {
        this._eventLog = eventLog;
        // this.observable$ = interval(2000).pipe(   //every two seconds
        //     concatMap(() => this._getLogs())
        // );
    }

    public initialize() :Promise<Event[]> {
        return PowershellCommands.getEvents(this._eventLog,null)
        .then(events => {
            this._lastEvent = events[0];
            this._timeout = setTimeout(() => {
                this._getLogs();
            }, Constants.MonitorIntervalMilli);
            return events;
        });
    }

    public dispose() {
        clearTimeout(this._timeout);
    }

    //#endregion Public Api
    
    
    //#region Implementation

    private _getLogs(): void{
        PowershellCommands.getEvents(this._eventLog, this._lastEvent)
        .then((newEvents :Event[]) => {
            newEvents = newEvents.filter(newLog => newLog.Index > this._lastEvent.Index);
            if (newEvents.length > 0) {
                this._lastEvent = newEvents[0];
                this._subject.next(newEvents);
            }
            
            
            this._timeout = setTimeout(() => {
                this._getLogs();
            }, Constants.MonitorIntervalMilli);
        });
    }
    //#endregion Implmenetation
}