import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams } from 'ionic-angular';
import { DepartureModule } from "../../providers/departure/departure";
import { AppModule } from "../../providers/app-module";
import { AppController } from "../../providers/app-controller";
import { AdMobFree } from "@ionic-native/admob-free";
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { DepartureTabsPage } from "../tabs/departure-tabs";
@IonicPage()
@Component({
  selector: 'page-departure-loading',
  templateUrl: 'departure-loading.html',
})
export class DepartureLoadingPage {
  constructor(
    public mAdmobfree: AdMobFree,
    public mGoogleAnalytics: GoogleAnalytics,
    private mPlatform: Platform,
    private navParams: NavParams,
    private navCtrl: NavController,
    private mAppModule: DepartureModule,
  ) {

  }

  ionViewDidEnter() {
    AppController.getInstance().setPlatform(this.mPlatform);
    this.mAppModule.mIsOnIOSDevice = AppController.getInstance().isIOS();
   this.mAppModule.mAdsManager.setAdmobFree(this.mAdmobfree);
   this.mAppModule.mAnalyticsManager.setGoogleAnalytics(this.mGoogleAnalytics);


    this.mAppModule.loadConfig().then(
      () => {
        this.onLoadedConfig();
      }
    );

  }

  onLoadedConfig() {

    let assets = this.mAppModule.getAppConfig().get("resources");
    AppModule.getInstance().getResourceLoader().load(assets).then(
      () => {
        this.onLoaded();
      }
    );


  }

  onLoaded() {
    this.navCtrl.setRoot(DepartureTabsPage, {}, {
      animate: true,
      direction: "forward",
      duration: 400
    });
  }
}
