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
  currentIndex = 6;
  today: any;
  fps = 30;
  submit_button = <HTMLElement>document.getElementById("submit");
  isShowPickDate: boolean = false;
  isScroll: boolean = false;
  selectedDate: Departure;
  solar_date = [];
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
    // console.log('ionViewDidLoad PickdatePage');
    this.gotoToday();
  }
  closeSolarDate() {
    this.viewCtrl.dismiss({}, "", {
      animate: false
    });
  }
  gotoToday() {
    let scrollElms = document.getElementsByClassName('change-date-col');
    this.today = new Date();
    this.selectedDate = new Departure(this.today);
    this.mDepartureModule.updateDepartureInfo([this.selectedDate]);
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
          }
        }
      }
    }
  }
  ionViewDidEnter() {
    // this.gotoToday();
    let scrollElms = document.getElementsByClassName('change-date-col');
    if (scrollElms) {
      for (let i = 0; i < scrollElms.length; i++) {
        let scrollElm = <HTMLElement>scrollElms[i];
        let index = parseInt(scrollElm.getAttribute('index'));

        scrollElm.addEventListener('scroll', (event) => {
          if (!this.touchingObjects[index]) {
            this.scrollEnd(scrollElm, index);
          }
        })
        scrollElm.addEventListener('touchstart', () => {

          this.touchingObjects[index] = true;
          this.currentIndex = index;
          this.isScroll = true;
        })
        scrollElm.addEventListener('touchend', () => {

          this.touchingObjects[index] = false;
          this.scrollEnd(scrollElm, index);
        })
      }
    }

  }

  scrollToTop(element: HTMLElement, scrollTop, index) {
    let divID = element.getAttribute('id');
    let nowScrollTop = element.scrollTop;
    this.isScroll = true;
    AppModule.getInstance().getScrollController().doScroll(divID, scrollTop,{alpha:0.2, callback: ()=>{
        this.changeDate();
        this.isScroll = false;
        return;
    }})
  }

  scrollEnd(scrollElm: HTMLElement, index) {
    //end of touch. May be end of scrolling. Just reset timeout. 
    //Scroll event fire about every 30ms so 100ms timeout is fine
    if (this.timeoutID) clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(() => {
      let scrollTop = scrollElm.scrollTop;
      this.scrollToTop(scrollElm, Math.round(scrollTop / this.rowHeight) * this.rowHeight, index);
    }, 100)
  }
  changeDate() {
    let solarElms = document.getElementsByClassName('solar-col');
    this.solar_date = [];

    if (solarElms) {
      for (let i = 0; i < solarElms.length; i++) {
        let solarElm = solarElms[i];
        let index = solarElm.getAttribute('index');
        let childIndex = Math.round(solarElm.scrollTop / this.rowHeight) + 1;
        this.solar_date[index] = parseInt(solarElm.children[childIndex].children[0].innerHTML);
      }
      this.getDayInMonth();
      this.selectedDate = new Departure(new Date(this.solar_date[2] + "-" + this.solar_date[1] + "-" + this.solar_date[0]));
      this.mDepartureModule.updateDepartureInfo([this.selectedDate]);
    }
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
    if (!this.isScroll) {
      this.viewCtrl.dismiss(this.selectedDate, "", {
        animate: false
      });
    }
  }
}
