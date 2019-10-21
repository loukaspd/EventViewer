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
        eventLogName: string
        , filters:EventFiltersVm): Promise<Event[]> {
        
        return PowershellCommands.getEvents(eventLogName,null);
    }

    public onNewEvents$(eventLogName: string, filters:EventFiltersVm): Observable<Event[]> {
        return new PowershellMonitor(eventLogName, filters).observable$;
    }
    //#endregion Public Api
}