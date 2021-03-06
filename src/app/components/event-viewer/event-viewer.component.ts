//#region imports
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { Event } from '../../types/Event';
import { Constants } from '../../types/Constants';
import { EventFiltersVm } from '../../types/viewmodels/EventFiltersVm';
import { EventLog } from '../../types/EventLog';
import { NzModalService } from 'ng-zorro-antd';
import { GlobalUtils } from '../../services/global-utils';
import { PowershellCommands } from '../../services/powershell/powershell-commands';
import { PowershellMonitor } from '../../services/powershell/powershell-monitor';
//#endregion imports

@Component({
    selector: 'event-viewer',
    templateUrl: 'event-viewer.component.html'
    ,styleUrls: ['event-viewer.component.css']
    ,changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventViewerComponent implements OnInit, OnDestroy {
    //#region Constructor & Properties
    constructor(private modalService: NzModalService
        ,private elementRef: ElementRef
        ,private changeDetRef: ChangeDetectorRef) { }

    @Input()
    public eventLog: EventLog;
    @Input()
    public showOnlyNewEvents: boolean;
    @Output()
    public unreadEventsUpdated = new EventEmitter<number>();

    public vm= new ViewModel();
    public listVm= new ListViewModel();
    public filters= new EventFiltersVm();
    public sources: string[]= [];

    private _monitor: PowershellMonitor;
    private _allEvents: Event[] = [];   //all events of the log
    private _events: Event[] =[];       //after filter
    private _onNewSubscription: Subscription;
    //#endregion Constructor & Properties


    //#region Angular Methods
    ngOnInit(): void {
        this.listVm.loading = true;
        this.changeDetRef.markForCheck();
        
        this._monitor = new PowershellMonitor(this.eventLog);
        this._monitor.initialize(this.showOnlyNewEvents).then((events :Event[]) => {
            this._allEvents = events;
            this._refreshList();
        });

        this._onNewSubscription = this._monitor.observable$.subscribe((newEvents :Event[]) => {
            this._onNewEvents(newEvents);
        });

        PowershellCommands.eventLogSources(this.eventLog)
        .then(sources => this.sources = sources);
    }

    ngOnDestroy(): void {
        if (this._onNewSubscription) this._onNewSubscription.unsubscribe();
        if (this._monitor) this._monitor.dispose();
    }
    //#endregion Angular Methods


    //#region Implementation

    private _showNextItems(): void {
        const elements2show = Math.min(this.listVm.events.length + Constants.PageNumber, this._events.length);
        this.listVm.events = this._events.slice(0,elements2show);

        this.listVm.hasMore = this.listVm.events.length < this._events.length;
        this.changeDetRef.markForCheck();
    }

    private _refreshList(): void {
        this._events = this.filters.isEmpty() ? [...this._allEvents]
        : this._allEvents.filter(e => this.filters.eventPassesFilters(e));
        // initialize ui variables
        this.listVm = new ListViewModel();
        this.unreadEventsUpdated.emit(0);
        this.listVm.countAll = this._allEvents.length;
        this.listVm.countFiltered = this._events.length;
        // get data
        this._showNextItems();
    }

    private _onNewEvents(newEvents: Event[]): void {
        // add to list
        this._allEvents.unshift(...newEvents);
        // add to sources if not exists
        this.sources = [...this.sources, ...newEvents
            .filter((e: Event) => this.sources.find(i => e.Source == i) == null)
            .map(e => e.Source)
        ];
        // check if there are new
        const newEventsWithFilters = this.filters.isEmpty() || !!newEvents.find(e => this.filters.eventPassesFilters(e));
        if (!newEventsWithFilters) return;
        //notify ui
        this.listVm.hasNew = true;
        this.unreadEventsUpdated.emit(this._allEvents.length - this._events.length);
        if (this.vm.autoRefresh && this.isComponentVisible()) {
            this._refreshList();
        }
        this.changeDetRef.markForCheck();
    }

    private _clearEvents(): void {
        PowershellCommands.clearEventLog(this.eventLog)
        .then(() => {
            this._allEvents = [];
            this._refreshList();
        });
    }

    private isComponentVisible(): boolean {
        return this.elementRef.nativeElement.offsetParent != null;
    }
    //#endregion Implementation


    //#region UiCallbacks
    public uiOnRefreshClicked(): void {
        this._refreshList();
    }

    public uiOnMoreClicked(): void {
        this._showNextItems();
    }

    public uiOnClearClicked(): void {
        GlobalUtils.runningAsAdmin(this.modalService)
        .then((res:boolean) => {
            if (!res) {
                return;
            }

            this.modalService.confirm({
                nzTitle: `Clear all events from ${this.eventLog.log}?`
                ,nzCancelText: 'Cancel'
                ,nzOkText: 'Yes'
                ,nzOkType: 'danger'
                ,nzOnOk: () => this._clearEvents()
            });
        });
    }

    public uiOnFiltersChanged(filters: EventFiltersVm): void {
        this.filters = new EventFiltersVm(filters);
        this._refreshList();
    }
    //#endregion UiCallbacks
}

class ListViewModel {
    public loading: boolean = false;
    public hasNew: boolean = false;
    //Counters
    public countAll: number = 0;
    public countFiltered: number = 0;
    // List
    public events: Event[] = [];
    public hasMore: boolean = false;

    constructor(events?: Event[]) {
        this.events = events || [];
    }
}

class ViewModel {
    // Buttons
    public autoRefresh: boolean = false; 
}