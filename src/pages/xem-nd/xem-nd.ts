import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DepartureModule } from '../../providers/departure/departure';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the XemNdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-xem-nd',
  templateUrl: 'xem-nd.html',
})
export class XemNdPage {
  data: any;
  isLoading: boolean = true;
  constructor(
    private statusBar: StatusBar,
    private mAppModule: DepartureModule,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter(){
    if (!this.mAppModule.mIsOnIOSDevice) this.statusBar.backgroundColorByHexString("#274c7c");
    this.data = this.mAppModule.getXEMND();
    this.isLoading = false;
  }
  closeView(){
    this.navCtrl.pop();
  }

  selectedItem(i : number){
    this.navCtrl.push("XemNdDetailPage",{
      data: this.data[i]
    })
  }

}
