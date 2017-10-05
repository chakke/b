import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DepartureTabsPage } from "../pages/tabs/departure-tabs";
import { DatePicker } from "@ionic-native/date-picker";
import { DepartureModule } from "../providers/departure/departure";
import { HttpService } from "../providers/http-service";
import { DeviceInfoProvider } from "../providers/device-info/device-info";
import { HttpModule } from "@angular/http";
import { SpecicalDatePopover } from '../pages/special-date/special-date-popover';

@NgModule({
  declarations: [
    MyApp,
    DepartureTabsPage,
    SpecicalDatePopover
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{
      iconMode: 'ios',
      tabsHideOnSubPages: true
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DepartureTabsPage,
    SpecicalDatePopover
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DepartureModule,
    DatePicker,    
    HttpService,
    DeviceInfoProvider,
  ]
})
export class AppModule {}
