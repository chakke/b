import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Calendar } from '../../providers/departure/class/calendar';
import { DepartureModule } from '../../providers/departure/departure';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the SelectDateDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-date-detail',
  templateUrl: 'select-date-detail.html',
})
export class SelectDateDetailPage {
  data : any;
  date : string = "";
  month : any;
  year : any;
  calendar : Calendar;
  isLoading : boolean = true;
  constructor(
    private mAppModule: DepartureModule,
    private statusBar: StatusBar,
    public navCtrl: NavController, public navParams: NavParams) {
    if (!this.mAppModule.mIsOnIOSDevice) this.statusBar.backgroundColorByHexString("#274c7c");
  }

  ionViewDidLoad() {
    this.getParams();
    this.isLoading = false;
  }

  getParams(){
    this.data = this.navParams.get("data");
    this.month = this.navParams.get("month");
    this.year = this.navParams.get("year");
    this.calendar = new Calendar(this.month - 1,this.year);
    this.getDay();
  }

  getDay(){
    if(this.data.date){
      let array = this.data.date.split(", ");
      let days = [];
      for(let i = 0;i<array.length;i++){
        for(let j = 0;j<this.calendar.days.length;j++){
          if(this.calendar.days[j] != null && array[i].toLowerCase() == this.calendar.days[j].canchiDay.toLowerCase()){
           days.push(this.calendar.days[j].date.getDate());
          }
        }
      }
      days = days.sort((a,b)=>{return a-b;});
      this.date = days.toString();      
    }
  }
  closeView(){
    this.navCtrl.pop();
  }

}
