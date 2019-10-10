import { Event } from "../../types/Event";

export class PowershellCommands {
    public static selectEvent: string = ` | select-object Index,EntryType,Source,@{n='TimeGenerated';e={Get-Date ($_.timegenerated) -Format 'yyyy-MM-ddTHH:mm:ss'}},@{n='originalTimeString';e={($_.timegenerated)}},Message`;


    public static parseEventsCommandOutput(output: string): Event[] {
        const lines = output.split(/\r?\n/).filter(s => !!s.length);
        return lines
        .map((e,index) => /^Index\s+:\s(\d+)/s.test(e) ? index : undefined)
        .filter(e => e!=undefined)
        .map((e,index, array) => {
           const start = e;
           const end = index == array.length-1 ? undefined : array[index+1];
           const elementLines = lines.slice(start,end);
           return PowershellCommands.parseEventLogItem(elementLines);
        });
    }

    private static parseEventLogItem(lines: string[]): Event {
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
}