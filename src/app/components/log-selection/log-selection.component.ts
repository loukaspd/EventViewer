//#region imports
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { EventLog } from '../../types/EventLog';
import { PowershellService } from '../../services/powershell/powershell.service';
import { NzModalRef } from 'ng-zorro-antd';
import { Subscription, fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
//#endregion imports

@Component({
    selector: 'log-selection',
    templateUrl: 'log-selection.component.html'
})
export class LogSelectionComponent implements OnInit, OnDestroy {
    
    //#region Constructor & Properties
    constructor(private psService: PowershellService
        , private modal: NzModalRef
    ) { }
    private _searchSubscription: Subscription;

    public loading: boolean= true;
    private _logers: EventLog[] = [];
    public logers: EventLog[] = [];
    private _searchValue: string = '';
    public remoteComputer: string = '';
    //#endregion Constructor & Properties


    //#region Component Methods
    ngOnInit(): void {
        this.search();
        this._setupSearch();
    }

    ngOnDestroy(): void {
        if (!!this._searchSubscription) this._searchSubscription.unsubscribe();
    }
    //#endregion Component Methods


    //#region Implementation
    private _setupSearch() :void {
        if (!!this._searchSubscription) return;
        
        const target = document.getElementById('searchInput');
        if (!target) {
            setTimeout(() => this._setupSearch(), 300);
            return;
        } 

        this._searchSubscription = fromEvent(target, 'keyup')
        .pipe(
            map((e: any) => e.target.value)
            ,debounceTime(300)
        )
        .subscribe((searchValue: string)=> {
            this._searchValue = searchValue.toLowerCase();
            this._applyFiltering();
        });
    }

    private search(): void {
        this.loading = true;
        this.psService.getEventLogs(this.remoteComputer)
        .then((evs: EventLog[]) => {
            this._logers = evs;
            this.loading = false;
            this._applyFiltering();
        });
    }

    private _applyFiltering(): void {
        this.logers = this._logers.filter(l => !this._searchValue || l.log.toLowerCase().indexOf(this._searchValue) >=0);
    }

    //#endregion Implementation


    //#region UiCallbacks
    public onItemSelected(item: EventLog): void {
        this.modal.close(item);
    }
    //#endregion UiCallbacks

}