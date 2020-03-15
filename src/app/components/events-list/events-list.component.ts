//#region imports
import { Component, Input } from '@angular/core';

import { EventLog } from '../../types/EventLog';
//#endregion imports

@Component({
    selector: 'events-list',
    templateUrl: 'events-list.component.html',
    styleUrls: ['events-list.component.css']
})
export class EventsListComponent {
    //#region Constructor & Properties
    @Input() public eventLogs: EventLog[];
    @Input() public activeIndex: Number;

    constructor() { }
    //#endregion Constructor & Properties


    //#region Component Methods

    //#endregion Component Methods


    //#region UiMethods
    public uiOnAddClicked(): void {
        console.log('hello');
    }
    //#endregion UiMethods


    //#region Implementation

    //#endregion Implementation


}