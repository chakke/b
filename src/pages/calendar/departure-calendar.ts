import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { DepartureModule } from '../../providers/departure/departure';
import { Departure } from '../../providers/departure/class/departure';
import { AppController } from '../../providers/app-controller';
import { Calendar } from '../../providers/departure/class/calendar';
import { DatePicker } from '@ionic-native/date-picker';

@IonicPage()
@Component({
  selector: 'page-departure-calendar',
  templateUrl: 'departure-calendar.html',
})
export class DepartureCalendarPage {
  @ViewChild('calendarContent') calendar_content: ElementRef;
  @ViewChild('box') box: ElementRef;
  public departureDays: Array<Departure> = [];
  public dayOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  calendar: Calendar;
  // day_in_month = new Array<Calendar>();
  public selectedMonth = 7;//Index at 0;
  public selectedDate: Departure;
  public currentDate: Departure;
  //dữ liệu về ngày xuất hành
  departureData: any;
  showDatePicker = false;
  col_height;
  isPlatform;
  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private mAppModule: DepartureModule,
    private datePicker: DatePicker,
    private platform: Platform,
    private modalCtrl: ModalController,
    private rd: Renderer2
  ) {
    this.isPlatform = this.platform._platforms[2];
    this.currentDate = new Departure(new Date());
    this.selectedDate = new Departure(new Date());
    this.calendar = new Calendar(this.currentDate.date.getMonth(), this.currentDate.date.getFullYear());
    this.checkDepartureBlank();
    this.col_height = ((screen.width - 32) / 7);
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
  setColHeight() {
    let Elems = document.getElementsByClassName("col");
    for (let i = 0; i < Elems.length; i++) {
      let Elem = <HTMLElement>Elems[i];
      Elem.style.height = this.col_height + 'px';
    }
  }
  ionViewDidEnter() {
    this.setColHeight();
  }
  checkDepartureBlank() {
    if (this.calendar.days[35]) {
      this.departureDays = this.calendar.days;
    } else {
      this.departureDays = this.calendar.days.slice(0, 35);
    }
  }
  //Load data
  onInputChange(month, year) {
    this.calendar.setTime(month, year);

    this.checkDepartureBlank();

    this.mAppModule.updateDepartureInfo(this.departureDays);
    setTimeout( ()=> {
      this.setColHeight();

    }, 100);
  }

  getDate(date: Date) {
    return date.getDate();
  }

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  swipe(event) {
    let direction = event.offsetDirection; //2 = swipe right to left; 4 = swipe left to right;
    // console.log(direction, this.calendar.month, this.calendar.year);
    // console.log(this.calendar.days);
    if (direction == 2) {
      let month = this.calendar.month + 1;
      let year = this.calendar.year;
      if (month == 12) {
        month = 0;
        year++;
      }

      this.rd.addClass(this.calendar_content.nativeElement, 'slideInRight');
      setTimeout(() => {
        this.rd.removeClass(this.calendar_content.nativeElement, 'slideInRight');
      }, 1000);
      // this.rd.removeClass(this.calendar_content.nativeElement,'fadeInRight');
      this.onInputChange(month, year);
    }
    if (direction == 4) {
      let month = this.calendar.month - 1;
      let year = this.calendar.year;
      if (month == -1) {
        month = 11;
        year--;
      }
      this.rd.addClass(this.calendar_content.nativeElement, 'slideInLeft');
      setTimeout(() => {
        this.rd.removeClass(this.calendar_content.nativeElement, 'slideInLeft');
      }, 1000);
      // 

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
          setTimeout( ()=> {
            this.setColHeight();
      
          }, 100);
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
    // event.target.classList.add('bordered');
    // setTimeout(() => {
    //   this.showDatePicker = false;
    //   event.target.classList.remove('bordered');
    // }, 500);
  }

  onClickHome() {
    //this.events.publish("HOME_PAGE");
    if (AppController.getInstance().getNavController()) {
      AppController.getInstance().getNavController().setRoot("HomePage");
    }
  }

}
