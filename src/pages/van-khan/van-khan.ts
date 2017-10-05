import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DepartureModule } from '../../providers/departure/departure';

/**
 * Generated class for the VanKhanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-van-khan',
  templateUrl: 'van-khan.html',
})
export class VanKhanPage {
  data : any;
  item_height = screen.height / 10 + "px";
  list_height = (screen.height - 56) + "px";
  constructor(
    private mAppModule: DepartureModule,
    public navCtrl: NavController, public navParams: NavParams) {
  }
  ngOnInit(){
    this.data = this.mAppModule.getVanKhanValue();
    if(!this.data){
      this.mAppModule.getVanKhanDataJSON().then(
        data=>{
          this.data   = data;
        },error=>{}
      )
    }
  }
  ionViewDidLoad() {
    
  }
  viewItem(item){
    if(item.VanKhan){
      this.navCtrl.push("VanKhanCtPage",{
        data: item
      });
    }
  }
  closeView(){
    this.navCtrl.pop();
  }
}
