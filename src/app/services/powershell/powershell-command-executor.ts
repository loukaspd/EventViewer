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
}