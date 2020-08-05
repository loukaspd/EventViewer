//#region imports
import { Component, Input } from '@angular/core';
import {Event} from '../../../types/Event';
import { GlobalUtils } from '../../../services/global-utils';
//#endregion imports

@Component({
    selector: 'event-entry-item',
    templateUrl: 'event-entry-item.component.html',
    styleUrls: ['./event-entry-item.component.css']
})
export class EventEntryItemComponent {
    //#region Constructor & Properties
    private _event: Event;
    @Input()
    set event(value :Event) {
        this._onInputChanged(value);
    }
    get event(): Event {return this._event;}

    public uiHasBigContent: boolean;
    public uiShowingAllContent: boolean;
    public uiEventMessage: String;
    
    //#endregion Constructor & Properties

    //#region Ui Methods
    public uiOnToggleClicked(expand: boolean) :void {
        this.uiShowingAllContent = expand;
        this.uiEventMessage = this.uiShowingAllContent 
            ? this._event.Message
            : this._messageSmallPart();
    }
    //#endregion

    //#region Implementation
    private _onInputChanged(event: Event): void {
        this._event = event;
        this.uiShowingAllContent = false;
        
        const messageLines = GlobalUtils.splitLines(this._event.Message);
        this.uiHasBigContent = messageLines.length > 2; //TODO
        
        this.uiEventMessage = !this.uiHasBigContent ? this._event.Message
        : this._messageSmallPart();
    }

    //TODO
    private _messageSmallPart(): string {
        const messageLines = GlobalUtils.splitLines(this._event.Message);

        return [messageLines[0],messageLines[1]].join('\n');
    }
    //#endregion Implementation
}