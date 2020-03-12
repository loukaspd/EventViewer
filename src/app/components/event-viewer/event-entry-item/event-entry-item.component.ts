//#region imports
import { Component, Input } from '@angular/core';
import {Event} from '../../../types/Event';
//#endregion imports

@Component({
    selector: 'event-entry-item',
    templateUrl: 'event-entry-item.component.html',
    styleUrls: ['./event-entry-item.component.css']
})
export class EventEntryItemComponent {
    //#region Constructor & Properties
    @Input() public event: Event;
    //#endregion Constructor & Properties


}