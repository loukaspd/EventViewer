import { Observable, defer, interval } from "rxjs";
import {concatMap} from 'rxjs/operators'
import { Event } from "../../types/Event";
import Shell from 'node-powershell'; 
import { PowershellCommands } from "./powershell-commands";

export class PowershellMonitor {
    private _logName: string;
    private _ps: Shell;
    private _commandExecutor(command:string): Promise<string> {
        return this._ps.addCommand(command)
        .then(() => this._ps.invoke())
        .catch(e => {
            console.log(e);
            this._initShell();
            return '';
        });
    }


    constructor(logName: string) {
        this._initShell();
        this._logName = logName;
        this.observable$ = interval(1000).pipe(   //every one second
            concatMap(() => this._getLogs())
        );
    }
    
    public allLogs: Event[] = [];
    public observable$: Observable<Event[]>;
    
    //#region Implementation
    private _initShell(): void {
        this._ps = new Shell({
            executionPolicy: 'Bypass',
            noProfile: true
        });
    }

    private _getLogs(): Observable<Event[]> {        
        const logsPromise: Promise<Event[]> = 
        PowershellCommands.getEvents((command:string) => this._commandExecutor(command)
        ,this._logName
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