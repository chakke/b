import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DepartureModule } from '../../providers/departure/departure';
import { AppModule } from '../../providers/app-module';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the SelectDatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-date',
  templateUrl: 'select-date.html',
})
export class SelectDatePage {
  rowHeight = 30;
  data: any;
  isLoading : boolean = true;
  dayInMonth = [];
  years = [];
  timeOutID = [];
  numberMidder = [0,0,0];
  divID = ["colum1","colum2","colum3"]
  constructor(
    private mAppModule: DepartureModule,
    private statusBar: StatusBar,
    public navCtrl: NavController, public navParams: NavParams) {
      if (!this.mAppModule.mIsOnIOSDevice) this.statusBar.backgroundColorByHexString("#274c7c");
      for(let i = 1;i<=12;i++){
        this.dayInMonth.push(i);
      }
      for(let i = 1900;i<2100;i++){
        this.years.push(i);
      }
  }

  ionViewDidLoad() {
    this.mAppModule.getSelectDateDataJSON().then(
      data=>{
        this.data = data;
      },error=>{}
    )
    this.addEventListener();
    this.goToDay();
    this.isLoading = false;
  }
  goToDay(){
    let date = new Date();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    document.getElementById(this.divID[1]).scrollTop = (month- this.dayInMonth[0]) * this.rowHeight;
    document.getElementById(this.divID[2]).scrollTop = (year - this.years[0]) * this.rowHeight;
  }
  addEventListener(){ 
    for(let i = 0; i< this.divID.length;i++){
      let element = document.getElementById(this.divID[i]);

      element.addEventListener("scroll", (event) => {
        this.numberMidder[i] = this.getNumberMidder(i,element);
        this.scrollEnd(this.divID[i],element, i);
      });
      element.addEventListener("touchend", () => {
        this.scrollEnd(this.divID[i],element, i);
      });
      
    }
  }
  scrollEnd(divID : string, element : HTMLElement, index: number){
    if(this.timeOutID[index])clearTimeout(this.timeOutID[index]);
    let top = Math.round(element.scrollTop/this.rowHeight) * this.rowHeight;
    this.timeOutID[index] = setTimeout(()=> {
      this.scrollTop(divID,top);
    }, 100);
  }
  scrollTop(divID : string, top: number){
    AppModule.getInstance().getScrollController().doScroll(divID,top,{
      alpha: 0.2,
      callback: ()=>{
        console.log(this.numberMidder);
      }
    });
  }

  getNumberMidder(index: number, element : HTMLElement): number {
    return Math.round(element.scrollTop / this.rowHeight);
  }
  closeView(){
    this.navCtrl.pop();
  }

  viewDescription(){
    let data;
    this.navCtrl.push("SelectDateDetailPage",{
      data: this.data[this.numberMidder[0]],
      month: this.dayInMonth[this.numberMidder[1]],
      year: this.years[this.numberMidder[2]]
    })
  }

}
