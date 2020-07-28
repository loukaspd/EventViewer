//#region imports
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { EventLog } from '../../../types/EventLog';
import { NzModalService } from 'ng-zorro-antd';
import { Subscription, fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { PowershellCommands } from '../../../services/powershell/powershell-commands';
import { GlobalUtils } from '../../../services/global-utils';
import { AppLogger } from '../../../services/AppLogger';
//#endregion imports

@Component({
    selector: 'log-selection',
    templateUrl: 'log-selection.component.html'
})
export class LogSelectionComponent implements OnInit, OnDestroy {
    
    //#region Constructor Input - Outputs
    @Output()
    public onLogSelected = new EventEmitter<any>();
    
    constructor(private modalService: NzModalService) { }

    public refreshLogs(): void {
        this._search();
    }
    //#endregion Constructor Input - Outputs


    //#region Component Variables
    private _searchInputSub: Subscription;

    public loading: boolean= true;
    private _logers: EventLog[] = [];
    public logers: EventLog[] = [];
    private _searchValue: string = '';
    public remoteComputer: string = '';
    //#endregion Component Variables


    //#region Component Methods
    ngOnInit(): void {
        this._search();
        this._setupSearch();
    }

    ngOnDestroy(): void {
        if (!!this._searchInputSub) this._searchInputSub.unsubscribe();
    }
    //#endregion Component Methods


    //#region Implementation
    private _setupSearch() :void {
        if (!!this._searchInputSub) return;
        
        const target = document.getElementById('searchInput');
        if (!target) {
            setTimeout(() => this._setupSearch(), 300);
            return;
        } 

        this._searchInputSub = fromEvent(target, 'keyup')
        .pipe(
            map((e: any) => e.target.value)
            ,debounceTime(300)
        )
        .subscribe((searchValue: string)=> {
            this._searchValue = searchValue.toLowerCase();
            this._applyFiltering();
        });
    }

    private _search(): void {
        this._logers = [];
        this.loading = true;
        PowershellCommands.getEventLogs(this.remoteComputer)
        .then((evs: EventLog[]) => {
            this._logers = evs;
            this.loading = false;
            this._applyFiltering();
        })
        .catch((e: Error) => {
            this.modalService.error({
                nzTitle: 'Something went wrong'
                ,nzContent: 'press "apply" button to retry'
              });
        })
        .finally(() => this.loading = false);
    }

    private _applyFiltering(): void {
        this.logers = this._logers.filter(l => !this._searchValue || l.log.toLowerCase().indexOf(this._searchValue) >=0);
    }


    private _removeEventLog(item: EventLog) {
        this.loading = true;
        PowershellCommands.removeEventLog(item)
        .then(() => {
            this._search();
        })
        .catch(e => {
            AppLogger.getInstance().logError(e);
            this.modalService.error({
                nzTitle: 'Something went wrong'
                ,nzContent: 'please try again'
            });
        })
        .finally(() => this.loading = false);
    }

    //#endregion Implementation


    //#region UiCallbacks
    public UiOnItemSelected(item: EventLog): void {
        this.modalService.confirm({
            nzTitle: 'Which events to show?',
            nzContent: '',
            nzOkText: 'All events',
            nzOnOk: () =>  this.onLogSelected.emit({eventLog: item, showOnlyNew:false}),
            nzCancelText: 'New Only',
            nzOnCancel: () => this.onLogSelected.emit({eventLog: item, showOnlyNew:true})
          });
    }

    public UiOnSearchClicked(): void {
        this._search();
    }

    public UiOnRemoveItemClicked(item: EventLog): void {
        GlobalUtils.runningAsAdmin(this.modalService)
        .then((res:boolean) => {
            if (!res) {
                return;
            }

            this.modalService.confirm({
                nzTitle: `Remove EventLog ${item.log} ?`
                ,nzCancelText: 'Cancel'
                ,nzOkText: 'Yes'
                ,nzOkType: 'danger'
                ,nzOnOk: () => this._removeEventLog(item)
            });
        });
    }
    //#endregion UiCallbacks

}