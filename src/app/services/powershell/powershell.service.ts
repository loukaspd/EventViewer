import { Injectable } from '@angular/core';
import Shell from 'node-powershell'; 
import { EventLog } from '../../types/EventLog';
import { Event } from '../../types/Event';
import { Observable } from 'rxjs';
import { PowershellMonitor } from './powershell-monitor';
import { PowershellCommands } from './powershell-commands';

@Injectable({
    providedIn: 'root'
})
export class PowershellService { 
    ps: Shell;

    constructor() {
        this._initShell();
    }

    private _initShell(): void {
        this.ps = new Shell({
            executionPolicy: 'Bypass',
            noProfile: true
        });
    }

    //#region Public Api

    public getEventLogs(): Promise<EventLog[]> {
        return PowershellCommands.getEventLogs((command:string) => this._commandExecutor(command));
    }

    private _commandExecutor(command:string): Promise<string> {
        return this.ps.addCommand(command)
        .then(() => this.ps.invoke())
        .catch(e => {
            console.log(e);
            this._initShell();
            return [];
        });
    }

    private _monitors: Map<string,PowershellMonitor> = new Map();
    public getEvents$(eventViewerName: string): Observable<Event[]> {
        if (!this._monitors.has(eventViewerName)) {
            this._monitors.set(eventViewerName, new PowershellMonitor(eventViewerName));
        }
        
        return this._monitors.get(eventViewerName).observable$;
    }

    public getExistingLogs(eventViewerName: string): Event[] {
        if (!this._monitors.has(eventViewerName)) {
            this._monitors.set(eventViewerName, new PowershellMonitor(eventViewerName));
        }

        return this._monitors.get(eventViewerName).allLogs.slice();
    }
    //#endregion Public Api
}