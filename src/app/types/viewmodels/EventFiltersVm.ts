import { EventEntryTypes } from "../Constants";
import {Event} from "../../types/Event";

export class EventFiltersVm {
    public eventEntryTypes: EventEntryTypes[] = [];
    public dateFrom: Date;
    public dateTo: Date;
    public searchTerm: string = '';


    //#region Business
    public isEmpty() :boolean {
        return this.eventEntryTypes.length == 0
        && this.dateFrom == null
        && this.dateTo == null
        && this.searchTerm == '';
    }

    public eventPassesFilters(event: Event) :boolean {
        if (this.eventEntryTypes.length > 0) {
            if (this.eventEntryTypes.find(e => e == event.EntryType) == null) return false;
        }
        if (this.dateFrom != null) {
            if (event.TimeGenerated < this.dateFrom) return false;
        }
        if (this.dateTo != null) {
            if (event.TimeGenerated > this.dateTo) return false;
        }
        if (this.searchTerm != '') {
            if (event.Message.toLowerCase().indexOf(this.searchTerm) < 0) return false;
        }

        return true;
    }
    //#endregion Business
}