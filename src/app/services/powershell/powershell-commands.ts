import { Event } from "../../types/Event";
import { EventLog } from "../../types/EventLog";
import { GlobalUtils } from "../global-utils";
import { PsCommandExecutor } from "./powershell-command-executor";
import { AppLogger } from "../AppLogger";

export class PowershellCommands {

    public static newEventLog(logName: string, source: string, computerName: string): Promise<string> {
        let command = `New-EventLog -LogName "${logName}" -Source "${source}"`;
        if (!!computerName) command += ` -ComputerName "${computerName}"`;

        return PsCommandExecutor.executeCommand(command, false);
    }

    public static clearEventLog(eventLog: EventLog): Promise<string> {
        let command = `Clear-EventLog -LogName "${eventLog.log}"`;
        if (eventLog.computerName) command += ` -ComputerName "${eventLog.computerName}"`;
        
        return PsCommandExecutor.executeCommand(command, false);
    }


    public static removeEventLog(eventLog: EventLog): Promise<string> {
        let command = `Remove-EventLog -LogName "${eventLog.log}"`;
        if (eventLog.computerName) command += ` -ComputerName "${eventLog.computerName}"`;
        
        return PsCommandExecutor.executeCommand(command, false);
    }

    //#region Event Log Sources
    public static eventLogSources(eventLog: EventLog): Promise<string[]> {
        let command = `Get-EventLog -LogName "${eventLog.log}"`;
        if (eventLog.computerName) command += ` -ComputerName "${eventLog.computerName}"`;
        command += ` |Select-Object Source -Unique`;
        
        return PsCommandExecutor.executeCommand(command, true)
        .then((output :string) => GlobalUtils
        .splitLines(output)
        .map(l => l.trim())
        .filter(l => !!l.length)
        .slice(2));
    }
    //#endregion Event Log Sources


    //#region Event Log
    public static getEventLogs(computerName: string): Promise<EventLog[]> {
        let command = 'Get-EventLog';
        if (computerName) command += ` -ComputerName "${computerName}"`;
        command += ' -List';

        AppLogger.getInstance().logDebug(command);
        return PsCommandExecutor.executeCommand(command, false, 90)
        .then(output => PowershellCommands._parseEventViewersList(output))
        .then(events => {
            events.forEach(e => e.computerName = computerName);
            return events;
        });
    }
    
    private static _parseEventViewersList(output: string): EventLog[] {
        AppLogger.getInstance().logDebug(output);
        const regex = /\S*\s+\d+\s+\D+\s+([\d|,|.]+)\s+(.*)/s;

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
    public static getEvents(eventLog: EventLog, onlyLastEvent: boolean, lastEvent?:Event) : Promise<Event[]> {
        //build command
        let command = `Get-EventLog -LogName "${eventLog.log}"`;
        if (!!eventLog.computerName) command += ` -ComputerName "${eventLog.computerName}"`;
        if (!!lastEvent) command += ` -After "${lastEvent.originalTimeString}"`;
        else if (onlyLastEvent) command += " -Newest 1";
        //add select part
        command += PowershellCommands._selectEventCommand;
        //execute and parse
        return PsCommandExecutor.executeCommand(command, true)
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