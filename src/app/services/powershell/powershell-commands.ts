import { Event } from "../../types/Event";
import { EventLog } from "../../types/EventLog";
import { GlobalUtils } from "../global-utils";
import { PsCommandExecutor } from "./powershell-command-executor";
import { EventFiltersVm } from "../../types/viewmodels/EventFiltersVm";

export class PowershellCommands {

    static clearEventLog(eventLog: EventLog): Promise<string> {
        let command = `Clear-EventLog -LogName "${eventLog.log}"`;
        if (eventLog.computerName) command += ` -ComputerName "${eventLog.computerName}"`;
        
        return PsCommandExecutor.executeCommand(command);
    }

    //#region Event Log
    public static getEventLogs(computerName: string): Promise<EventLog[]> {
        let command = 'Get-EventLog';
        if (computerName) command += ` -ComputerName "${computerName}"`;
        command += ' -List';

        return PsCommandExecutor.executeCommand(command)
        .then(output => PowershellCommands._parseEventViewersList(output))
        .then(events => {
            events.forEach(e => e.computerName = computerName);
            return events;
        });
    }
    
    private static _parseEventViewersList(output: string): EventLog[] {
        const regex = /\S*\s+\d+\s+\D+\s+([\d|,]+)\s+(.*)/s;

        return GlobalUtils.splitLines(output)   //get each line
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

    //#endregion

    //#region Events
    public static getEvents(params:GetEventsParams, after: string, newest?: number) : Promise<Event[]> {
        let command = params.buildCommand(after);
        if (newest) command += ` -Newest ${newest}`;
        
        command += ' ' + PowershellCommands._selectEventCommand;
        return PsCommandExecutor.executeCommand(command)
        .then(output => PowershellCommands._parseEventsCommandOutput(output));
    }

    private static _selectEventCommand: string = ` | select-object Index,EntryType,Source,@{n='TimeGenerated';e={Get-Date ($_.timegenerated) -Format 'yyyy-MM-ddTHH:mm:ss'}},@{n='originalTimeString';e={($_.timegenerated)}},Message`;


    private static _parseEventsCommandOutput(output: string): Event[] {
        const lines = GlobalUtils.splitLines(output).filter(s => !!s.length);
        return lines
        .map((e,index) => /^Index\s+:\s(\d+)/s.test(e) ? index : undefined)
        .filter(e => e!=undefined)
        .map((e,index, array) => {
           const start = e;
           const end = index == array.length-1 ? undefined : array[index+1];
           const elementLines = lines.slice(start,end);
           return PowershellCommands._parseEventLogItem(elementLines);
        });
    }

    private static _parseEventLogItem(lines: string[]): Event {
        const regex = /(\S+)\s+:\s(.*)/s;
        const eventLog = new Event();
        
        let property:string='';
        let value: string='';
        for(let i=0;i<lines.length; i++) {
            const match = regex.exec(lines[i]);
            if (match) {
                eventLog[property] = value; //asign values              
                property = match[1];
                value = match[2];
            }
            else {
                value += '\n' + lines[i].trim();
            }
        }
        eventLog[property] = value; //asign Message values  

        eventLog.parseDates();
        return eventLog;
    }

    // private regex: RegExp = /^Index\s+:\s(\d+)\n^EntryType\s+:\s(\D+)\n^InstanceId\s+:\s(\d+)\n^Message\s+:\s((.|\n)+?(?=^Category))^Category\s+:\s(.+)\n^CategoryNumber\s+:\s(\d+)\n^ReplacementStrings\s+:\s((.|\n)+?(?=^Source))^Source\s+:\s(.*)\n^TimeGenerated\s+:\s(.*)\n^TimeWritten\s+:\s(.*)\n^UserName\s+:\s(.*)/mg;

    //#endregion Events
}


export class GetEventsParams {
    public computerName: string;
    public log: string;

    public eventEntryTypes: string[] = [];
    public dateFrom: Date;
    public dateTo: Date;
    public searchTerm: string = '';

    constructor(eventLog: EventLog, filters?: EventFiltersVm) {
        this.copyFromEventLog(eventLog);
        if (!!filters) this.copyFromFilters(filters);
    }

    public copyFromEventLog(eventLog: EventLog):void {
        this.computerName = eventLog.computerName;
        this.log = eventLog.log;
    }

    public copyFromFilters(filters: EventFiltersVm):void {
        this.eventEntryTypes = [...filters.eventEntryTypes];
        this.dateFrom = filters.dateFrom;
        this.dateTo = filters.dateTo;
        this.searchTerm = filters.searchTerm;
    }


    public buildCommand(after: string): string {
        let command = `Get-EventLog -LogName "${this.log}"`;
        if (this.computerName) command += ` -ComputerName "${this.computerName}"`;

        if (this.dateTo) command += ` -Before "${this._toPsDate(this.dateTo)}"`;

        if (this.eventEntryTypes.length > 0) {
            command += ` -EntryType ${this.eventEntryTypes.join(',')}`;
        }

        if (!!this.searchTerm) {
            command += ` -Message "*${this.searchTerm}*"`;
        }
        
        //after
        if (after) command += ` -After "${after}"`;
        else if (!!this.dateFrom) command += ` -After "${this._toPsDate(this.dateFrom)}"`;

        console.log(command);   //REMOVE
        return command;
    }


    private _toPsDate(date: Date): string {
        return '';  //TODO
    }
}