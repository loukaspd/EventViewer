import { Component, ViewChild } from "@angular/core";
import { NzModalRef } from "ng-zorro-antd";
import { LogSelectionComponent } from "./log-selection/log-selection.component";

@Component({
    selector: 'event-logs-management',
    templateUrl: 'event-logs-management.component.html'
})
export class EventLogsManagementComponent {
    //#region Constructor - Input & Outputs
    constructor(private modal: NzModalRef) {}
    //#endregion Constructor - Input & Outputs


    //#region Component Properties
    @ViewChild(LogSelectionComponent,null) child:LogSelectionComponent;
    //#endregion Component Properties


    //#region Ui Events
    public UiOnLogSelected(info: any) : void {
        this.modal.close(info);
    }

    public UiOnEventLogAdded(): void {
        this.child.refreshLogs();
    }
    //#endregion Ui Events
}