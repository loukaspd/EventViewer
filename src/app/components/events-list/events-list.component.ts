//#region imports
import { Component, Input, Output } from '@angular/core';

import { EventLog } from '../../types/EventLog';
import { EventEmitter } from '@angular/core';
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

    @Output() public onAddClicked = new EventEmitter<void>();
    @Output() public onCloseClicked = new EventEmitter<Number>();
    @Output() public onLogSelected = new EventEmitter<Number>();

    constructor() { }
    //#endregion Constructor & Properties


    //#region Component Methods

    //#endregion Component Methods


    //#region UiMethods
    public uiOnAddClicked(): void {
        this.onAddClicked.emit();
    }

    public uiOnCloseClicked(index: Number): void {
        this.onCloseClicked.emit(index);
    }

    public uiOnItemClicked(index: Number): void {
        this.onLogSelected.emit(index);
    }
    //#endregion UiMethods


    //#region Implementation

    //#endregion Implementation


}