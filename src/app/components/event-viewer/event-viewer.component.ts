//#region imports
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

import { PowershellService } from '../../services/powershell/powershell.service';
import { Event } from '../../types/Event';
import { Constants } from '../../types/Constants';
import { filter } from 'rxjs/operators';
import { EventFiltersVm } from '../../types/viewmodels/EventFiltersVm';
import { EventLog } from '../../types/EventLog';
//#endregion imports

@Component({
    selector: 'event-viewer',
    templateUrl: 'event-viewer.component.html'
})
export class EventViewerComponent implements OnInit, OnDestroy {
    //#region Constructor & Properties
    constructor(private psService: PowershellService) { }

    @Input()
    public eventLog: EventLog;
    @Output()
    public unreadEventsUpdated = new EventEmitter<boolean>();

    public viewModel= new ViewModel();
    public filters= new EventFiltersVm();

    private _events: Event[] =[];
    private _onNewSubscription: Subscription;
    //#endregion Constructor & Properties


    //#region Angular Methods
    ngOnInit(): void {
        this._refreshList();
    }

    ngOnDestroy(): void {
        if (this._onNewSubscription) this._onNewSubscription.unsubscribe();
    }
    //#endregion Angular Methods


    //#region Implementation

    private _showNextItems(): void {
        const elements2show = Math.min(this.viewModel.events.length + Constants.PageNumber, this._events.length);
        this.viewModel.events = this._events.slice(0,elements2show);

        this.viewModel.hasMore = this.viewModel.events.length < this._events.length;
    }

    private _refreshList(): void {
        // initialize ui variables
        this.viewModel = new ViewModel();
        this.unreadEventsUpdated.emit(false);
        this.viewModel.loading = true;
        // get data
        this.psService.getEvents(this.eventLog, this.filters)
        .then((events: Event[]) => {
            this._events = events;
            this.viewModel.loading = false;
            this._showNextItems();
        });
        

        // subscription
        if (this._onNewSubscription) this._onNewSubscription.unsubscribe();
        this._onNewSubscription = this.psService.onNewEvents$(this.eventLog,null)
        .pipe(filter(p => p.length > 0))
        .subscribe((newEvents: Event[]) => this._onNewEvents(newEvents));
    }

    private _onNewEvents(newEvents: Event[]): void {
        //ui
        this.viewModel.hasNew = true;
        this.unreadEventsUpdated.emit(true);
    }
    //#endregion Implementation


    //#region UiCallbacks
    public uiOnRefreshClicked(): void {
        this._refreshList();
    }

    public uiOnMoreClicked(): void {
        this._showNextItems();
    }
    //#endregion UiCallbacks
}

class ViewModel {
    public loading: boolean = false;
    public events: Event[] = [];
    public hasMore: boolean = false;
    public hasNew: boolean = false;

    constructor(events?: Event[]) {
        this.events = events || [];
    }
}