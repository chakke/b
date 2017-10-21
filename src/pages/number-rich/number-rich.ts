import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { DepartureModule } from '../../providers/departure/departure';
import { AppController } from '../../providers/app-controller';
import { Utils } from '../../providers/app-utils';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the NumberRichPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-number-rich',
  templateUrl: 'number-rich.html',
})
export class NumberRichPage {
  @ViewChild("input") input;
  data: any;
  tableLetter = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
  constructor(
    private statusBar: StatusBar,
    private toasController: ToastController,
    private mAppModule: DepartureModule,
    public navCtrl: NavController, public navParams: NavParams) {
  }
  ionViewDidEnter() {
    this.getData();
    if (!this.mAppModule.mIsOnIOSDevice) this.statusBar.backgroundColorByHexString("#274c7c");
  }
  closeView(){
    this.navCtrl.pop();
  }
  viewDescription() {
    if (this.input.value) {
      let text = this.input.value;
      text = Utils.bodauTiengViet(text);
      let number = this.getNumber(text)%9;
      this.navCtrl.push("NumberRichDetailPage",{
        data: this.getContentNumber(number)
      })
    } else {
      let toast = this.toasController.create({
        message: "Input text",
        duration: 1000,
        position: "bottom",
      })
      toast.present();
    }
  }
  getContentNumber(number: number){
    if(number==0){
      return this.data[8];
    }else{
      return this.data[number-1];
    }
  }
  getNumber(text: string): number {
    let array = text.split("");
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < this.tableLetter.length; j++) {
        if (array[i] == this.tableLetter[j]) {
          sum +=j+1;
        }
      }
    }
    return sum;
  }
  getData() {
    this.mAppModule.getNumberRichDataJSON().then(
      data => {
        this.data = data;
      }, error => { }
    )
  }

}
