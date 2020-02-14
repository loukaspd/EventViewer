//#region imports
import { Component, OnInit } from '@angular/core';
import { EventLog } from '../types/EventLog';
import { NzModalService, NzTabChangeEvent } from 'ng-zorro-antd';
import { LogSelectionComponent } from './log-selection/log-selection.component';
//#endregion imports

@Component({
  selector: 'main-component',
  templateUrl: 'main.component.html'
})
export class MainComponent implements OnInit{
  //#region Constructor & Properties
  constructor(private modalService: NzModalService) { }
  public activeIndex: number = 0;
  public tabs: EventLog[] = [];
  public tabsWithNewContent: boolean[] = [];
  //#endregion Constructor & Properties


  //#region Component Methods
  ngOnInit(): void {
    this._showSelectionDialog();
  }
  //#endregion Component Methods


  //#region Implementation
  private _showSelectionDialog() {
    const modal = this.modalService.create({
      nzContent: LogSelectionComponent
      ,nzClosable: false
      ,nzFooter: null
    });
    modal.afterClose.subscribe((eventViewer: EventLog) => this.onEventLogSelected(eventViewer));
  }
  //#endregion Implementation

  //#region Ui Callbacks
  public onAddClicked(): void {
    this._showSelectionDialog();
  }

  public closeTab(index: number): void {
    this.tabs.splice(index,1);
    this.tabsWithNewContent.splice(index,1);

    if (this.tabs.length == 0) this._showSelectionDialog();
  }

  public onEventLogSelected(eventLog: EventLog) {
    if (!eventLog) return;
    const index = this.tabs.findIndex(t => t.IsSame(eventLog));
    if (index >=0) {
      this.activeIndex = index;
      return;
    }
    this.tabs.push(eventLog);
    this.tabsWithNewContent.push(false);
    this.activeIndex = this.tabs.length-1;
  }
  //#endregion Ui Callbacks


}

