import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DepartureTabsPage } from "../pages/tabs/departure-tabs";
import { DepartureModule } from '../providers/departure/departure';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = "DepartureLoadingPage";

  constructor(
    private mAppModule: DepartureModule,
    platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleLightContent();
      splashScreen.hide();
    });
    this.mAppModule.startTrackerWithId();
    this.mAppModule.setAllowIDFACollection(true);
    this.mAppModule.trackView();
  }
}
