import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { DepartureModule } from '../../providers/departure/departure';
import { SpecicalDatePopover } from './special-date-popover';

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
  cavalDL_data : any;
  cavalAL_data : any;
  isLoading : boolean = true;  
  calendar : string = "solar";  
  item_height = 30 + "px";
  content_height = screen.height - 96 + "px";
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private mAppModule: DepartureModule,
    public popover: PopoverController
  ) {
  }

  ionViewDidEnter() {
      this.item_height = (screen.height / 10) + "px";
      this.cavalAL_data = this.mAppModule.getValueDataLeVNAL();
      this.cavalDL_data = this.mAppModule.getValueDataLeVNDL();
      console.log(this.cavalAL_data);
      console.log(this.cavalDL_data);
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
    let solarDate = parseInt(day.date.split("-")[0]);
    let solarMonth = parseInt(day.date.split("-")[1]); 
    let solarYear = new Date().getFullYear();
    if(day.description){
      this.navCtrl.push("DayDetailPage",{
        dd: solarDate,
        mm: solarMonth,
        yy: solarYear,
      })
    }
  }
  getLunarDate(solardate){
    let solarDate = parseInt(solardate.split("-")[0]);
    
    let solarMonth = parseInt(solardate.split("-")[1]); 
    
    let solarYear = new Date().getFullYear();
    
    let lunarDay = this.mAppModule.convertSolarToLunar(solarDate,solarMonth,solarYear);
    
    return lunarDay[0]+"/"+lunarDay[1];
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
}
