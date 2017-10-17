import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Departure } from "../../providers/departure/class/departure";
import { DepartureModule } from "../../providers/departure/departure";
import { DepartureExchangeDay } from '../../providers/departure/departure-exchangeday';

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
  timeoutID = [];
  touchingObjects = [];
  animationFrameObjects = [];
  today: Date;
  departureExchangeDay: DepartureExchangeDay;
  submit_button = <HTMLElement>document.getElementById("submit");
  selectedDate: Departure;
  solar_date = [];
  mScrollELms = new Array<HTMLElement>();
  divIDs = ["div1", "div2", "div3"];
  mRunningScroll = [];
  numberMidder = [];
  scroll_controller = AppModule.getInstance().getScrollController();
  // scrollIndex: number = 4;
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
    this.getScrollElements();
    this.goToDay();
    // this.mAppModule.showAdvertisement();
  }
  getScrollElements(){
    for(let i = 0;i<this.divIDs.length;i++){
      let element = document.getElementById(this.divIDs[i]);
      this.mScrollELms.push(element);

      element.addEventListener('scroll', (event) => {
        
        if(!this.touchingObjects[i]){
          this.scrollEnd(i);
        }
        this.numberMidder[i] = this.getNumberMidder(i);
        if(i==1 || i==2){
          this.checkDayInSolarMonth(this.datas[1][this.numberMidder[1]]);
        } 
      })
      element.addEventListener('touchstart', () => {
        this.touchingObjects[i] = true;
      })
      element.addEventListener('touchend', () => {
        this.touchingObjects[i] = false;
        this.scrollEnd(i);
      })
      this.mRunningScroll[i] = false;
    }
  }
  getNumberMidder(index: number): number {
    return Math.round(this.mScrollELms[index].scrollTop / this.rowHeight);
  }
  goToDay(){
    this.today = new Date();
    if (this.mScrollELms) {
      for (let i = 0; i < this.mScrollELms.length; i++) {
        let scrollElm = this.mScrollELms[i];
        if (i == 0) {
          scrollElm.scrollTop = (this.today.getDate() - 1) * this.rowHeight;
        } else if (i== 1) {
          scrollElm.scrollTop = (this.today.getMonth()) * this.rowHeight;
        } else if (i== 2) {
          scrollElm.scrollTop = (this.today.getFullYear() - this.datas[2][0]) * this.rowHeight;
        }
      }
    }
  }
  checkDayInSolarMonth(month: number) {
    let year = this.numberMidder[2];
    if (year % 4 == 0) {
      if (month == 2) {
        this.day_in_month = this.day_29;
      } else if (month == 4 || month == 6 || month == 9 || month == 11) {
        this.day_in_month = this.day_30;
      } else {
        this.day_in_month = this.datas[0];
      }
    } else {
      if (month == 2) {
        this.day_in_month = this.day_28;
      } else if (month == 4 || month == 6 || month == 9 || month == 11) {
        this.day_in_month = this.day_30;
      } else {
        this.day_in_month = this.datas[0];
      }
    }
  }
  getSelectedDate() {
    this.selectedDate = new Departure(new Date(this.datas[2][this.numberMidder[2]] + "-" + this.datas[1][this.numberMidder[1]] + "-" +  this.day_in_month[this.numberMidder[0]]));
    this.mDepartureModule.updateDepartureInfo([this.selectedDate]);
  }
  closeSolarDate() {
    this.viewCtrl.dismiss({}, "", {
      animate: false
    });
  }
  scrollTop(divID: string ,top: number, index: number) {
    this.mRunningScroll[index] = true;
    if (this.animationFrameObjects[index]) cancelAnimationFrame(this.animationFrameObjects[index]);
    this.animationFrameObjects[index] = requestAnimationFrame(() => {
      this.scroll_controller.doScroll(divID, top, {
        alpha: 0.2,
        callback: () => {
          this.mRunningScroll[index] = false;
          // this.touchingObjects[index] = null;
          // this.animationFrameObjects[index] = null;
          // this.timeoutID[index] = null;
          console.log("scroll done");
          
          return;
        }
      });
    })

  }
  scrollEnd(index : number) {
    if (this.timeoutID[index]) clearTimeout(this.timeoutID[index]);
    if (this.animationFrameObjects[index]) cancelAnimationFrame(this.animationFrameObjects[index]);
    let top = Math.round(this.mScrollELms[index].scrollTop / this.rowHeight) * this.rowHeight;
    this.timeoutID[index] = setTimeout(() => {
      this.scrollTop(this.divIDs[index], top, index);
    }, 80);
  }
  isScrollDone(): boolean {
    for (let index = 0; index < this.mRunningScroll.length; index++) {
      if (this.mRunningScroll[index]) {
        return false;
      }
    }
    return true;
  }
  getDayInMonth() {
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
    if (this.isScrollDone) {
      this.getSelectedDate();
      this.viewCtrl.dismiss(this.selectedDate, "", {
        animate: false
      });
    }
  }
}
