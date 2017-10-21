import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DepartureModule } from '../../providers/departure/departure';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the NumberRichDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-number-rich-detail',
  templateUrl: 'number-rich-detail.html',
})
export class NumberRichDetailPage {
  data: any;
  isLoading : boolean = true;
  constructor(
    private statusBar: StatusBar,
    private mAppModule: DepartureModule,
    public navCtrl: NavController, public navParams: NavParams) {
  }
  ionViewDidEnter() {
    this.data = this.navParams.get("data");
    this.isLoading = false;
    if (!this.mAppModule.mIsOnIOSDevice) this.statusBar.backgroundColorByHexString("#274c7c");
  }
  closeView(){
    this.navCtrl.pop();
  }

}
