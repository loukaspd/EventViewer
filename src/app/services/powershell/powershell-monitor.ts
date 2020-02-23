import { Observable, defer, interval, Subject } from "rxjs";
import { Event } from "../../types/Event";
import { PowershellCommands } from "./powershell-commands";
import { EventLog } from "../../types/EventLog";
import { Constants } from "../../types/Constants";


export class PowershellMonitor {
    //#region Private Fields
    private readonly __eventLog: EventLog;
    private readonly __subject = new Subject<Event[]>();
    
    private _isDisposed: boolean = false;
    private _lastEvent: Event;
    private _timeout :NodeJS.Timeout;
    //#endregion Private Fields

    //#region Public Api
    
    public observable$: Observable<Event[]> = this.__subject.asObservable();
    constructor(eventLog: EventLog) {
        this.__eventLog = eventLog;
        // this.observable$ = interval(2000).pipe(   //every two seconds
        //     concatMap(() => this._getLogs())
        // );
    }

    public initialize(onlyNewEvents:boolean) :Promise<Event[]> {
        return PowershellCommands.getEvents(this.__eventLog, onlyNewEvents, null)
        .then(events => {
            if (!!events.length) {
                this._lastEvent = events[0];
            }
            
            this._timeout = setTimeout(() => {
                this._getLogs();
            }, Constants.MonitorIntervalMilli);
            return onlyNewEvents ? [] : events;
        });
    }

    public dispose() {
        this._isDisposed = true;
        clearTimeout(this._timeout);
    }

    //#endregion Public Api
    
    
    //#region Implementation

    private _getLogs(): void{
        PowershellCommands.getEvents(this.__eventLog, false, this._lastEvent)
        .then((newEvents :Event[]) => {
            newEvents = newEvents.filter(newLog => !this._lastEvent || newLog.Index > this._lastEvent.Index);
            if (newEvents.length > 0) {
                this._lastEvent = newEvents[0];
                this.__subject.next(newEvents);
            }
            
            if(this._isDisposed) return;
            
            this._timeout = setTimeout(() => {
                this._getLogs();
            }, Constants.MonitorIntervalMilli);
        });
    }
    //#endregion Implmenetation
}