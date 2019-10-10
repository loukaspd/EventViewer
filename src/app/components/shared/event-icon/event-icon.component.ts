//#region imports
import { Component, Input } from '@angular/core';
import { EventEntryTypes } from '../../../types/Constants';
//#endregion imports

@Component({
    selector: 'event-icon',
    templateUrl: 'event-icon.component.html'
})
export class EventIconComponent {
    //#region Constructor & Properties
    @Input()
    public eventType: EventEntryTypes;

    public eventEntryTypes = EventEntryTypes;
    //#endregion Constructor & Properties


    //#region Component Methods

    //#endregion Component Methods


    //#region Implementation

    //#endregion Implementation


}