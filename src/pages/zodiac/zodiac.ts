import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DepartureModule } from '../../providers/departure/departure';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the ZodiacPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-zodiac',
  templateUrl: 'zodiac.html',
})
export class ZodiacPage {
  data: any;
  isLoading: boolean = true;
  constructor(
    private mAppModule: DepartureModule,
    private statusBar : StatusBar,
    public navCtrl: NavController, public navParams: NavParams) {
  }
  ionViewDidEnter() {
    if (!this.mAppModule.mIsOnIOSDevice) this.statusBar.backgroundColorByHexString("#274c7c");
    this.loadData();
  }

  loadData(){
    if(this.data)return;
    this.mAppModule.getZodiacDataJSON().then(
      data=>{
        this.data = data;
        this.isLoading = false;
      },error =>{}
    )
  }

  viewDetail(id:string){
    let index = parseInt(id);
    this.navCtrl.push("ZodiacDetailPage",{
      data: this.data[index]
    })
  }

  getDataImage(id: string): string{
    let index = parseInt(id);
    return this.mAppModule.getZodiacImage(index);
  }

  getItemName(name: string): string{
    return name.split("(")[1].split(")")[0];
  }

  closeView(){
    this.navCtrl.pop();
  }

}
