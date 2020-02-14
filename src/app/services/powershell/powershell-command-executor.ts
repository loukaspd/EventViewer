import Shell from 'node-powershell';
import { GlobalUtils } from '../global-utils';




export class CommandTimeoutError extends Error {
    constructor(message?: string) {
        super(message);
        // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = 'CommandTimeoutError'; // stack traces display correctly now 
    }
}


export class PsCommandExecutor {    
    private static _initShell(): Shell {
        return new Shell({
            executionPolicy: 'Bypass',
            noProfile: true
        });
    }

    /**
     * executes a powershell command and returns the output.
     * @param command the command to execute
     * @param ignoreError pass true to prevent from console.error the error message
     * @param timeout (optional) specify the max time in seconds that this command should run
     */
    public static executeCommand(command: string, ignoreError?:boolean, timeout?:number): Promise<string> {
        
        //commands.length > 1 ? console.table(commands) : console.log(commands.last());    //TODO REMOVE
        const _ps = this._initShell();
        const commandPromise: Promise<string> = _ps.addCommand('[Console]::OutputEncoding = [System.Text.Encoding]::UTF8')
        .then(() => _ps.addCommand(command))
        .then(() => _ps.invoke())
        .catch(e => {
            if (!ignoreError) console.error(e);
            return '';
        })
        .finally(() => {
            _ps.dispose()
            .catch(e => {
                console.error(`error while disposing Shell`);
                console.error(e);
            })
        });

        if (!timeout) return commandPromise;
        else {
            const timeoutPromise: Promise<string> = GlobalUtils.timeoutPromise((timeout*1000))
            .then(() => {
                throw new CommandTimeoutError();
            });

            return Promise.race([commandPromise, timeoutPromise]);
        }
    }
}