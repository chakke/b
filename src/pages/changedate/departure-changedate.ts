import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { DepartureModule } from '../../providers/departure/departure';
import { DepartureExchangeDay } from '../../providers/departure/departure-exchangeday';
import { Departure } from '../../providers/departure/class/departure';
import {AppModule} from "../../providers/app-module";
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
  timeoutObjects = [];
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
  }
  doScrollToTop(top : number){

  }
  getDayInSolarMonth() {
    let solarElms = document.getElementsByClassName('solar-col');
    this.solar_date = [];
    for (let i = 0; i < solarElms.length; i++) {
      let solarElm = solarElms[i];
      let index = solarElm.getAttribute('index');
      let childIndex = Math.round(solarElm.scrollTop / this.rowHeight) + 1;
      this.solar_date[index] = parseInt(solarElm.children[childIndex].children[0].innerHTML);
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
  ionViewDidLoad(){
    this.gotoToday();
  }
  ionViewDidEnter() {
    this.isLeaving = false;
    this.gotoToday();
    let scrollElms = document.getElementsByClassName('change-date-col');
  
    if (scrollElms) {
      for (let i = 0; i < scrollElms.length; i++) {
        let scrollElm = <HTMLElement>scrollElms[i];
        let index = parseInt(scrollElm.getAttribute('index'));

        scrollElm.addEventListener('scroll', (event) => {

          if (!this.touchingObjects[index] && index==this.currentIndex) {
            this.scrollEnd(scrollElm, index);
          }
        })
        scrollElm.addEventListener('touchstart', () => {
          //  console.log("start");
          this.touchingObjects[index] = true;
          this.currentIndex = index;

        })
        scrollElm.addEventListener('touchend', () => {
          //   console.log("end");

          this.touchingObjects[index] = false;
          this.scrollEnd(scrollElm, index);
          // this.changeDate(index);

        })
      }
    }
  }

  ionViewDidLeave() {
    // console.log("i'm leaving");
    this.isLeaving = true;
  }
  gotoToday() {
    this.load_filter = true;
    this.day_filter = [];
    this.currentIndex = 6;
    let scrollElms = document.getElementsByClassName('change-date-col');
    this.today = new Date();
    this.todayInLunar = this.departureExchangeDay.convertSolar2Lunar(this.today.getDate(), this.today.getMonth() + 1, this.today.getFullYear(), 7);
    this.day_filter.push(new DayFilter(this.today.getDate(), this.today.getMonth() + 1, this.today.getFullYear()));
    this.day_filter.push(new DayFilter(this.todayInLunar[0], this.todayInLunar[1], this.todayInLunar[2]));
    this.load_filter = false;
    if (scrollElms) {
      if (scrollElms) {
        for (let i = 0; i < scrollElms.length; i++) {
          let scrollElm = <HTMLElement>scrollElms[i];
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
  }
  changeDate(index: number) {
    // console.log("change date");

    let solarElms = document.getElementsByClassName('solar-col');
    // console.log(solarElms);
    let lunarElms = document.getElementsByClassName('lunar-col');
    if (solarElms && lunarElms) {
      if (index <= 2 && this.currentIndex <= 2) {

        //Change solar to lunar
        //Get solar date        
        this.solar_date = [];
        let lunar_date = [];
        if (solarElms) {
          // this.getDayInMonth();
          for (let i = 0; i < solarElms.length; i++) {
            let solarElm = solarElms[i];
            let childIndex = Math.round(solarElm.scrollTop / this.rowHeight) + 1;
            this.solar_date[i] = parseInt(solarElm.children[childIndex].children[0].innerHTML);
          }
          lunar_date = this.departureExchangeDay.convertSolar2Lunar(this.solar_date[0], this.solar_date[1], this.solar_date[2], 7);
          this.day_filter = [];

          this.day_filter.push(new DayFilter(this.solar_date[0], this.solar_date[1], this.solar_date[2]));
          this.day_filter.push(new DayFilter(lunar_date[0], lunar_date[1], lunar_date[2]));
          for (let i = 0; i < lunarElms.length; i++) {
            let lunarElm = <HTMLElement>lunarElms[i];
            AppModule.getInstance().getScrollController().doScroll(lunarElm.getAttribute('id'),(lunar_date[i % 3] - this.datas[i % 3][0]) * this.rowHeight,{alpha:0.1, callback:()=>{}});
          }
          this.selectedDate = new Departure(new Date(this.solar_date[2] + "-" + this.solar_date[1] + "-" + this.solar_date[0]));
          let data = this.mAppModule.updateDepartureInfo([this.selectedDate]);
          this.selectedDate = data[0];
        }

      }

      if (index >= 3 && this.currentIndex >= 3 && this.currentIndex <= 5) {
        //Change lunar to solar
        //Get lunar date        
        let lunar_date = [];
        if (lunarElms) {
          for (let i = 0; i < lunarElms.length; i++) {
            let lunarElm = lunarElms[i];
            let childIndex = Math.round(lunarElm.scrollTop / this.rowHeight) + 1;
            lunar_date[i] = parseInt(lunarElm.children[childIndex].children[0].innerHTML);
          }
          this.solar_date = this.departureExchangeDay.convertLunar2Solar(lunar_date[0], lunar_date[1], lunar_date[2], 0, 7);
          this.day_filter = [];
          this.day_filter.push(new DayFilter(this.solar_date[0], this.solar_date[1], this.solar_date[2]));
          this.day_filter.push(new DayFilter(lunar_date[0], lunar_date[1], lunar_date[2]));
          // show result 
          for (let i = 0; i < solarElms.length; i++) {
            let solarElm = <HTMLElement>solarElms[i];
            AppModule.getInstance().getScrollController().doScroll(solarElm.getAttribute('id'),(this.solar_date[i % 3] - this.datas[i % 3][0]) * this.rowHeight, {alpha:0.1,callback:()=>{}});
          }
          // this.getDayInMonth();
          this.selectedDate = new Departure(new Date(this.solar_date[2] + "-" + this.solar_date[1] + "-" + this.solar_date[0]));
          let data = this.mAppModule.updateDepartureInfo([this.selectedDate]);
          this.selectedDate = data[0];

        }
      }
    }

  }


  scrollToTop(element: HTMLElement, scrollTop, index) {
    let nowScrollTop = element.scrollTop;
    if (this.animationFrameObjects[index]) cancelAnimationFrame(this.animationFrameObjects[index]);
    if (nowScrollTop%50==0 || (nowScrollTop-scrollTop)%50!=0 || this.isLeaving) {
      AppModule.getInstance().getScrollController().doScroll(element.id, scrollTop,{alpha: 0.01,callback: ()=>{
        if(index>=0||index<=2){this.getDayInSolarMonth();}
        setTimeout(()=> {
        this.changeDate(index);
        }, 100);
      }})      
      return;
    }
  }
  scrollEnd(scrollElm: HTMLElement, index) {
    //end of touch. May be end of scrolling. Just reset timeout. 
    //Scroll event fire about every 30ms so 100ms timeout is fine
    if (this.currentIndex == index) {
      if (this.timeoutObjects[index]) clearTimeout(this.timeoutObjects[index]);

      if (this.animationFrameObjects[index]) cancelAnimationFrame(this.animationFrameObjects[index]);
      this.timeoutObjects[index] = setTimeout(() => {
        let scrollTop = scrollElm.scrollTop;
        this.scrollToTop(scrollElm, Math.round(scrollTop / this.rowHeight) * this.rowHeight, index);
      }, 100)
    }

  }
}
