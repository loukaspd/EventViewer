//#region imports
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { GlobalUtils } from '../../../services/global-utils';
import { EventEntryTypes } from '../../../types/Constants';
import { EventFiltersVm } from '../../../types/viewmodels/EventFiltersVm';
//#endregion imports

@Component({
    selector: 'event-viewer-filters',
    templateUrl: 'event-viewer-filters.component.html',
    styleUrls: ['event-viewer-filters.component.css']
})
export class EventViewerFiltersComponent {
    //#region Public Api
    @Output()
    onFiltersChanged: EventEmitter<EventFiltersVm> = new EventEmitter<EventFiltersVm>();
    @Input()
    public sources: string[] = [];
    //#endregion Public Api
    //#region Constructor & Properties
    constructor() { }
    public eventLevels: string[] = GlobalUtils.enumValuesToArray(EventEntryTypes);
    public filters: EventFiltersVm = new EventFiltersVm();
    //#endregion Constructor & Properties


    //#region Component Methods

    //#endregion Component Methods


    //#region Implementation
    private _applyFilters():void {
        this.onFiltersChanged.emit(this.filters);
    }
    //#endregion Implementation

    //#region Ui callbacks
    public UiOnApplyClicked(): void {
        this._applyFilters();
    }

    public UiOnClearClicked(): void {
        this.filters = new EventFiltersVm();
        this._applyFilters();
    }

    public UiOnSearchMessageClicked(): void {
        alert(this.filters.searchTerm);
    }

    public UiOnEventTypeClicked(eventType: EventEntryTypes): void {
        this.filters.eventEntryTypes.push(eventType);
    }

    //#endregion UI callbacks


    //#region UiHelpers
    public UiEventEntriesToShow(): string[] {
        return GlobalUtils.enumValuesToArray(EventEntryTypes)
            .filter(et => this.filters.eventEntryTypes.map(i => i.toString()).indexOf(et) < 0);
    }
    //#endregion


}