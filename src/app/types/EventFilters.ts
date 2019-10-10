import { EventEntryTypes } from "./Constants";

export class EventFilters {
    public eventEntryTypes: EventEntryTypes[] = [];
    public dateFrom: Date;
    public dateTo: Date;
    public searchTerm: string = '';
}