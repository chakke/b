import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { DepartureModule } from '../../providers/departure/departure';
import { DepartureExchangeDay } from '../../providers/departure/departure-exchangeday';
import { Departure } from '../../providers/departure/class/departure';
import { AppModule } from "../../providers/app-module";
import { StatusBar } from '@ionic-native/status-bar';

@IonicPage()
@Component({
  selector: 'page-departure-changedate',
  templateUrl: 'departure-changedate.html',
})

export class DepartureChangeDatePage {
  rowHeight = 45;//height of each row in px; Match to css; 
  timeoutID = [];
  touchingObjects = [];
  animationFrameObjects = [];
  currentIndex;
  departureExchangeDay: DepartureExchangeDay;
  datas = [[], [], []];
  day_in_month = [];
  day_30 = [];
  day_29 = [];
  day_28 = [];
  fps = 30;//frame per second. descrease it to increase speed of scroll;
  today: Date;
  todayInLunar: any;
  todayInSolar: any;
  solar_date = [];
  lunar_date = [];
  isLeaving: boolean = false;
  isLoading: boolean = true;
  numberMidder = [];
  public selectedDate: Departure;
  scrollElms = new Array<HTMLElement>();
  divID = ["solarDay", "solarMonth", "solarYear", "lunarDay", "lunarMonth", "lunarYear"]
  mRunningScroll = [];
  scroll_controller = AppModule.getInstance().getScrollController();
  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private mAppModule: DepartureModule,
    private platform: Platform,
    private statusBar: StatusBar
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
    this.departureExchangeDay = new DepartureExchangeDay();
    this.selectedDate = new Departure(new Date());
    this.todayInSolar = this.selectedDate;
    this.mAppModule.updateDepartureInfo([this.selectedDate]);
    for (let i = 0; i < 6; i++) {
      this.mRunningScroll.push(false);
    }

  }
  viewDetail() {
    this.navCtrl.push("DayDetailPage", {
      dd: this.day_in_month[this.numberMidder[0]],
      mm: this.datas[1][this.numberMidder[1]],
      yy: this.datas[2][this.numberMidder[2]]
    })
  }
  goToday(){
      this.today = new Date();
      this.todayInLunar = this.departureExchangeDay.convertSolar2Lunar(this.today.getDate(), this.today.getMonth() + 1, this.today.getFullYear(), 7);
      if (this.scrollElms) {
        for (let i = 0; i < this.scrollElms.length; i++) {
          let scrollElm = this.scrollElms[i];
          if (i == 0) {
            scrollElm.scrollTop = (this.today.getDate() - 1) * this.rowHeight;
          } else if (i== 1) {
            scrollElm.scrollTop = (this.today.getMonth()) * this.rowHeight;
          } else if (i== 2) {
            scrollElm.scrollTop = (this.today.getFullYear() - this.datas[2][0]) * this.rowHeight;
          } else if (i== 3) {
            scrollElm.scrollTop = (this.todayInLunar[0] - 1) * this.rowHeight;
          } else if (i== 4) {
            scrollElm.scrollTop = (this.todayInLunar[1] - 1) * this.rowHeight;
          } else if (i== 5) {
            scrollElm.scrollTop = (this.todayInLunar[2] - this.datas[2][0]) * this.rowHeight;
          }
        }
      }
  }
  ionViewDidEnter() {
    this.getElementScroll();
    this.goToday();
    if (!this.mAppModule.mIsOnIOSDevice) this.statusBar.backgroundColorByHexString("#34a1ca");
    this.mAppModule.showAdvertisement();
  }
  getElementScroll() {
    for (let i = 0; i < this.divID.length; i++) {
      let element = document.getElementById(this.divID[i]);
      this.scrollElms.push(element);
      this.numberMidder.push(this.getNumberMidder(i));
      element.addEventListener("scroll", (event) => {
        this.numberMidder[i] = this.getNumberMidder(i);
        if (i == 1 || i == 2) {
          this.checkDayInSolarMonth(this.datas[1][this.numberMidder[1]]);
        }
        if (!this.touchingObjects[i]) {
          this.scrollEnd(i);
        }
      });

      element.addEventListener("touchstart", () => {
        this.touchingObjects[i] = true;
        this.currentIndex = i;
      });

      element.addEventListener("touchend", () => {
        this.touchingObjects[i] = false;
        this.scrollEnd(i);
      });
    }
    this.isLoading = false;
  }
  scrollEnd(index: number) {
    if (this.timeoutID[index]) clearTimeout(this.timeoutID[index]);
    if (this.animationFrameObjects[index]) cancelAnimationFrame(this.animationFrameObjects[index]);
    let top = Math.round(this.scrollElms[index].scrollTop / this.rowHeight) * this.rowHeight;
    this.timeoutID[index] = setTimeout(() => {
      this.scrollTop(this.divID[index], top, index);
      // this.changeDate(index);
    },100);
  }
  scrollTop(divID: string, top: number, index: number) {
    this.mRunningScroll[index] = true;
    if (this.animationFrameObjects[index]) cancelAnimationFrame(this.animationFrameObjects[index]);
    this.animationFrameObjects[index] = requestAnimationFrame(() => {
      this.scroll_controller.doScroll(divID, top, {
        alpha: 0.2,
        callback: () => {
          this.mRunningScroll[index] = false;
          this.touchingObjects[index] = null;
          // console.log(this.numberMidder);
          this.changeDate(index);
          return;
        }
      });
    })

  }
  
  changeDate(index: number) {
    // console.log("change-date");

    if (this.currentIndex == index && index >= 0 && index <= 2) {
      this.lunar_date = [];
      // this.getSelectedDay(index);
      this.lunar_date = this.mAppModule.convertSolarToLunar(this.day_in_month[this.numberMidder[0]], this.datas[1][this.numberMidder[1]], this.datas[2][this.numberMidder[2]]);
      for (let j = 3; j < 6; j++) {
        let top = (this.lunar_date[j % 3] - this.datas[j % 3][0]) * this.rowHeight;
        if (top != this.scrollElms[j].scrollTop) {
          this.scrollTo(top, j);
        }
      }
    } else {
      this.solar_date = [];
      this.solar_date = this.mAppModule.convertLunarToSolar(this.day_30[this.numberMidder[3]], this.datas[1][this.numberMidder[4]], this.datas[2][this.numberMidder[5]])
      // console.log(this.solar_date);
      for (let i = 0; i < 3; i++) {
        let top = (this.solar_date[i] - this.datas[i][0]) * this.rowHeight;
        if (top != this.scrollElms[i].scrollTop) {
          this.scrollTo(top, i);
        }
      }
    }
  }
  scrollTo(top: number, index: number) {
    let divID = this.scrollElms[index].id;
    this.mRunningScroll[index] = true;
    this.scroll_controller.doScroll(divID, top,{
      alpha:0.3,
      callback: ()=>{
        this.mRunningScroll[index] = false;
        if(this.isScrollDone){
          this.getSelectedDate(this.day_in_month[this.numberMidder[0]],this.datas[1][this.numberMidder[1]], this.datas[2][this.numberMidder[2]]);
        }
      }
    });
  }
  getNumberMidder(index: number): number {
    return Math.round(this.scrollElms[index].scrollTop / this.rowHeight);
  }
  getSelectedDate(dd:number,mm:number,yy:number) {
    this.selectedDate = new Departure(new Date(yy + "-" + mm + "-" + dd));
    this.mAppModule.updateDepartureInfo([this.selectedDate]);
  }
  isScrollDone(): boolean {
      for (let index = 0; index < this.mRunningScroll.length; index++) {
        if (this.mRunningScroll[index]) {
          return false;
        }
      }
      return true;
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
}
