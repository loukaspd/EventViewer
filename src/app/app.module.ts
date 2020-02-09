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
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
registerLocaleData(en);
//#region Components
import { AppComponent } from './app.component';
import { MainComponent } from './components/main.component'
import { EventViewerComponent } from './components/event-viewer/event-viewer.component';
import { EventViewerFiltersComponent } from './components/event-viewer/event-viewer-filters/event-viewer-filters.component';
import { LogSelectionComponent } from './components/log-selection/log-selection.component';
import { EventIconComponent } from './components/shared/event-icon/event-icon.component';
//#endregion Components
//#endregion Imports

@NgModule({
  declarations: [
    AppComponent
    ,MainComponent
    ,LogSelectionComponent
    ,EventViewerComponent
    ,EventViewerFiltersComponent
    
    ,EventIconComponent
  ],
  entryComponents: [
    LogSelectionComponent //used inside dialog
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}