import { Injectable } from '@angular/core'; 
import { EventLog } from '../../types/EventLog';
import { Event } from '../../types/Event';
import { Observable } from 'rxjs';
import { PowershellMonitor } from './powershell-monitor';
import { PowershellCommands } from './powershell-commands';
import { EventFiltersVm } from '../../types/viewmodels/EventFiltersVm';

@Injectable({
    providedIn: 'root'
})
export class PowershellService {
    //#region Public Api

    public getEventLogs(computerName: string): Promise<EventLog[]> {
        return PowershellCommands.getEventLogs(computerName);
    }

    public getEvents(
        eventLog: EventLog
        , filters:EventFiltersVm): Promise<Event[]> {
        
        return PowershellCommands.getEvents(eventLog,null);
    }

    public onNewEvents$(eventLog: EventLog, filters:EventFiltersVm): Observable<Event[]> {
        return new PowershellMonitor(eventLog, filters).observable$;
    }

    public clearEventLog(eventLog: EventLog): Promise<string> {
        return PowershellCommands.clearEventLog(eventLog);
    }
    //#endregion Public Api
}