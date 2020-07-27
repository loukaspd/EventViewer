//#region Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// antd
import { NgZorroAntdModule} from 'ng-zorro-antd';
import { NZ_I18N, en_US } from 'ng-zorro-antd';  //used by datepicker
import { registerLocaleData, DatePipe } from '@angular/common';
import en from '@angular/common/locales/en';
registerLocaleData(en);
//#region Components
import { AppComponent } from './app.component';
import { MainComponent } from './components/main.component'
import { EventViewerComponent } from './components/event-viewer/event-viewer.component';
import { EventViewerFiltersComponent } from './components/event-viewer/event-viewer-filters/event-viewer-filters.component';
import { EventLogsManagementComponent } from './components/event-logs-management-dialog/event-logs-management.component'
import { LogSelectionComponent } from './components/event-logs-management-dialog/log-selection/log-selection.component';
import { LogCreationComponent } from './components/event-logs-management-dialog/log-creation/log-creation.component';
import { EventIconComponent } from './components/shared/event-icon/event-icon.component';
import { EventEntryItemComponent } from './components/event-viewer/event-entry-item/event-entry-item.component';
import { SidebarEventsComponent } from './components/sidebar-events/sidebar-events.component';
//#endregion Components
//#endregion Imports

@NgModule({
  declarations: [
    AppComponent
    ,MainComponent
    ,LogSelectionComponent
    ,LogCreationComponent

    ,SidebarEventsComponent
    ,EventViewerComponent
    ,EventViewerFiltersComponent
    ,EventLogsManagementComponent
    
    ,EventIconComponent
    ,EventEntryItemComponent
  ],
  entryComponents: [
    EventLogsManagementComponent //used inside dialog
  ],
  imports: [
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader
        ,useFactory: HttpLoaderFactory
        ,deps: [HttpClient]
      }
    }),
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US }
    ,DatePipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}