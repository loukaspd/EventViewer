import { Injectable } from '@angular/core'; 
import { EventLog } from '../../types/EventLog';
import { Event } from '../../types/Event';
import { Observable } from 'rxjs';
import { PowershellMonitor } from './powershell-monitor';
import { PowershellCommands } from './powershell-commands';

@Injectable({
    providedIn: 'root'
})
export class PowershellService {
    //#region Public Api

    public getEventLogs(): Promise<EventLog[]> {
        return PowershellCommands.getEventLogs();
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