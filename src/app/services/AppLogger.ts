// const log = require('electron-log');
// import log from 'electron-log';
// import log from 'electron-log';
// import ElectronLog = require('electron-log');
// log.transports.file.fileName = 'main.log';
import {ElectronLog, create} from 'electron-log';


// const log = require("electron-log");

export class AppLogger {
    //#region Instance & DebugInstace
    private static _instance:AppLogger;
    private static _debugInstance: AppLogger;
    
    public static getInstance():AppLogger {
        if (this._instance == null) {
            this._instance = new AppLogger('main');
        }

        return this._instance;
    }

    public static getDebug():AppLogger {
        if (this._debugInstance == null) {
            this._debugInstance = new AppLogger('debug');
        }
        return this._debugInstance;
    }
    //#endregion Instance


    //#region Properties & Constructor
    private _electronLog: ElectronLog;
    private constructor(logName: string) {
        this._electronLog = create(logName);
        this._electronLog.transports.file.level = 'debug';
        this._electronLog.transports.file.fileName = logName + '.log';
        this._electronLog.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}] {text}';
    }
    //#endregion Properties & Constructor


    //#region Public Api
    public logInfo(message: string) {
        this._electronLog.info(message);
    }

    public logErrorMessage(message: string) {
        this._electronLog.error(message);
    }

    public logError(e: Error) {
        this._electronLog.error(e);
    }

    public logWarn(message: string) {
        this._electronLog.warn(message);
    }

    public logDebug(message: string) {
        this._electronLog.debug(message);
    }

    //#endregion Public Api
}