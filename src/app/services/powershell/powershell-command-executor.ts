import Shell from 'node-powershell';
import { GlobalUtils } from '../global-utils';

export class PsCommandExecutor {    
    private static _ps: Shell;
    private static _initShell(): void {
        this._ps = new Shell({
            executionPolicy: 'Bypass',
            noProfile: true
        });
    }

    public static executeCommand(command: string): Promise<string> {
        //#region Mock Result
        if (this.MOCK) return Promise.resolve(this.MOCK_RESULT(command));
        //#endregion Mock Result
        if (!this._ps) this._initShell();

        const commandPromise = this._ps.addCommand(command)
        .then(() => this._ps.invoke())
        .catch(e => {
            console.log(e);
            this._initShell();
            return '';
        });

        return Promise.race<any>([commandPromise, GlobalUtils.timeoutPromise(3000)])  //stop execution if it takes more than 3 seconds
        .then(output => {
            if (typeof output === 'string') return output;
            console.log('command timeout');
            return '';
        });
    }

    //#region MOCK
    private static MOCK = false;
    
    private static MOCK_EVENTS_RETURNED = false;
    private static MOCK_RESULT(command:string): string {
        if (!this.MOCK)return undefined;
        if (command == 'Get-EventLog -List') {
            //#region MOCK_ENENTLOGS
            return `
Max(K) Retain OverflowAction        Entries Log                                                                      
------ ------ --------------        ------- ---                                                                      
20,480      0 OverwriteAsNeeded      32,864 Application                                                              
20,480      0 OverwriteAsNeeded           0 HardwareEvents                                                           
   512      7 OverwriteOlder              0 Internet Explorer                                                        
20,480      0 OverwriteAsNeeded           0 Key Management Service                                                   
   128      0 OverwriteAsNeeded           2 OAlerts                                                                  
                                            Security                                                                 
20,480      0 OverwriteAsNeeded       8,765 System                                                                   
   512      7 OverwriteOlder             20 Test                                                                     
   512      7 OverwriteOlder              0 Windows Azure                                                            
15,360      0 OverwriteAsNeeded       3,988 Windows PowerShell     
            `;
            //#endregion MOCK_EVENTLOGS
        }
        if (this.MOCK_EVENTS_RETURNED) return '';
        this.MOCK_EVENTS_RETURNED = true;
        //#region MOCK_EVENTS
        return `
Index              : 20
EntryType          : Error
InstanceId         : 1
Message            : This is an Error
Category           : (1)
CategoryNumber     : 1
ReplacementStrings : {This is an Error}
Source             : Test
TimeGenerated      : 10/2/2019 6:33:26 PM
TimeWritten        : 10/2/2019 6:33:26 PM
UserName           : 

Index              : 19
EntryType          : Warning
InstanceId         : 1
Message            : This is a warning
Category           : (1)
CategoryNumber     : 1
ReplacementStrings : {This is a warning}
Source             : Test
TimeGenerated      : 10/2/2019 6:33:26 PM
TimeWritten        : 10/2/2019 6:33:26 PM
UserName           : 

Index              : 18
EntryType          : Information
InstanceId         : 1
Message            : This
                     is
                     a
                     multiline
                     message
Category           : (1)
CategoryNumber     : 1
ReplacementStrings : {This
                     is
                     a
                     multiline
                     message}
Source             : Test
TimeGenerated      : 10/2/2019 6:33:26 PM
TimeWritten        : 10/2/2019 6:33:26 PM
UserName           : 

Index              : 17
EntryType          : Error
InstanceId         : 1
Message            : This is an Error
Category           : (1)
CategoryNumber     : 1
ReplacementStrings : {This is an Error}
Source             : Test
TimeGenerated      : 10/2/2019 6:33:07 PM
TimeWritten        : 10/2/2019 6:33:07 PM
UserName           : 

Index              : 16
EntryType          : Warning
InstanceId         : 1
Message            : This is a warning
Category           : (1)
CategoryNumber     : 1
ReplacementStrings : {This is a warning}
Source             : Test
TimeGenerated      : 10/2/2019 6:33:07 PM
TimeWritten        : 10/2/2019 6:33:07 PM
UserName           : 

Index              : 15
EntryType          : Information
InstanceId         : 1
Message            : This
                     is
                     a
                     multiline
                     message
Category           : (1)
CategoryNumber     : 1
ReplacementStrings : {This
                     is
                     a
                     multiline
                     message}
Source             : Test
TimeGenerated      : 10/2/2019 6:33:07 PM
TimeWritten        : 10/2/2019 6:33:07 PM
UserName           : 

Index              : 14
EntryType          : Error
InstanceId         : 1
Message            : This is an Error
Category           : (1)
CategoryNumber     : 1
ReplacementStrings : {This is an Error}
Source             : Test
TimeGenerated      : 10/2/2019 6:28:23 PM
TimeWritten        : 10/2/2019 6:28:23 PM
UserName           : 

Index              : 13
EntryType          : Warning
InstanceId         : 1
Message            : This is a warning
Category           : (1)
CategoryNumber     : 1
ReplacementStrings : {This is a warning}
Source             : Test
TimeGenerated      : 10/2/2019 6:28:23 PM
TimeWritten        : 10/2/2019 6:28:23 PM
UserName           : 

Index              : 12
EntryType          : Information
InstanceId         : 1
Message            : This
                     is
                     a
                     multiline
                     message
Category           : (1)
CategoryNumber     : 1
ReplacementStrings : {This
                     is
                     a
                     multiline
                     message}
Source             : Test
TimeGenerated      : 10/2/2019 6:28:23 PM
TimeWritten        : 10/2/2019 6:28:23 PM
UserName           : 

Index              : 11
EntryType          : Error
InstanceId         : 1
Message            : This is an Error
Category           : (1)
CategoryNumber     : 1
ReplacementStrings : {This is an Error}
Source             : Test
TimeGenerated      : 10/2/2019 3:50:49 PM
TimeWritten        : 10/2/2019 3:50:49 PM
UserName           : 

Index              : 10
EntryType          : Warning
InstanceId         : 1
Message            : This is a warning
Category           : (1)
CategoryNumber     : 1
ReplacementStrings : {This is a warning}
Source             : Test
TimeGenerated      : 10/2/2019 3:50:49 PM
TimeWritten        : 10/2/2019 3:50:49 PM
UserName           : 

Index              : 9
EntryType          : Information
InstanceId         : 1
Message            : This
                     is
                     a
                     multiline
                     message
Category           : (1)
CategoryNumber     : 1
ReplacementStrings : {This
                     is
                     a
                     multiline
                     message}
Source             : Test
TimeGenerated      : 10/2/2019 3:50:49 PM
TimeWritten        : 10/2/2019 3:50:49 PM
UserName           : 

Index              : 8
EntryType          : Error
InstanceId         : 1
Message            : This is an Error
Category           : (1)
CategoryNumber     : 1
ReplacementStrings : {This is an Error}
Source             : Test
TimeGenerated      : 10/2/2019 10:21:30 AM
TimeWritten        : 10/2/2019 10:21:30 AM
UserName           : 

Index              : 7
EntryType          : Warning
InstanceId         : 1
Message            : This is a warning
Category           : (1)
CategoryNumber     : 1
ReplacementStrings : {This is a warning}
Source             : Test
TimeGenerated      : 10/2/2019 10:21:30 AM
TimeWritten        : 10/2/2019 10:21:30 AM
UserName           : 

Index              : 6
EntryType          : Information
InstanceId         : 1
Message            : This
                     is
                     a
                     multiline
                     message
Category           : (1)
CategoryNumber     : 1
ReplacementStrings : {This
                     is
                     a
                     multiline
                     message}
Source             : Test
TimeGenerated      : 10/2/2019 10:21:30 AM
TimeWritten        : 10/2/2019 10:21:30 AM
UserName           : 

Index              : 5
EntryType          : Warning
InstanceId         : 1
Message            : This is a warning
Category           : (1)
CategoryNumber     : 1
ReplacementStrings : {This is a warning}
Source             : Test
TimeGenerated      : 10/2/2019 10:21:09 AM
TimeWritten        : 10/2/2019 10:21:09 AM
UserName           : 

Index              : 4
EntryType          : Information
InstanceId         : 1
Message            : This
                     is
                     a
                     multiline
                     message
Category           : (1)
CategoryNumber     : 1
ReplacementStrings : {This
                     is
                     a
                     multiline
                     message}
Source             : Test
TimeGenerated      : 10/2/2019 10:21:09 AM
TimeWritten        : 10/2/2019 10:21:09 AM
UserName           : 

Index              : 3
EntryType          : Information
InstanceId         : 1
Message            : This
                     is
                     a
                     multiline
                     message
Category           : (1)
CategoryNumber     : 1
ReplacementStrings : {This
                     is
                     a
                     multiline
                     message}
Source             : Test
TimeGenerated      : 9/30/2019 9:39:48 PM
TimeWritten        : 9/30/2019 9:39:48 PM
UserName           : 

Index              : 2
EntryType          : Information
InstanceId         : 1
Message            : This
                     is
                     a
                     multiline
                     message
Category           : (1)
CategoryNumber     : 1
ReplacementStrings : {This
                     is
                     a
                     multiline
                     message}
Source             : Test
TimeGenerated      : 9/30/2019 9:33:20 PM
TimeWritten        : 9/30/2019 9:33:20 PM
UserName           : 

Index              : 1
EntryType          : Information
InstanceId         : 1
Message            : This\nis\na\nmultiline\nmessage
Category           : (1)
CategoryNumber     : 1
ReplacementStrings : {This\nis\na\nmultiline\nmessage}
Source             : Test
TimeGenerated      : 9/30/2019 9:31:41 PM
TimeWritten        : 9/30/2019 9:31:41 PM
UserName           : 

        `;
//#endregion MOCK_EVENTS
    }

    //#endregion MOCK
}