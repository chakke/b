import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the VanKhanCtPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-van-khan-ct',
  templateUrl: 'van-khan-ct.html',
})
export class VanKhanCtPage {
  data: any;
  van_khan_td: string;
  van_khan: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  ngOnInit(){
    this.data = this.navParams.get("data");
    this.van_khan_td = this.data.TenLoai;
    this.van_khan = this.data.VanKhan;
   
  }

  ionViewDidLoad() {
    
  }

}
