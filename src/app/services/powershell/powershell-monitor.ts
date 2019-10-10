import { Observable, defer, interval } from "rxjs";
import {concatMap} from 'rxjs/operators'
import { Event } from "../../types/Event";
import Shell from 'node-powershell'; 
import { PowershellCommands } from "./powershell-commands";

export class PowershellMonitor {
    private _logName: string;
    private _ps: Shell;


    constructor(logName: string) {
        this._ps = new Shell({
            executionPolicy: 'Bypass',
            noProfile: true
        });
        this._logName = logName;
        this.observable$ = interval(1000).pipe(   //every one second
            concatMap(() => this._getLogs())
        );
    }
    
    public allLogs: Event[] = [];
    public observable$: Observable<Event[]>;
    
    //#region Implementation
    private _getLogs(): Observable<Event[]> {
        let command = `Get-EventLog -LogName "${this._logName}"`;
        if (this.allLogs.length > 0) {
            command += ` -After "${this.allLogs[0].originalTimeString}"`;
        }
        command += ' ' + PowershellCommands.selectEvent;
        
        const logsPromise: Promise<Event[]> = this._ps.addCommand(command)
        .then(() => this._ps.invoke())
        .then(output => PowershellCommands.parseEventsCommandOutput(output))
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