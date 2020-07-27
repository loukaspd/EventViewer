//#region imports
import { Component, OnInit } from '@angular/core';
import { EventLog } from '../types/EventLog';
import { NzModalService } from 'ng-zorro-antd';
import { EventLogsManagementComponent } from './event-logs-management-dialog/event-logs-management.component';

//#endregion imports

@Component({
  selector: 'main-component',
  templateUrl: 'main.component.html',
  styleUrls: ['main.component.css']
})
export class MainComponent implements OnInit{
  //#region Constructor & Properties
  constructor(private modalService: NzModalService) { }
  public activeIndex: number = 0;
  public tabs: EventLog[] = [];
  public tabsShowOnlyNewEvents: boolean[] = [];
  public tabsWithNewContent: Number[] = [];
  //#endregion Constructor & Properties


  //#region Component Methods
  ngOnInit(): void {
    this._showSelectionDialog();
  }
  //#endregion Component Methods


  //#region Implementation
  private _showSelectionDialog() {
    const modal = this.modalService.create({
      nzContent: EventLogsManagementComponent
      ,nzClosable: false
      ,nzFooter: null
    });
    modal.afterClose.subscribe(param => this.onEventLogSelected(param));
  }
  //#endregion Implementation

  //#region Ui Callbacks
  public onAddClicked(): void {
    this._showSelectionDialog();
  }

  public closeTab(index: number): void {
    this.tabs.splice(index,1);
    this.tabsShowOnlyNewEvents.splice(index,1);
    this.tabsWithNewContent.splice(index,1);

    if (--this.activeIndex < 0) this.activeIndex = Math.max(this.tabs.length -1, 0);

    if (this.tabs.length == 0) this._showSelectionDialog(); 
  }

  public onEventLogSelected(param: {eventLog: EventLog, showOnlyNew:boolean}) {
    if (!param || !param.eventLog) return;
    const index = this.tabs.findIndex(t => t.IsSame(param.eventLog));
    if (index >=0) {
      this.activeIndex = index;
      return;
    }
    this.tabs.push(param.eventLog);
    this.tabsShowOnlyNewEvents.push(param.showOnlyNew);
    this.tabsWithNewContent.push(0);
    this.activeIndex = this.tabs.length-1;
  }
  //#endregion Ui Callbacks
}

