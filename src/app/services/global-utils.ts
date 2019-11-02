import {exec} from 'child_process';

export class GlobalUtils {
    public static enumValuesToArray(a: any): string[] {
        if (!a) return [];
        return Object.keys(a).map(key => a[key]);
    }

    public static timeoutPromise(milli: number): Promise<any> {
        return new Promise((res) => {
            setTimeout(() => res(null), milli);
        });
    }

    public static splitLines(input:string): string[] {
        return input.split(/\r?\n/);
    }

    public static runningAsAdmin(): Promise<boolean> {
        return new Promise((res,rej) => {
            exec('NET SESSION', (err, so, se) => res(se != undefined && se.length == 0));
        })
    }
}