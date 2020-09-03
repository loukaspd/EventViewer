export class EventLog {
    public computerName: string;    //will be empty for local computer

    public log: string;
    public entries: number;
    public friendlyName: string;
    public isFavorite: boolean;

    constructor(instance? :EventLog) {
        if (instance != null) {
            this.computerName = instance.computerName;
            this.log = instance.log;
            this.entries = instance.entries;
            this.friendlyName = instance.friendlyName;
            this.isFavorite = instance.isFavorite;
        }
    }

    //#region Ui Methods
    public UiTabLabel(): string {
        return this.log + (this.computerName ? '(' + this.computerName + ')' : '');
    }
    //#endregion Ui Methods

    //#region Business
    public IsSame(other: EventLog): boolean {
        if (!other) return false;
        if (this.log !== other.log) return false;
        return (this.computerName || '') === (other.computerName || '');
    }
    //#endregion Business
}