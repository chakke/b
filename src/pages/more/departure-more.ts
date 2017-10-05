import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { DepartureModule } from '../../providers/departure/departure';


@IonicPage()
@Component({
  selector: 'page-departure-more',
  templateUrl: 'departure-more.html',
})
export class DepartureMorePage {
  more_options = [];
  cavalVNAL: any;
  cavalVNDL: any;
  vankhan_data : any;
  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private mAppModule: DepartureModule,
    private platform : Platform
  ) {
    this.more_options = this.mAppModule.getOptions();
  }
  ionViewDidEnter(){
    if(!this.cavalVNAL){
      this.mAppModule.getCavalVNALDataJSON().then(
        data=>{
          this.cavalVNAL = data;
        },error =>{}
      )
    }
    if(!this.vankhan_data){
      this.mAppModule.getVanKhanDataJSON().then(
        data=>{
          this.vankhan_data = data;
        },error =>{}
      )
    }
    if(!this.cavalVNDL){
      this.mAppModule.getCavalVNDLDataJSON().then(
        data=>{
          this.cavalVNDL = data;
        },error =>{}
      )
    }
  }
  viewPage(component: string){
    this.navCtrl.push(component);
  }
}
