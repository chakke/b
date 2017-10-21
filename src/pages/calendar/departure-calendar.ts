import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController,Slides } from 'ionic-angular';
import { DepartureModule } from '../../providers/departure/departure';
import { Departure } from '../../providers/departure/class/departure';
import { AppController } from '../../providers/app-controller';
import { Calendar } from '../../providers/departure/class/calendar';
import { DatePicker } from '@ionic-native/date-picker';
import { StatusBar } from '@ionic-native/status-bar';

@IonicPage()
@Component({
  selector: 'page-departure-calendar',
  templateUrl: 'departure-calendar.html',
})
export class DepartureCalendarPage {
  @ViewChild('calendarContent') calendar_content: ElementRef;
  @ViewChild('box') box: ElementRef;
  @ViewChild(Slides) slides: Slides;
  public departureDays: Array<Departure> = [];
  public dayOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  calendar1 : Calendar;
  calendar: Calendar;
  calendar2 : Calendar;
  // day_in_month = new Array<Calendar>();
  public selectedMonth = 7;//Index at 0;
  public selectedDate: Departure;
  public currentDate: Departure;
  //dữ liệu về ngày xuất hành
  departureData: any;
  departureData1: any;
  departureData2: any;
  showDatePicker = false;
  col_height = "40px";
  grid_height= "256px";
  isPlatform;
  isLoading: boolean = true;
  isTouching: boolean = false;
  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private mAppModule: DepartureModule,
    private datePicker: DatePicker,
    private platform: Platform,
    private modalCtrl: ModalController,
    private rd: Renderer2,
    private statusBar: StatusBar,
  ) {
    this.isPlatform = this.platform._platforms[2];
    this.currentDate = new Departure(new Date());
    this.selectedDate = new Departure(new Date());
    this.calendar = new Calendar(this.currentDate.date.getMonth(), this.currentDate.date.getFullYear());
    this.getCalendar1();
    this.getCalendar2();
    this.departureDays = this.calendar.days;
    this.col_height = Math.floor(((screen.width - 32) / 7)) + "px";
    this.grid_height = Math.floor(((screen.width - 32)/ 7)*6) + 16 + "px";
    // this.calendar = this.calendar.
    if (!this.departureData) {
      this.mAppModule.getData().then(
        data => {
          this.departureData = data;
        }, error => { }
      );
    }
    this.mAppModule.updateDepartureInfo(this.calendar.days);
    this.mAppModule.updateDepartureInfo([this.currentDate, this.selectedDate]);
    // document.getElementById("box").style.height = this.col_height;
    // this.getQuoteAndDayName(this.selectedDate);
  }
 
  ionViewDidEnter() {
    if(!this.mAppModule.mIsOnIOSDevice){this.statusBar.backgroundColorByHexString("#20c0e1")};
    this.mAppModule.showAdvertisement();
    this.isLoading = false;
  }
  
  //Load data
  onInputChange(month, year) {
    this.calendar.setTime(month, year);
    this.departureDays = this.calendar.days;
    this.mAppModule.updateDepartureInfo(this.departureDays);

  }
  next(){
      if(this.slides.getActiveIndex()==2){
        this.onInputChange(this.calendar2.month,this.calendar2.year)
        this.slides.slideTo(1,0);
        this.getData();
      }
  }
  prev(){
      if(this.slides.getActiveIndex()==0){
        this.onInputChange(this.calendar1.month,this.calendar1.year)
        this.slides.slideTo(1,0);
        this.getData()
        // this.getCalendar1();
        // this.getCalendar2();
      }
  }
  getData(){
    this.getCalendar1();
    this.getCalendar2();
  }
  slideToMidder(){
    // this.slides.slideTo(1,0,false);
    // this.getCalendar1();
    // this.getCalendar2();
  }
  getDate(date: Date) {
    return date.getDate();
  }

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  getCalendar1(){
    let month = this.calendar.month - 1;
    let year = this.calendar.year;
    if (month == -1) {
      month = 11;
      year--;
    }
    if(this.isLoading){
      this.calendar1 = new Calendar(month,year);
      this.departureData1 = this.calendar1.days;
      this.mAppModule.updateDepartureInfo(this.departureData1);
      return;
    }
    this.calendar1.setTime(month,year);
    this.departureData1 = this.calendar1.days;
    this.mAppModule.updateDepartureInfo(this.departureData1);
  }
  getCalendar2(){
    let month = this.calendar.month + 1;
    let year = this.calendar.year;
    if (month == 12) {
      month = 0;
      year++;
    }
    if(this.isLoading){
      this.calendar2 = new Calendar(month,year);
      this.departureData2 = this.calendar2.days;
      this.mAppModule.updateDepartureInfo(this.departureData2);
      return;
    }
    this.calendar2.setTime(month,year);
    this.departureData2 = this.calendar2.days;
    this.mAppModule.updateDepartureInfo(this.departureData2);
  }
  swipe(direction: number) {
    if (direction == 2) {
      let month = this.calendar.month + 1;
      let year = this.calendar.year;
      if (month == 12) {
        month = 0;
        year++;
      }
      this.onInputChange(month, year);
    }
    if (direction == 4) {
      let month = this.calendar.month - 1;
      let year = this.calendar.year;
      if (month == -1) {
        month = 11;
        year--;
      }

      this.onInputChange(month, year);
    }
  }

  selectDeparture(departure) {
    if (departure)
      this.selectedDate = departure;
  }

  pickSolarDate() {
    let modal = this.modalCtrl.create("PickdatePage");
    modal.onDidDismiss((data: Departure) => {
      if (data && data.date) {
        setTimeout(() => {
          this.selectedDate = data;
          let month = this.selectedDate.date.getMonth();
          let year = this.selectedDate.date.getFullYear();
          this.onInputChange(month, year);
          this.getCalendar1();
          this.getCalendar2();
        }, 100);
      }
    })
    modal.present({
      animate: false
    });
  }
  hideDatePicker(event) {
    this.showDatePicker = false;
    event.stopPropagation();
  }
  nextYear() {
    this.onInputChange(this.calendar.month, this.calendar.year + 1);
  }
  prevYear() {
    this.onInputChange(this.calendar.month, this.calendar.year - 1);
  }

  changeMonth(month, event) {
    this.onInputChange(month - 1, this.calendar.year);
  }

  onClickHome() {
    //this.events.publish("HOME_PAGE");
    if (AppController.getInstance().getNavController()) {
      AppController.getInstance().getNavController().setRoot("HomePage");
    }
  }

}
