export class Event {
    public Index: number;
    public EntryType: string;   //Information, Warning, Error
    public Message: string;
    
    public Source: string;
    public TimeGenerated: Date;
    public timeGenerated: string;

    // public Username: string;
    // public InstanceId: number;
    // public Category: string;
    // public CategoryNumber: number;


    public parseDates() {
        this.TimeGenerated = new Date(this.timeGenerated);
    }
}