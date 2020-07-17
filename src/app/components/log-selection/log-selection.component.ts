//#region imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventLog } from '../../types/EventLog';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { Subscription, fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { PowershellCommands } from '../../services/powershell/powershell-commands';
import { GlobalUtils } from '../../services/global-utils';
//#endregion imports

@Component({
    selector: 'log-selection',
    templateUrl: 'log-selection.component.html'
})
export class LogSelectionComponent implements OnInit, OnDestroy {
    
    //#region Constructor & Properties
    constructor(private modalService: NzModalService
        , private modal: NzModalRef) { }

    private _searchInputSub: Subscription;

    public loading: boolean= true;
    private _logers: EventLog[] = [];
    public logers: EventLog[] = [];
    private _searchValue: string = '';
    public remoteComputer: string = '';
    //#endregion Constructor & Properties


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
        .catch(ex => {
            console.log(ex);
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
            nzOnOk: () => this.modal.close({eventLog: item, showOnlyNew:false}),
            nzCancelText: 'New Only',
            nzOnCancel: () => this.modal.close({eventLog: item, showOnlyNew:true})
          });
    }

    public UiOnSearchClicked(): void {
        this._search();
    }

    public UiOnRemoveItemClicked(item: EventLog): void {
        GlobalUtils.runningAsAdmin()
        .then((res:boolean) => {
            if (!res) {
                this.modalService.error({
                    nzTitle: 'Error'
                    ,nzContent: 'Run the app as admin to execute this action'
                  });
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