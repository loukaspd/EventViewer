import {exec} from 'child_process';
import { NzModalService } from 'ng-zorro-antd';

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

    public static runningAsAdmin(modalService: NzModalService): Promise<boolean> {
        return new Promise((res,rej) => {
            exec('NET SESSION', (err, so, se) => res(se != undefined && se.length == 0));
        })
        .then((res:boolean) => {
            if (!!modalService && !res) {
                modalService.error({
                    nzTitle: 'Error'
                    ,nzContent: 'Run the app as admin to execute this action'
                });
            }
            return res;
        });
    }
}

//#region Array Extensions
declare global {
    interface Array<T> {
        last(): T;
    }
}

Array.prototype.last = function() {
    return this.length == 0 ? undefined : this[this.length-1];
}
//#endregion Array Extensions