//#region imports
import { Component } from '@angular/core';
import { GlobalUtils } from '../../../services/global-utils';
import { EventEntryTypes } from '../../../types/Constants';
import { EventFiltersVm } from '../../../types/viewmodels/EventFiltersVm';
//#endregion imports

@Component({
    selector: 'event-viewer-filters',
    templateUrl: 'event-viewer-filters.component.html'
})
export class EventViewerFiltersComponent {
    //#region Constructor & Properties
    constructor() { }
    public eventLevels: string[] = GlobalUtils.enumValuesToArray(EventEntryTypes);
    public filters: EventFiltersVm = new EventFiltersVm();
    //#endregion Constructor & Properties


    //#region Component Methods

    //#endregion Component Methods


    //#region Implementation

    //#endregion Implementation


}