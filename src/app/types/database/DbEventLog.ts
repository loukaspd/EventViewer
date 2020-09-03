import { EventLog } from "../EventLog";

export class DbEventLog extends EventLog {
    public _id: string;

    constructor(instance? :any) {
        super(instance);
        this.setId();
    }


    public setId(): void {
        this._id = `${this.log}#${this.computerName || ''}`;
    }
}