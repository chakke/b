import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { DepartureModule } from '../../providers/departure/departure';
import { DepartureExchangeDay } from '../../providers/departure/departure-exchangeday';
import { Departure } from '../../providers/departure/class/departure';
import { AppModule } from "../../providers/app-module";
export class DayFilter {
  day: any;
  month: any;
  year: any;
  constructor(day: any, month: any, year: any) {
    this.day = day;
    this.month = month;
    this.year = year;
  }
}

@IonicPage()
@Component({
  selector: 'page-departure-changedate',
  templateUrl: 'departure-changedate.html',
})

export class DepartureChangeDatePage {
  rowHeight = 50;//height of each row in px; Match to css; 
  timeoutID;
  touchingObjects = [];
  animationFrameObjects = [];
  currentIndex = 6;
  departureExchangeDay: DepartureExchangeDay;
  datas = [[], [], []];
  day_in_month = [];
  day_30 = [];
  day_29 = [];
  day_28 = [];
  fps = 30;//frame per second. descrease it to increase speed of scroll;
  lunarMonth = [];
  today: Date;
  todayInLunar: any;
  todayInSolar: any;
  solar_date = [];
  lunar_date = [];
  day_filter = new Array<DayFilter>();
  load_filter: boolean = true;
  isLeaving: boolean = false;
  public selectedDate: Departure;
  scrollElms = new Array<HTMLElement>();
  divID = ["solarDay", "solarMonth", "solarYear", "lunarDay", "lunarMonth", "lunarYear"]
  mRunningScroll = [];
  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private mAppModule: DepartureModule,
    private platform: Platform
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
    for (let i = 1; i <= 30; i++) {
      this.lunarMonth.push(i);
    }
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

  getDayInSolarMonth() {
    this.solar_date = [];
    for (let i = 0; i < 3; i++) {
      let solarElm = <HTMLElement>this.scrollElms[i];
      let childIndex = Math.round(solarElm.scrollTop / this.rowHeight) + 1;
      this.solar_date[i] = parseInt(solarElm.children[childIndex].children[0].innerHTML);
    }
    this.checkDayInSolarMonth();
  }
  checkDayInSolarMonth(){
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
  ionViewDidLoad() {
    for (let i = 0; i < this.divID.length; i++) {
      let element = <HTMLElement>document.getElementById(this.divID[i]);
      this.scrollElms.push(element);
    }
    if (this.scrollElms) {
      for (let i = 0; i < this.scrollElms.length; i++) {
        let scrollElm = <HTMLElement>this.scrollElms[i];

        scrollElm.addEventListener('scroll', (event) => {
          if (!this.touchingObjects[i] && i == this.currentIndex) {
            this.mRunningScroll[i] = true;
            this.scrollEnd(scrollElm, i);
          }
        })
        scrollElm.addEventListener('touchstart', () => {
          this.touchingObjects[i] = true;
          this.currentIndex = i;
        })
        scrollElm.addEventListener('touchend', () => {
          this.touchingObjects[i] = false;
          this.scrollEnd(scrollElm, i);
        })
      }
    }
    this.gotoToday();
  }
  gotoToday() {
    this.load_filter = true;
    this.currentIndex = 6;
    this.today = new Date();
    this.todayInLunar = this.departureExchangeDay.convertSolar2Lunar(this.today.getDate(), this.today.getMonth() + 1, this.today.getFullYear(), 7);
    this.day_filter = [];
    this.day_filter.push(new DayFilter(this.today.getDate(), this.today.getMonth() + 1, this.today.getFullYear()));
    this.day_filter.push(new DayFilter(this.todayInLunar[0], this.todayInLunar[1], this.todayInLunar[2]));
    this.load_filter = false;
    if (this.scrollElms) {
      for (let i = 0; i < this.scrollElms.length; i++) {
        let scrollElm = <HTMLElement>this.scrollElms[i];
        let index = parseInt(scrollElm.getAttribute('index'));
        if (index == 0) {
          scrollElm.scrollTop = (this.today.getDate() - 1) * this.rowHeight;
        } else if (index == 1) {
          scrollElm.scrollTop = (this.today.getMonth()) * this.rowHeight;
        } else if (index == 2) {
          scrollElm.scrollTop = (this.today.getFullYear() - this.datas[2][0]) * this.rowHeight;
        } else if (index == 3) {
          scrollElm.scrollTop = (this.todayInLunar[0] - 1) * this.rowHeight;
        } else if (index == 4) {
          scrollElm.scrollTop = (this.todayInLunar[1] - 1) * this.rowHeight;
        } else if (index == 5) {
          scrollElm.scrollTop = (this.todayInLunar[2] - this.datas[2][0]) * this.rowHeight;
        }
      }
    }
  }
  changeDate(index: number) {
    this.solar_date = [];
    this.lunar_date = [];
    this.day_filter = [];
    if ((index >= 0 && index <= 2) && this.currentIndex == index) {
      // get data dòng ở giữa
      for (let i = 0; i < 3; i++) {
        let solarElm = this.scrollElms[i];
        let childIndex = Math.round(solarElm.scrollTop / this.rowHeight) + 1;
        this.solar_date[i] = parseInt(solarElm.children[childIndex].children[0].innerHTML);
      }
      this.lunar_date = this.mAppModule.convertSolarToLunar(this.solar_date[0], this.solar_date[1], this.solar_date[2]);
      // scroll to ngày âm tương ứng
      this.getDayFilter();
      for (let j = 3; j < 6; j++) {
        let lunarElm = <HTMLElement>document.getElementById(this.divID[j]);
        let top = (this.lunar_date[j % 3] - this.datas[j % 3][0]) * this.rowHeight;
        if (top != lunarElm.scrollTop) {
          this.scrollTo(lunarElm, top, j);
        }
      }
    }
    if ((index >= 3 && index <= 5) && this.currentIndex == index) {

      for (let i = 3; i < 6; i++) {
        let lunarElm = this.scrollElms[i];
        let childIndex = Math.round(lunarElm.scrollTop / this.rowHeight) + 1;
        this.lunar_date[i % 3] = parseInt(lunarElm.children[childIndex].children[0].innerHTML);
      }
      this.solar_date = this.mAppModule.convertLunarToSolar(this.lunar_date[0], this.lunar_date[1], this.lunar_date[2]);
      this.getDayFilter();
      this.checkDayInSolarMonth();
      setTimeout(()=> {
        for (let j = 0; j < 3; j++) {
          let solarElm = this.scrollElms[j];
          let top = (this.solar_date[j % 3] - this.datas[j % 3][0]) * this.rowHeight;
          if (top != solarElm.scrollTop) {
            this.scrollTo(solarElm, top, j);
          }
        }
      }, 100);
     
    }

  }
  getDayFilter(){
    this.day_filter = [];
    this.day_filter.push(new DayFilter(this.solar_date[0], this.solar_date[1], this.solar_date[2]));
    this.day_filter.push(new DayFilter(this.lunar_date[0], this.lunar_date[1], this.lunar_date[2]));
  }
  getSelectedDate() {
    this.selectedDate = new Departure(new Date(this.solar_date[2] + "-" + this.solar_date[1] + "-" + this.solar_date[0]));
    let data = this.mAppModule.updateDepartureInfo([this.selectedDate]);
    this.selectedDate = data[0];
  }
  doScrollToTop(scrollElm: HTMLElement, divID: string, top: number, index) {
    let nowScrollTop = scrollElm.scrollTop;
    AppModule.getInstance().getScrollController().doScroll(divID, top, {
      alpha: 0.2, callback: () => {
        if (nowScrollTop % 50 == 0 && index == this.currentIndex) {
          if(index>=0 && index <=2){
            this.getDayInSolarMonth();
          }
          setTimeout(()=>{
            this.changeDate(index);
          }, 100)
        }
        this.mRunningScroll[index] = false;
        return;
      }
    })
  }

  scrollTo(scrollElm: HTMLElement, top: number, index) {
    this.mRunningScroll[index] = true;
    AppModule.getInstance().getScrollController().doScroll(scrollElm.getAttribute('id'), top, {
      alpha: 0.2,
      callback: () => {
        this.mRunningScroll[index] = false;
        if (!this.checkScrollDone()) {
          this.getSelectedDate();
        }
      }
    });
  }
  checkScrollDone(): boolean {
    for (var index = 0; index < this.mRunningScroll.length; index++) {
      if (this.mRunningScroll[index]) {
        return true;
      }
    }
    return false;
  }
  scrollEnd(scrollElm: HTMLElement, index: number) {
    let nowScrollTop = scrollElm.scrollTop;
    if (this.timeoutID) clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(() => {
      let top = Math.round(nowScrollTop / this.rowHeight) * this.rowHeight;
      this.doScrollToTop(scrollElm, scrollElm.getAttribute('id'), top, index);
    }, 100);
  }
}
