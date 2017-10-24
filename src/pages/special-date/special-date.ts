import { Component,ViewChild } from '@angular/core';
import { IonicPage,Content, NavController, NavParams, PopoverController } from 'ionic-angular';
import { DepartureModule } from '../../providers/departure/departure';
import { SpecicalDatePopover } from './special-date-popover';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the SpecialDatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-special-date',
  templateUrl: 'special-date.html',
})
export class SpecialDatePage {
  @ViewChild(Content) content : Content;
  cavalDL_data : any;
  cavalAL_data : any;
  isLoading : boolean = true;  
  calendar : string = "solar";  
  item_height = 30 + "px";
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private mAppModule: DepartureModule,
    public popover: PopoverController,
    private statusBar : StatusBar
  ) {
    
  }

  ionViewDidEnter() {
    this.mAppModule.showAdvertisement();
    if(!this.mAppModule.mIsOnIOSDevice)this.statusBar.backgroundColorByHexString("#274c7c");
      this.item_height = (screen.height / 10) + "px";
      this.cavalAL_data = this.mAppModule.getValueDataLeVNAL();
      this.cavalDL_data = this.mAppModule.getValueDataLeVNDL();
      if(!this.cavalAL_data){
        this.mAppModule.getCavalVNALDataJSON().then(
          data=>{
            this.cavalAL_data = data;
          }
        )
      }
      if(!this.cavalDL_data){
        this.mAppModule.getCavalVNDLDataJSON().then(
          data=>{
            this.cavalDL_data = data;
          }
        )
      }
      this.isLoading = false;
  }
  goToDetail(day){
    if(this.calendar == "solar"){
      let solarDate = parseInt(day.date.split("-")[0]);
      let solarMonth = parseInt(day.date.split("-")[1]); 
      let solarYear = new Date().getFullYear();
      if(day.description){
        this.navCtrl.push("DayDetailPage",{
          dd: solarDate,
          mm: solarMonth,
          yy: solarYear,
          special_info: day.description
        })
      }
    }else{
      let lunarDate = parseInt(day.date.split("-")[0]);
      let lunarMonth = parseInt(day.date.split("-")[1]);
      let lunarYear = new Date().getFullYear();
      let solarDay = this.mAppModule.convertLunarToSolar(lunarDate,lunarMonth,lunarYear);
      if(day.description){
        this.navCtrl.push("DayDetailPage",{
          dd: solarDay[0],
          mm: solarDay[1],
          yy: solarDay[2],
          special_info: day.description
        })
      }
    }
  }
  getLunarDate(solardate){
    let solarDate = parseInt(solardate.split("-")[0]);
    
    let solarMonth = parseInt(solardate.split("-")[1]); 
    
    let solarYear = new Date().getFullYear();
    
    let lunarDay = this.mAppModule.convertSolarToLunar(solarDate,solarMonth,solarYear);
    
    return lunarDay[0]+"/"+lunarDay[1];
  }
  getSolarDate(lunardate){
    
    let lunarDate = parseInt(lunardate.split("-")[0]);
    
    let lunarMonth = parseInt(lunardate.split("-")[1]);
    
    let lunarYear = new Date().getFullYear();

    let solarDay = this.mAppModule.convertLunarToSolar(lunarDate,lunarMonth,lunarYear);
    
    return solarDay[0]+"/"+solarDay[1];
  }
  viewDescription(day){
    if(day.description){
      let popover = this.popover.create(SpecicalDatePopover,{
        description : day.description
      })
      popover.present({
        animate: false
      });
    }
  }
  closeView(){
    this.navCtrl.pop();
  }
  changeSegment(name : string){
    if(name!=this.calendar){
        this.content.scrollToTop(400);
        let element = document.getElementById("animateBar");
        if(name=="solar"){
          element.style.transform = "translate(0,0)";
        }
        if(name=="lunar"){
          element.style.transform = "translate("+(element.clientWidth)+"px"+",0)";
        }
    }
  }
  swipe($event){
    let direction = $event.direction;
    let element = document.getElementById("animateBar");
    if(this.calendar=="solar" && direction==2){
      this.content.scrollToTop(400);
      this.calendar= "lunar";
      element.style.transform = "translate("+(element.clientWidth)+"px"+",0)";
    }
    if(this.calendar=="lunar" && direction==4){
      this.content.scrollToTop(400);
      this.calendar= "solar";
      element.style.transform = "translate(0,0)";
    }
  }
}
