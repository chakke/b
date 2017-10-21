import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the GiaiMongDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-giai-mong-detail',
  templateUrl: 'giai-mong-detail.html',
})
export class GiaiMongDetailPage {
  data: any;
  isLoading: boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
    this.data = this.navParams.get("data");
    this.isLoading = false;
  }
  closeView(){
    this.navCtrl.pop();
  }

}
