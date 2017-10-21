import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DepartureModule } from '../../providers/departure/departure';
import { TNBINFO } from '../../providers/departure/interface/tnb_Info';
import { HUONGXUATHANH } from '../../providers/departure/interface/huong_xuat_hanh';
import { Utils } from '../../providers/app-utils';
import { StatusBar } from '@ionic-native/status-bar';
// import { AdMobPro } from '@ionic-native/admob-pro';
/**
 * Generated class for the DayDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-day-detail',
  templateUrl: 'day-detail.html',
})
export class DayDetailPage {
  @ViewChild("detail") detail: ElementRef;
  day_of_week: string;
  dd; mm; yy;
  nowtime: Date;
  lunarDate; lunarYear; lunarMonth;
  sexagesimalCycleTime: string;
  sexagesimalCycleDate: string;
  sexagesimalCycleMonth: string;
  sexagesimalCycleYear: string;
  TNBINFO: TNBINFO;
  isLoading: boolean = true;
  tietDay: string;
  trucDay: string;
  hour_better = [];
  hour_bad = [];
  huong_xuat_hanh = new Array<HUONGXUATHANH>();
  tuoi_xung_khac: any;
  sao_tot = [];
  sao_xau = [];
  special_name: any;
  special_info: any;
  day_numbers_of_month_in_normal_year: Array<number> = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  day_numbers_of_month_in_leap_year: Array<number> = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  constructor(public navCtrl: NavController,
    private mAppModule: DepartureModule,
    private rd: Renderer2,
    public navParams: NavParams,
    private statusBar: StatusBar,
  ) {
  }


  mHasEnter: boolean = false;
  ngOnInit() {
    this.loadNavParmas();
    this.loadData();
    this.isLoading = false;

  }
  ionViewDidEnter() {
    if(!this.mAppModule.mIsOnIOSDevice)this.statusBar.backgroundColorByHexString("#0c855e");
    this.mAppModule.showAdvertisement();
  }
  loadData() {
    this.TNBINFO = this.mAppModule.GetTNBINFO(this.dd, this.mm, this.yy);
    this.trucDay = this.mAppModule.getTrucDay(this.lunarMonth, this.sexagesimalCycleDate.split(" ")[1]);
    this.tietDay = this.mAppModule.getTietDay(this.dd, this.mm);
    let data = this.mAppModule.getHourBetterAndBad(this.sexagesimalCycleDate.split(" ")[1]);
    this.hour_better = data[0];
    this.hour_bad = data[1];
    this.huong_xuat_hanh = this.mAppModule.getTaiThanHyThan(this.sexagesimalCycleDate);
    this.tuoi_xung_khac = this.mAppModule.getTuoiXungKhac(this.sexagesimalCycleDate);
    this.sao_tot = [];
    this.sao_xau = [];
    this.sao_tot = this.mAppModule.getSaoTot(this.sexagesimalCycleDate.split(" ")[1], this.lunarMonth);
    this.sao_xau = this.mAppModule.getSaoXau(this.sexagesimalCycleDate.split(" ")[0], this.sexagesimalCycleDate.split(" ")[1], this.lunarMonth);
    this.getSpecicalDate();
  }
  close() {
    this.navCtrl.pop();
  }
  loadNavParmas() {
    this.dd = this.navParams.get('dd');
    this.mm = this.navParams.get('mm');
    this.yy = this.navParams.get('yy');
    if(this.navParams.get('special_info'))this.special_info = this.navParams.get('special_info');
    this.day_of_week = Utils.getDayOfWeek(this.dd, this.mm, this.yy);
    this.loadLunarDate();
    this.getSexagesimal();
    this.nowtime = new Date();
    this.sexagesimalCycleTime = this.mAppModule.getSexagesimalCycleByTime(this.dd, this.mm, this.yy, this.nowtime.getHours());
  }
  getSpecicalDate() {
    let solarDay = this.getViewDate(this.dd, this.mm);
    let lunarDay = this.getViewDate(this.lunarDate, this.lunarMonth);
    this.special_name = this.mAppModule.getSpecialDate(lunarDay, solarDay);
  }
  getSexagesimal() {
    this.sexagesimalCycleDate = this.mAppModule.getSexagesimalCycleByDay(this.dd, this.mm, this.yy);
    this.sexagesimalCycleMonth = this.mAppModule.getSexagesimalCycleByMonth(this.dd, this.mm, this.yy);
    this.sexagesimalCycleYear = this.mAppModule.getSexagesimalCycleByYear(this.dd, this.mm, this.yy);
  }
  getViewDate(date: number, month: number): string {
    return (date < 10 ? "0" : "") + date + "-" + (month < 10 ? "0" : "") + month;
  }
  loadLunarDate() {
    let lunarday = this.mAppModule.convertSolarToLunar(this.dd, this.mm, this.yy);
    this.lunarDate = lunarday[0];
    this.lunarMonth = lunarday[1];
    this.lunarYear = lunarday[2];
  }
  goToDay() {
    let date = new Date();
    this.dd = date.getDate();
    this.mm = date.getMonth() + 1;
    this.yy = date.getFullYear();
    this.day_of_week = Utils.getDayOfWeek(this.dd, this.mm, this.yy);
    this.loadLunarDate();
    this.getSexagesimal();
    this.sexagesimalCycleTime = this.mAppModule.getSexagesimalCycleByTime(this.dd, this.mm, this.yy, date.getHours());
    this.loadData();
  }
  swipe(event) {
    if(this.special_info)this.special_info = null;
    let direction = event.offsetDirection; //2 = swipe right to left; 4 = swipe left to right;
    // console.log(direction, this.calendar.month, this.calendar.year);
    // console.log(this.calendar.days);
    if (direction == 2) {
      this.rotateRight()
    }
    if (direction == 4) {
      this.rotateLeft();
    }
  }
  rotateLeft() {
    let date = new Date();
    this.backtoPreviousDate();
    this.day_of_week = Utils.getDayOfWeek(this.dd, this.mm, this.yy);
    this.loadLunarDate();
    this.getSexagesimal();

    this.sexagesimalCycleTime = this.mAppModule.getSexagesimalCycleByTime(this.dd, this.mm, this.yy, date.getHours());
    this.loadData();
    setTimeout(() => {
      this.rd.addClass(this.detail.nativeElement, 'slideInLeft');
      setTimeout(() => {
        this.rd.removeClass(this.detail.nativeElement, 'slideInLeft');
      }, 1000);
    }, 50);

  }
  rotateRight() {
    let date = new Date();
    this.forwardNextDate();
    this.day_of_week = Utils.getDayOfWeek(this.dd, this.mm, this.yy);
    this.loadLunarDate();
    this.getSexagesimal();

    this.sexagesimalCycleTime = this.mAppModule.getSexagesimalCycleByTime(this.dd, this.mm, this.yy, date.getHours());
    this.loadData();
    setTimeout(() => {
      this.rd.addClass(this.detail.nativeElement, 'slideInRight');
      setTimeout(() => {
        this.rd.removeClass(this.detail.nativeElement, 'slideInRight');
      }, 1000);
    }, 50);

  }
  getDayNumbersInOneMonth() {
    let result: number[];
    if (this.yy % 4 == 0) {
      result = this.day_numbers_of_month_in_normal_year;
    } else {
      result = this.day_numbers_of_month_in_leap_year;
    }
    return result;
  }

  //tiến về ngày kế tiếp
  forwardNextDate() {
    let day_numbers_of_month = this.getDayNumbersInOneMonth();
    this.dd++;
    if (this.dd > day_numbers_of_month[this.mm - 1]) {
      this.mm++;
      if (this.mm > 12) {
        this.mm = 1;
        this.yy++;
      }
      this.dd = 1;
    }
  }
  //lùi về ngày hôm trước
  backtoPreviousDate() {
    let day_numbers_of_month = this.getDayNumbersInOneMonth();
    this.dd--;
    if (this.dd < 1) {
      this.mm--;
      if (this.mm < 1) {
        this.mm = 12;
        this.yy--;
      }
      this.dd = day_numbers_of_month[this.mm - 1];
    }
  }
  // getSaoXau(){
  //   let code = "";
  //   for(let i = 0; i< this.sao_xau.length; i++){
  //      code += this.sao_xau[i];
  //      if(i<this.sao_xau.length-1) code +=",";
  //   }
  //   return code;
  // }
}
