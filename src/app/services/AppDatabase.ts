import { AppLogger } from "./AppLogger";
import { DbEventLog } from "../types/database/DbEventLog";

//import PouchDB from 'pouchdb';
//const PouchDB = require('pouchdb').default;
import PouchDB from 'pouchdb';

export class AppDatabase {
    //#region Singleton
    private static _instance;
    public static getInstance(): AppDatabase {
        if (this._instance == null) this._instance = new AppDatabase();
        return this._instance;
    }

    private constructor() {
        this._db = new PouchDB('DbEventLog');
    }
    //#endregion Singleton


    //#region Properties
    private _db: PouchDB.Database;
    //#endregion Properties


    //#region Public Api
    public upsertItem(item: any) : Promise<boolean> {
        return this._db
            .get(item._id)
            .catch(e => {
                if (e.status == 404) return null 
                throw e;
            })
            .then(existingItem => {
                if (existingItem) {
                    item._rev = existingItem._rev;
                }
                return this._db.put(item);
            })
            .then(res => true)
            .catch(e => {
                AppLogger.getDebug().logErrorMessage(`Error while executing upsertItem. ItemData:\n${JSON.stringify(item)}`);
                AppLogger.getDebug().logError(e);
                return false;
            });
    }


    public getAllLoggs(): Promise<DbEventLog[]> {
        return this._db
            .allDocs({include_docs: true})
            .then(res => res.rows.map(row => new DbEventLog(row.doc)))
            .catch(e => {
                AppLogger.getDebug().logErrorMessage(`Error while executing getAllLoggs`);
                AppLogger.getDebug().logError(e);
                return [];
            });
    }
    //#endregion Public Api
}