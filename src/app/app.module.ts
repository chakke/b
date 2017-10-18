import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DepartureTabsPage } from "../pages/tabs/departure-tabs";
import { DepartureModule } from "../providers/departure/departure";
import { HttpService } from "../providers/http-service";
import { DeviceInfoProvider } from "../providers/device-info/device-info";
import { HttpModule } from "@angular/http";
import { SpecicalDatePopover } from '../pages/special-date/special-date-popover';
import { AdMobPro } from '@ionic-native/admob-pro';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
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
      tabsHideOnSubPages: true,
      pageTransition: "ios-transition"
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
    HttpService,
    DeviceInfoProvider,
    AdMobPro,
    GoogleAnalytics
  ]
})
export class AppModule {}
