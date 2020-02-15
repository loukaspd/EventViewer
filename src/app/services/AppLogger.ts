import * as fs from 'fs';
import * as path from 'path';

export class AppLogger {
    //#region Instance
    private static _instance:AppLogger;
    public static getInstance():AppLogger {
        if (this._instance == null) {
            this._instance = new AppLogger();
        }

        return this._instance;
    }
    //#endregion Instance


    //#region Properties & Constructor
    private _logsPath :string;
    private constructor() {
        this._logsPath = path.join(process.env.APPDATA, "event-viewer-pp", "logs.txt");
        fs.writeFileSync(this._logsPath, '');
    }
    //#endregion Properties & Constructor


    //#region Public Api
    public log(message:string): void {
        console.log(message);
        this.logToFile(message);
    }

    public logToFile(message: string): void {
        fs.appendFileSync(this._logsPath,`-----\n${new Date().toString()}\n${message}`);
    }
    //#endregion Public Api
}