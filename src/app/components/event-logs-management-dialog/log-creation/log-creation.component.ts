import { Component, Output, EventEmitter } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { PowershellCommands } from '../../../services/powershell/powershell-commands';
import { AppLogger } from '../../../services/AppLogger';
import { GlobalUtils } from '../../../services/global-utils';

@Component({
    selector: 'log-creation',
    templateUrl: 'log-creation.component.html'
})
export class LogCreationComponent {
    //#region Constructor - Inputs & Outputs
    @Output()
    public onEventSourceAdded = new EventEmitter();

    constructor(private modalService: NzModalService) 
    {}
    //#endregion Constructor - Inputs & Outputs


    //#region Component Properties
    public UiVm = new ViewModel();
    //#endregion Component Properties


    //#region Implementation

    private _addLogValidateInput(): boolean {
        if (!this.UiVm.logName) {
            this.modalService.error({
                nzTitle: 'Error'
                ,nzContent: 'logName cannot be empty'
            });
            return false;
        }

        if (!this.UiVm.source) {
            this.modalService.error({
                nzTitle: 'Error'
                ,nzContent: 'source cannot be empty'
            });
            return false;
        }
        return true;
    }

    private _addLog(): void {
        PowershellCommands.newEventLog(this.UiVm.logName, this.UiVm.source, null)
        .then((output: string) => {
            this.modalService.success({
                nzTitle: ''
                ,nzContent: 'Event Log and Source created'
            });
            this.onEventSourceAdded.emit();
            this.UiVm = new ViewModel();
        })
        .catch((e: Error) => {
            AppLogger.getInstance().logError(e);
            this.modalService.error({
                nzTitle: 'Something went wrong'
                ,nzContent: 'press "apply" button to retry'
            });
        });
    }
    //#endregion Implementation


    //#region Ui Events
    public UiOnAddClicked(): void {
        GlobalUtils.runningAsAdmin(this.modalService)
        .then((res:boolean) => {
            if (!res) {
                return;
            }

            if (!this._addLogValidateInput()) return;

            this._addLog();
        });
    }
    //#endregion Ui Events
}


class ViewModel {
    public logName :string = '';
    public source :string = '';
}