//#region imports
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

import { PowershellService } from '../../services/powershell/powershell.service';
import { Event } from '../../types/Event';
import { EventEntryTypes } from '../../types/Constants';
//#endregion imports

@Component({
    selector: 'event-viewer',
    templateUrl: 'event-viewer.component.html'
})
export class EventViewerComponent implements OnInit, OnDestroy {
    //#region Constructor & Properties
    constructor(private psService: PowershellService) { }

    @Input()
    public eventViewerName: string;
    @Output()
    public unreadEventsUpdated = new EventEmitter<boolean>();

    public loading: boolean = true;
    public events: Event[] =[];
    public newEvents: Event[] = [];
    public eventEntryTypes = EventEntryTypes;
    private _subscriptions: Subscription[] = [];
    //#endregion Constructor & Properties


    //#region Angular Methods
    ngOnInit(): void {
        this.setupSubscriptions();
    }

    ngOnDestroy(): void {
        this.events = this.psService.getExistingLogs(this.eventViewerName);
        this._subscriptions.forEach(s => s.unsubscribe());
    }
    //#endregion Angular Methods


    //#region Implementation
    private setupSubscriptions(): void {
        const subscription = this.psService
        .getEvents$(this.eventViewerName)
        .subscribe((newLogs) => this._handleNew(newLogs));
        
        
        this._subscriptions.push(subscription);
    }

    private _handleNew(events: Event[]) {
        this.loading = false;
        if (!this.events.length) {
            this.events = [...events];
            return;
        }
        if (!events.length) return;
        
        this.newEvents = events.slice();
        this.unreadEventsUpdated.emit(true);
    }

    private _updateList():void {
        this.events = this.newEvents.concat(this.events);
        this.newEvents = [];

        //ui
        this.unreadEventsUpdated.emit(false);
    }
    //#endregion Implementation


    //#region UiCallbacks
    public onRefreshClicked(): void {
        this._updateList();
    }
    //#endregion UiCallbacks
}