import { Injectable } from '@angular/core';
import Shell from 'node-powershell'; 
import { EventLog } from '../../types/EventLog';
import { Event } from '../../types/Event';
import { Observable } from 'rxjs';
import { PowershellMonitor } from './powershell-monitor';
import { GlobalUtils } from '../global-utils';

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
        const commandPromise = this.ps.addCommand('Get-EventLog -List')
        .then(() => this.ps.invoke());

        return Promise.race<any>([commandPromise, GlobalUtils.timeoutPromise(3000)])  //stop execution if it does more than 3 seconds
        .then(output => {
            if (output == null) {
                console.log('command tool more than 3 seconds');
                this._initShell();
                return this.getEventLogs();
            }
            return this.parseEventViewersList(output)
        })
        .catch(error => {
            console.log(error);
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


    //#region Helpers

    private parseEventViewersList(output: string): EventLog[] {
        const regex = /\S*\s+\d+\s+\D+\s+([\d|,]+)\s+(.*)/s;


        return output.split(/\r?\n/)    //get each line
        .slice(3)                       //remove titles
        .map(line => line.trim())       //trim lines
        .filter(line => regex.test(line))
        .map(line => {
            const eventLog = new EventLog();
            
            let match = regex.exec(line);
            eventLog.log = match[2];
            eventLog.entries = Number(match[1].replace(',','').replace('.',''));
            
            return eventLog;
        });
    }

    //#endregio Helpers
}