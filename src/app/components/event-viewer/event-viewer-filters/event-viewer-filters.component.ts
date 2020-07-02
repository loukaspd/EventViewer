//#region imports
import { Component, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
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
    public filters: EventFiltersVm;

    public filterText: string = '';
    public dropdownVisible: boolean = false;
    //#endregion Public Api
    //#region Constructor & Properties
    constructor() { }
    public eventLevels: string[] = GlobalUtils.enumValuesToArray(EventEntryTypes);
    //#endregion Constructor & Properties


    //#region Component Methods
    ngOnChanges(changes: SimpleChanges) {
        this.filterText = changes.filters.currentValue.searchTerm;
    }
    //#endregion Component Methods


    //#region Implementation
    //#endregion Implementation


    //#region Ui callbacks
    public UiOnSearchMessageClicked(): void {
        this.filters.searchTerm = this.filterText;
        this.dropdownVisible = false;
        this.onFiltersChanged.emit(this.filters);
    }

    public UiOnEventTypeClicked(eventType: EventEntryTypes): void {
        this.filters.eventEntryTypes.push(eventType);
        this.onFiltersChanged.emit(this.filters);
    }

    public UiOnRemoveClicked(filter: string): void {
        this.filters.eventEntryTypes = this.filters.eventEntryTypes
        .filter(et => et.toString().indexOf(filter) < 0);
        this.onFiltersChanged.emit(this.filters);
    }

    public UiOnRemoveSearchClicked(): void {
        this.filters.searchTerm = '';
        this.onFiltersChanged.emit(this.filters);
    }

    //#endregion UI callbacks


    //#region UiHelpers
    public UiEventEntriesToShow(): string[] {
        return GlobalUtils.enumValuesToArray(EventEntryTypes)
            .filter(et => this.filters.eventEntryTypes.map(i => i.toString()).indexOf(et) < 0);
    }
    //#endregion


}