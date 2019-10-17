import { EventEntryTypes } from "../Constants";

export class EventFiltersVm {
    public eventEntryTypes: EventEntryTypes[] = [];
    public dateFrom: Date;
    public dateTo: Date;
    public searchTerm: string = '';
}