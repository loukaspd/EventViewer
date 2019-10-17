import { Observable, defer, interval } from "rxjs";
import {concatMap} from 'rxjs/operators'
import { Event } from "../../types/Event";
import { PowershellCommands } from "./powershell-commands";

export class PowershellMonitor {
    private _logName: string;


    constructor(logName: string) {
        this._logName = logName;
        this.observable$ = interval(1000).pipe(   //every one second
            concatMap(() => this._getLogs())
        );
    }
    
    public allLogs: Event[] = [];
    public observable$: Observable<Event[]>;
    
    //#region Implementation

    private _getLogs(): Observable<Event[]> {        
        const logsPromise: Promise<Event[]> = 
        PowershellCommands.getEvents(this._logName
        ,this.allLogs.length ? this.allLogs[0].originalTimeString : undefined)
        .then((newLogs:Event[]) => {
            if (!(newLogs || []).length) return [];

            const lastIndex = this.allLogs.length ? this.allLogs[0].Index : -1;
            newLogs = newLogs.filter(newLog => newLog.Index > lastIndex);
            this.allLogs = [...newLogs, ...this.allLogs];
            return newLogs;
        });
        
        return defer(() => logsPromise);
    }
    //#endregion Implmenetation
}