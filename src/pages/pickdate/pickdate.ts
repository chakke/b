import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Departure } from "../../providers/departure/class/departure";
import { DepartureModule } from "../../providers/departure/departure";

import { AppModule } from "../../providers/app-module";
/**
 * Generated class for the PickdatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pickdate',
  templateUrl: 'pickdate.html',
})
export class PickdatePage {
  datas = [[], [], []];
  day_in_month = [];
  day_30 = [];
  day_29 = [];
  day_28 = [];
  rowHeight = 45;//height of each row in px; Match to css; 
  timeoutID;
  touchingObjects = [];
  today: Date;
  submit_button = <HTMLElement>document.getElementById("submit");
  isScroll: boolean = false;
  selected_date: Departure;
  solar_date = [];
  mScrollELms = new Array<HTMLElement>();
  divIDs = ["div1","div2","div3"];
  mRunningScroll: boolean = false;
  scrollIndex : number = 4; 
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController,
    private mDepartureModule: DepartureModule,
  ) {
    for (let i = 1; i <= 31; i++) {
      this.datas[0].push(i);
      if (i < 29) {
        this.day_28.push(i);
      }
      if (i < 30) {
        this.day_29.push(i);
      }
      if (i < 31) {
        this.day_30.push(i);
      }
    }
    this.day_in_month = this.datas[0];
    for (let i = 1; i <= 12; i++) {
      this.datas[1].push(i);
    }
    for (let i = 1900; i <= 2200; i++) {
      this.datas[2].push(i);
    }
  }

  ionViewDidLoad() {
    for(let i = 0; i<this.divIDs.length;i++){
      let element = <HTMLElement>document.getElementById(this.divIDs[i]);
      this.mScrollELms.push(element);
    }
    
    if(this.mScrollELms){
      for(let key = 0; key<this.mScrollELms.length;key++){
        let scrollElm = this.mScrollELms[key];

        scrollElm.addEventListener('scroll', (event) => {
          if (!this.touchingObjects[key] && this.scrollIndex == key) {
            this.scrollEnd(scrollElm, key);
          }
        })
        scrollElm.addEventListener('touchstart', () => {
          this.touchingObjects[key] = true;
          this.isScroll = true;
          this.scrollIndex = key;
        })
        scrollElm.addEventListener('touchend', () => {

          this.touchingObjects[key] = false;
          this.scrollEnd(scrollElm, key);
        })
      }
    }
    this.gotoToday();
    
  }
  closeSolarDate() {
    this.viewCtrl.dismiss({}, "", {
      animate: false
    });
  }
  gotoToday() {
    this.today = new Date();
    if(this.mScrollELms){
      this.doScrollTo(this.divIDs[0],(this.today.getDate()-1)*this.rowHeight);
      this.doScrollTo(this.divIDs[1],(this.today.getMonth())*this.rowHeight);
      this.doScrollTo(this.divIDs[2],(this.today.getFullYear() - this.datas[2][0])*this.rowHeight);
    }
  }
  ionViewDidEnter() {
    // this.gotoToday();
  }
  doScrollTo(divID: string, top: number){
    AppModule.getInstance().getScrollController().doScroll(divID,top,{alpha: 0.4, callback: ()=>{}});
  }
  scrollToTop(element: HTMLElement, scrollTop, index) {
    let divID = element.getAttribute('id');
    let nowScrollTop = element.scrollTop;
    this.isScroll = true;
    AppModule.getInstance().getScrollController().doScroll(divID, scrollTop,{alpha:0.1, callback: ()=>{
      if(nowScrollTop%45==0){
        this.getDayInMonth();
        setTimeout(()=> {
        this.changeDate();
        }, 100);
      }
      this.isScroll = false;
      return;
    }});
  }

  scrollEnd(scrollElm: HTMLElement, index) {
    if (this.timeoutID) clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(() => {
      let scrollTop = scrollElm.scrollTop;
      this.scrollToTop(scrollElm, Math.round(scrollTop / this.rowHeight) * this.rowHeight, index);
    }, 100)
  }
  changeDate() {
    this.solar_date = [];
    console.log("change-date");
    
    if (this.mScrollELms) {
      for (let i = 0; i < 3; i++) {
        let solarElm = this.mScrollELms[i];
        let childIndex = Math.round(solarElm.scrollTop / this.rowHeight) + 1;
        this.solar_date[i] = parseInt(solarElm.children[childIndex].children[0].innerHTML);
      }
      this.selected_date = new Departure(new Date(this.solar_date[2] + "-" + this.solar_date[1] + "-" + this.solar_date[0]));
      let data = this.mDepartureModule.updateDepartureInfo([this.selected_date]);
      this.selected_date = data[0];
    }
  }

  getDayInMonth() {
    this.solar_date = [];
    if(this.mScrollELms){
      for (let i = 0; i < 3; i++) {
        let solarElm = this.mScrollELms[i];
        let childIndex = Math.round(solarElm.scrollTop / this.rowHeight) + 1;
        this.solar_date[i] = parseInt(solarElm.children[childIndex].children[0].innerHTML);
      }
    }
    if (this.solar_date[2] % 4 == 0) {
      if (this.solar_date[1] == 2) {
        this.day_in_month = this.day_29;
      } else if (this.solar_date[1] == 4 || this.solar_date[1] == 6 || this.solar_date[1] == 9 || this.solar_date[1] == 11) {
        this.day_in_month = this.day_30;
      } else {
        this.day_in_month = this.datas[0];
      }
    } else {
      if (this.solar_date[1] == 2) {
        this.day_in_month = this.day_28;
      } else if (this.solar_date[1] == 4 || this.solar_date[1] == 6 || this.solar_date[1] == 9 || this.solar_date[1] == 11) {
        this.day_in_month = this.day_30;
      } else {
        this.day_in_month = this.datas[0];
      }
    }
  }
  getSolarDate() {
    if (!this.isScroll) {
      this.viewCtrl.dismiss(this.selected_date, "", {
        animate: false
      });
    }
  }
}
