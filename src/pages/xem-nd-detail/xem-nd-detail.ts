import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, PopoverController } from 'ionic-angular';
import { DepartureModule } from '../../providers/departure/departure';
import { Utils } from '../../providers/app-utils';
import { XEMNDPopover } from './popover';
import { Keyboard } from '@ionic-native/keyboard';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the XemNdDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-xem-nd-detail',
  templateUrl: 'xem-nd-detail.html',
})
export class XemNdDetailPage {
  @ViewChild("input") input;
  data: any;
  dataJSON : any;
  isLoading: boolean = true;
  isZoom : boolean = false;
  constructor(
    private statusBar: StatusBar,
    public keyboard : Keyboard,
    public popover: PopoverController,
    private toasController: ToastController,
    private mAppModule: DepartureModule,
    public navCtrl: NavController, public navParams: NavParams) {
    if (!this.mAppModule.mIsOnIOSDevice) this.statusBar.backgroundColorByHexString("#274c7c");
    this.keyboard.disableScroll(true);
  }
  ionViewDidLoad() {
    this.data = this.navParams.get("data");
    this.mAppModule.getXEMNDDataJSON(this.data.data).then(
      data=>{
        this.dataJSON = data;
      },error=>{}
    )
    this.isLoading = false;
  }
  closeView(){
    this.navCtrl.pop();
  }
  viewDescription(){
    if (this.input.value) {
      let text = this.input.value;
      let number = parseInt(text);
      if( number > 0 && number<=this.dataJSON.length){
        let popover = this.popover.create(XEMNDPopover,{
          description : this.dataJSON[number-1].content
        })
        popover.present({
          animate: false
        });
      }else{
        alert("Số không tồn tại")
      }
    } else {
      let toast = this.toasController.create({
        message: "Bạn chưa nhập số",
        duration: 1000,
        position: "bottom",
      })
      toast.present();
    }
  }
  zoom(){
    this.isZoom = !this.isZoom;
    if(this.isZoom){
      document.getElementById("img").style.width =  (document.getElementById("img").clientWidth * 2)+ "px";
    }else{
      document.getElementById("img").style.width =  (document.getElementById("img").clientWidth / 2)+ "px";
    }
  }
}
