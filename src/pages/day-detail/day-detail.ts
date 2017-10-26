import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController,Slides } from 'ionic-angular';
import { DepartureModule } from '../../providers/departure/departure';
import { TNBINFO } from '../../providers/departure/interface/tnb_Info';
import { HUONGXUATHANH } from '../../providers/departure/interface/huong_xuat_hanh';
import { Utils } from '../../providers/app-utils';
import { StatusBar } from '@ionic-native/status-bar';
import { Departure } from '../../providers/departure/class/departure';
import { DayDetail } from './day-detail-class';
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
  @ViewChild(Slides) slides : Slides;
  dayDetail1 : DayDetail;
  dayDetail2 : DayDetail;
  dayDetail : DayDetail;
  day_of_week: string;
  dd; mm; yy;
  nowtime: Date;
  isLoading: boolean = true;
  special_info: any;
  array = new Array<DayDetail>();
  day_numbers_of_month_in_normal_year: Array<number> = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  day_numbers_of_month_in_leap_year: Array<number> = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  constructor(public navCtrl: NavController,
    private mAppModule: DepartureModule,
    private rd: Renderer2,
    public navParams: NavParams,
    private statusBar: StatusBar,
    public modalCtrl : ModalController
  ) {
    this.dayDetail = new DayDetail();
    this.dayDetail1 = new DayDetail();
    this.dayDetail2 = new DayDetail();
  }


  mHasEnter: boolean = false;
  ngOnInit() {
    this.loadNavParmas();
   
    this.isLoading = false;
  }
  ionViewDidEnter() {
    if(!this.mAppModule.mIsOnIOSDevice)this.statusBar.backgroundColorByHexString("#0c855e");
    this.mAppModule.showAdvertisement();
  }
  pickDate(){
    let modal = this.modalCtrl.create("PickdatePage");
    modal.onDidDismiss((data: Departure) => {
      if (data && data.date) {
        setTimeout(() => {
          let date = new Date();
          this.dd = data.date.getDate();
          this.mm = data.date.getMonth() + 1;
          this.yy = data.date.getFullYear();
          this.dayDetail.setData(this.dd,this.mm,this.yy);
          this.loadData();
        }, 100);
      }
    })
    modal.present({
      animate: false
    });
  }
  loadData() {
    this.nowtime = new Date();
    this.dayDetail.TNBINFO = this.mAppModule.GetTNBINFO(this.dayDetail.dd, this.dayDetail.mm, this.dayDetail.yy);
    this.dayDetail.trucDay = this.mAppModule.getTrucDay(this.dayDetail.lunarMonth, this.dayDetail.sexagesimalCycleDate.split(" ")[1]);
    this.dayDetail.tietDay = this.mAppModule.getTietDay(this.dayDetail.dd, this.dayDetail.mm);
    let data = this.mAppModule.getHourBetterAndBad(this.dayDetail.sexagesimalCycleDate.split(" ")[1]);
    this.dayDetail.hour_better = data[0];
    this.dayDetail.hour_bad = data[1];
    this.dayDetail.huong_xuat_hanh = this.mAppModule.getTaiThanHyThan(this.dayDetail.sexagesimalCycleDate);
    this.dayDetail.tuoi_xung_khac = this.mAppModule.getTuoiXungKhac(this.dayDetail.sexagesimalCycleDate);
    this.dayDetail.sao_tot = this.mAppModule.getSaoTot(this.dayDetail.sexagesimalCycleDate.split(" ")[1], this.dayDetail.lunarMonth);
    this.dayDetail.sao_xau = this.mAppModule.getSaoXau(this.dayDetail.sexagesimalCycleDate.split(" ")[0], this.dayDetail.sexagesimalCycleDate.split(" ")[1], this.dayDetail.lunarMonth);
    this.getSpecicalDate();
  }
  loadData1(){
    this.dayDetail1.TNBINFO = this.mAppModule.GetTNBINFO(this.dayDetail1.dd, this.dayDetail1.mm, this.dayDetail1.yy);
    this.dayDetail1.trucDay = this.mAppModule.getTrucDay(this.dayDetail1.lunarMonth, this.dayDetail1.sexagesimalCycleDate.split(" ")[1]);
    this.dayDetail1.tietDay = this.mAppModule.getTietDay(this.dayDetail1.dd, this.dayDetail1.mm);
    let data = this.mAppModule.getHourBetterAndBad(this.dayDetail1.sexagesimalCycleDate.split(" ")[1]);
    this.dayDetail1.hour_better = data[0];
    this.dayDetail1.hour_bad = data[1];
    this.dayDetail1.huong_xuat_hanh = this.mAppModule.getTaiThanHyThan(this.dayDetail1.sexagesimalCycleDate);
    this.dayDetail1.tuoi_xung_khac = this.mAppModule.getTuoiXungKhac(this.dayDetail1.sexagesimalCycleDate);
    this.dayDetail1.sao_tot = this.mAppModule.getSaoTot(this.dayDetail1.sexagesimalCycleDate.split(" ")[1], this.dayDetail1.lunarMonth);
    this.dayDetail1.sao_xau = this.mAppModule.getSaoXau(this.dayDetail1.sexagesimalCycleDate.split(" ")[0], this.dayDetail1.sexagesimalCycleDate.split(" ")[1], this.dayDetail1.lunarMonth);
    let solarDay = this.getViewDate(this.dayDetail1.dd, this.dayDetail1.mm);
    let lunarDay = this.getViewDate(this.dayDetail1.lunarDate, this.dayDetail1.lunarMonth);
    this.dayDetail1.special_name = this.mAppModule.getSpecialDate(lunarDay, solarDay);
  }
  loadData2(){
    this.dayDetail2.TNBINFO = this.mAppModule.GetTNBINFO(this.dayDetail2.dd, this.dayDetail2.mm, this.dayDetail2.yy);
    this.dayDetail2.trucDay = this.mAppModule.getTrucDay(this.dayDetail2.lunarMonth, this.dayDetail2.sexagesimalCycleDate.split(" ")[1]);
    this.dayDetail2.tietDay = this.mAppModule.getTietDay(this.dayDetail2.dd, this.dayDetail2.mm);
    let data = this.mAppModule.getHourBetterAndBad(this.dayDetail2.sexagesimalCycleDate.split(" ")[1]);
    this.dayDetail2.hour_better = data[0];
    this.dayDetail2.hour_bad = data[1];
    this.dayDetail2.huong_xuat_hanh = this.mAppModule.getTaiThanHyThan(this.dayDetail2.sexagesimalCycleDate);
    this.dayDetail2.tuoi_xung_khac = this.mAppModule.getTuoiXungKhac(this.dayDetail2.sexagesimalCycleDate);
    this.dayDetail2.sao_tot = this.mAppModule.getSaoTot(this.dayDetail2.sexagesimalCycleDate.split(" ")[1], this.dayDetail2.lunarMonth);
    this.dayDetail2.sao_xau = this.mAppModule.getSaoXau(this.dayDetail2.sexagesimalCycleDate.split(" ")[0], this.dayDetail2.sexagesimalCycleDate.split(" ")[1], this.dayDetail2.lunarMonth);
    let solarDay = this.getViewDate(this.dayDetail2.dd, this.dayDetail2.mm);
    let lunarDay = this.getViewDate(this.dayDetail2.lunarDate, this.dayDetail2.lunarMonth);
    this.dayDetail2.special_name = this.mAppModule.getSpecialDate(lunarDay, solarDay);
  }
  close() {
    this.navCtrl.pop();
  }
  loadNavParmas() {
    this.dd = this.navParams.get('dd');
    this.mm = this.navParams.get('mm');
    this.yy = this.navParams.get('yy');
    this.dayDetail.setData(this.dd,this.mm,this.yy);
    this.loadData();
    this.getDayDetail1();
    this.getDayDetail2();
    
    this.array.push(this.dayDetail1);
    this.array.push(this.dayDetail);
    this.array.push(this.dayDetail2);
    
    if(this.navParams.get('special_info'))this.dayDetail.special_info = this.navParams.get('special_info');
  }
  getSpecicalDate() {
    let solarDay = this.getViewDate(this.dd, this.mm);
    let lunarDay = this.getViewDate(this.dayDetail.lunarDate, this.dayDetail.lunarMonth);
    this.dayDetail.special_name = this.mAppModule.getSpecialDate(lunarDay, solarDay);
  }
  getViewDate(date: number, month: number): string {
    return (date < 10 ? "0" : "") + date + "-" + (month < 10 ? "0" : "") + month;
  }
  goToDay() {
    let element = document.getElementById("detail");
    if(element){
      element.style.transform = 'translate(0,0)';
    }
    let date = new Date();
    this.dd = date.getDate();
    this.mm = date.getMonth() + 1;
    this.yy = date.getFullYear();
    this.dayDetail.setData(this.dd,this.mm,this.yy);
    this.loadData();
    this.getDayDetail1();
    this.getDayDetail2();
  }
  prev() {
    let elements = document.getElementsByClassName("app-content");
    if(elements && elements[1] && elements[1].scrollTop!=0){
      elements[1].scrollTop = 0;
    }
    if(this.slides.getActiveIndex()==0){
      let date = new Date();
      this.backtoPreviousDate();
      this.dayDetail.setData(this.dd,this.mm,this.yy);
      this.loadData();
      this.slides.slideTo(1,0);
      this.getDayDetail1();
      this.getDayDetail2();
    }
    

  }
  next() {
    let elements = document.getElementsByClassName("app-content");
    if(elements && elements[1] && elements[1].scrollTop!=0){
      elements[1].scrollTop = 0;
    }
    
    if(this.slides.getActiveIndex()==2){
      let date = new Date();
      this.forwardNextDate();
      this.dayDetail.setData(this.dd,this.mm,this.yy);
      this.loadData();
      this.slides.slideTo(1,0);
      this.getDayDetail1();
      this.getDayDetail2();
    }
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
  getDayDetail2(){
    let day_numbers_of_month = this.getDayNumbersInOneMonth();
    let dd = this.dayDetail.dd + 1;
    let mm = this.dayDetail.mm;
    let yy = this.dayDetail.yy;
    if (dd > day_numbers_of_month[this.mm - 1]) {
      mm++;
      if (mm > 12) {
        mm = 1;
        yy++;
      }
      dd = 1;
    }
    this.dayDetail2.setData(dd,mm,yy);
    this.loadData2();
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

  getDayDetail1(){
    let day_numbers_of_month = this.getDayNumbersInOneMonth();
    let dd = this.dayDetail.dd-1;
    let mm = this.dayDetail.mm;
    let yy = this.dayDetail.yy;
    if (dd < 1) {
      mm--;
      if (mm < 1) {
        mm = 12;
        yy--;
      }
      dd = day_numbers_of_month[this.mm - 1];
    }
    this.dayDetail1.setData(dd,mm,yy);
    this.loadData1();
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
