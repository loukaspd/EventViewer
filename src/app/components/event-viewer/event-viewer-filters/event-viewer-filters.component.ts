//#region imports
import { Component, Output, EventEmitter } from '@angular/core';
import { GlobalUtils } from '../../../services/global-utils';
import { EventEntryTypes } from '../../../types/Constants';
import { EventFiltersVm } from '../../../types/viewmodels/EventFiltersVm';
//#endregion imports

@Component({
    selector: 'event-viewer-filters',
    templateUrl: 'event-viewer-filters.component.html'
})
export class EventViewerFiltersComponent {
    //#region Public Api
    @Output()
    onFiltersChanged: EventEmitter<EventFiltersVm> = new EventEmitter<EventFiltersVm>();
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

    //#endregion UI callbacks


}