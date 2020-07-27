// const log = require('electron-log');
import log from 'electron-log';
log.transports.file.fileName = 'main.log';

const debugLog = log.create('debugLog');
debugLog.transports.file.level = 'debug';
debugLog.transports.file.fileName = 'debug.log';

// const log = require("electron-log");

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
    private constructor() {
    }
    //#endregion Properties & Constructor


    //#region Public Api
    public logInfo(message: string) {
        log.info(message);
    }

    public logErrorMessage(message: string) {
        log.error(message);
    }

    public logError(e: Error) {
        log.error(e);
    }

    public logWarn(message: string) {
        log.warn(message);
    }

    public logDebug(message: string) {
        debugLog.debug(message);
    }

    //#endregion Public Api
}