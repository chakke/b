
import { Injectable } from '@angular/core';
import { DepartureHttpService } from "./departure-http-service";
import { HttpService } from "../http-service";
import { ResponseCode, RequestState, LoginStatus } from '../app-constant';
import { DepartureLoadData } from './departure-loaddata';
import { DepartureExchangeDay } from './departure-exchangeday';
import { Departure } from './class/departure';
import { AppConfig } from '../app-config';
import { Http, HttpModule } from '@angular/http';
import { BACKGROUND } from './departure-background';
import { BACKGROUNDCHANGE } from './departure-backgroundchange';
import { MOREOPTION } from "./departure-more-option";
import { AdMobPro } from '@ionic-native/admob-pro';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
@Injectable()
export class DepartureModule {

  private mDepartureHttpService: DepartureHttpService;
  private mDepartureLoadData: DepartureLoadData;
  private mDepartureExchangeDay: DepartureExchangeDay;
  private departureData: any;
  private dayDetailData: any;
  private trucData: any;
  private tietData: any;
  private taiThan_hyThan: any;
  private sao_tot_data: any;
  private special_data: any;
  private cavalVNAL: any;
  private cavalVNDL: any;
  private vankhan_data: any;
  private mConfig: AppConfig;
  public mIsOnIOSDevice: boolean = false;
  private dem: number = 0;
  private n1: number = 0;
  private n2: number = 1;
  private period_number: number = 2;
  constructor(
    private googleAnalytics: GoogleAnalytics,
    private admob: AdMobPro,
    private mHttpService: HttpService,
    private http: Http) {
    this.mDepartureHttpService = new DepartureHttpService(this.mHttpService);
    this.mDepartureLoadData = new DepartureLoadData(this.http);
    this.mDepartureExchangeDay = new DepartureExchangeDay();
    this.mConfig = new AppConfig();
  }
  getAppConfig() {
    return this.mConfig;
  }

  loadConfig() {
    return new Promise((resolve, reject) => {
      if (this.mConfig.hasData()) {
        resolve();
      } else {
        this.mHttpService.getHttp().request("assets/config/departure.json").subscribe(
          data => {
            this.mConfig.onResponseConfig(data.json());
            resolve();
          }
        );
      }
    });

  }

  public getHttpService() {
    return this.mDepartureHttpService;
  }

  //đổi ngày dương về ngày âm
  public convertSolarToLunar(dd: any, mm: any, yy: any) {
    return this.mDepartureExchangeDay.convertSolar2Lunar(dd, mm, yy, 7);
  }
  //doi ngay am ve ngay duong
  public convertLunarToSolar(dd: any, mm: any, yy: any) {
    return this.mDepartureExchangeDay.convertLunar2Solar(dd, mm, yy, 7);
  }

  public update() {
    this.getData();
  }

  getData() {
    return new Promise((resolve, reject) => {
      if (this.departureData) resolve(this.departureData);
      else {
        this.mDepartureLoadData.getDataFromJSON().subscribe((data) => {
          this.departureData = data;
          resolve(this.departureData);
        });
      }
    });
  }

  getDayDetailDataJSON() {
    return new Promise((resolve, reject) => {
      if (this.dayDetailData) resolve(this.dayDetailData);
      else {
        this.mDepartureLoadData.getDayDetailFromJSON().subscribe((data) => {
          this.dayDetailData = data;
          resolve(this.dayDetailData);
        });
      }
    });
  }

  getTrucDataJSON() {
    return new Promise((resolve, reject) => {
      if (this.trucData) resolve(this.trucData);
      else {
        this.mDepartureLoadData.getTrucDataFromJSON().subscribe((data) => {
          this.trucData = data;
          resolve(this.trucData);
        });
      }
    });
  }
  getTietDataJSON() {
    return new Promise((resolve, reject) => {
      if (this.tietData) resolve(this.tietData);
      else {
        this.mDepartureLoadData.getTietDataFromJSON().subscribe((data) => {
          this.tietData = data;
          resolve(this.tietData);
        });
      }
    });
  }

  getTaiThanHyThanDataJSON() {
    return new Promise((resolve, reject) => {
      if (this.taiThan_hyThan) resolve(this.taiThan_hyThan);
      else {
        this.mDepartureLoadData.getTaiThanHyThanFromJSON().subscribe((data) => {
          this.taiThan_hyThan = data;
          resolve(this.taiThan_hyThan);
        });
      }
    });
  }

  getSaoTotSaoXauDataJSON() {
    return new Promise((resolve, reject) => {
      if (this.sao_tot_data) resolve(this.sao_tot_data);
      else {
        this.mDepartureLoadData.getSaoTotSaoXauDataFromJSON().subscribe((data) => {
          this.sao_tot_data = data;
          resolve(this.sao_tot_data);
        });
      }
    });
  }

  getSpecialDataJSON() {
    return new Promise((resolve, reject) => {
      if (this.special_data) resolve(this.special_data);
      else {
        this.mDepartureLoadData.getSpecialDataFromJSON().subscribe((data) => {
          this.special_data = data;
          resolve(this.special_data);
        });
      }
    });
  }

  getCavalVNALDataJSON() {
    return new Promise((resolve, reject) => {
      if (this.cavalVNAL) resolve(this.cavalVNAL);
      else {
        this.mDepartureLoadData.getLeVietNamAmLichDataFromJSON().subscribe((data) => {
          this.cavalVNAL = data;
          resolve(this.cavalVNAL);
        });
      }
    });
  }
  getCavalVNDLDataJSON() {
    return new Promise((resolve, reject) => {
      if (this.cavalVNDL) resolve(this.cavalVNDL);
      else {
        this.mDepartureLoadData.getLeVietNamDuongLichDataFromJSON().subscribe((data) => {
          this.cavalVNDL = data;
          resolve(this.cavalVNDL);
        });
      }
    });
  }

  getVanKhanDataJSON() {
    return new Promise((resolve, reject) => {
      if (this.vankhan_data) resolve(this.vankhan_data);
      else {
        this.mDepartureLoadData.getVanKhanDataFromJSON().subscribe((data) => {
          this.vankhan_data = data;
          resolve(this.vankhan_data);
        });
      }
    });
  }

  getGiaiMongDataJSON() {
    return new Promise((resolve, reject) => {
        this.mDepartureLoadData.getGiaiMongDataFromJSON().subscribe((data) => {
          resolve(data);
        });
    });
  }
  updateDepartureInfo(departures: Array<Departure>) {
    if (this.departureData) {
      departures.forEach(departure => {
        if (departure) {
          let data = this.getQuoteAndNameOfDay(departure.lunarDate, departure.lunarMonth);
          departure.nameOfDay = data[0];
          departure.comment = data[1];
        }
      });
      return departures;
    }
    else {
      return this.getData().then(() => {
        departures.forEach(departure => {
          if (departure) {
            let data = this.getQuoteAndNameOfDay(departure.lunarDate, departure.lunarMonth);
            departure.nameOfDay = data[0];
            departure.comment = data[1];
          }
        });
        return departures;
      })
    }
  }

  //lấy thông tin về ngày xuất hành
  public getDepartureData() {
    return this.mDepartureLoadData.getDataFromJSON();
  }

  public getDayDetailData() {
    return this.mDepartureLoadData.getDayDetailFromJSON();
  }

  public getTrucData() {
    return this.mDepartureLoadData.getTrucDataFromJSON();
  }

  public getVanKhanValue() {
    if (this.vankhan_data) {
      return this.vankhan_data;
    }
  }

  /**
   * getTietData
   */
  public getTietData() {
    return this.mDepartureLoadData.getTietDataFromJSON();
  }

  public getTaiThanHyThanData() {
    return this.mDepartureLoadData.getTaiThanHyThanFromJSON();
  }
  //tính can chi cho giờ (theo ngày dương lịch)
  public getSexagesimalCycleByTime(dd: any, mm: any, yy: any, hour: number) {
    return this.mDepartureExchangeDay.getSexagesimalCycleByTime(dd, mm, yy, hour);
  }

  //tính can chi cho ngày (theo ngày dương lịch)
  public getSexagesimalCycleByDay(dd: any, mm: any, yy: any) {
    return this.mDepartureExchangeDay.getSexagesimalCycleByDay(dd, mm, yy);
  }
  //tính can chi cho tháng (theo ngày dương lịch)
  public getSexagesimalCycleByMonth(dd: any, mm: any, yy: any) {
    return this.mDepartureExchangeDay.getSexagesimalCycleByMonth(dd, mm, yy);
  }
  //tính can chi cho năm (theo ngày dương lịch)
  public getSexagesimalCycleByYear(dd: any, mm: any, yy: any) {
    return this.mDepartureExchangeDay.getSexagesimalCycleByYear(dd, mm, yy);
  }
  //lấy tên ngày và lời khuyên cho ngày theo lịch khổng minh
  public getQuoteAndNameOfDay(dd: any, mm: any, data?: any) {
    if (!data) {
      data = this.departureData;
    }
    return this.mDepartureLoadData.getInfoDayInMonth(dd, mm, data);
  }
  //lấy thông tin tinh tú trong thập nhị bát sao
  public GetTNBINFO(dd: number, mm: number, yy: number, data?: any) {
    if (!data) {
      data = this.dayDetailData;
    }
    return this.mDepartureLoadData.GetTNBINFO(dd, mm, yy, data);
  }

  //lấy thông tin về trực của ngày
  public getTrucDay(lunarMonth: number, chi: string, data?: any) {
    if (!data) {
      data = this.trucData;
    }
    return this.mDepartureExchangeDay.getTrucDay(lunarMonth, chi, data);
  }
  // Lấy thông tin về ngày Tiết
  public getTietDay(date: number, month: number, data?: any) {
    if (!data) {
      data = this.tietData;
    }
    return this.mDepartureExchangeDay.getTietDay(date, month, data);
  }
  //Tính ngày hoàng đạo, hắc đạo
  public getZodiacDay(dd: any, mm: any, yy: any) {
    return this.mDepartureExchangeDay.getZodiacDay(dd, mm, yy);
  }

  //lấy đường dẫn của ảnh
  public getBackgroundLink(index) {
    return BACKGROUND[index];
  }

  //tạo ảnh nền giống nhau khi chuyển tabs
  public setBackgroundWhenChangeTabs(link: string) {
    BACKGROUNDCHANGE.push(link);
  }

  //lấy ảnh nền cho các tabs
  public getBackgroundWhenChangeTabs(): string {
    return BACKGROUNDCHANGE[BACKGROUNDCHANGE.length - 1];
  }

  // lấy more-option
  public getOptions() {
    return MOREOPTION;
  }

  public getHourBetterAndBad(chi: string) {
    return this.mDepartureExchangeDay.getHoursBetterAndBad(chi);
  }

  public getTaiThanHyThan(canchi: string, data?: any) {
    if (!data) {
      data = this.taiThan_hyThan;
    }
    return this.mDepartureExchangeDay.getTaiThanHyThan(canchi, data);
  }
  public getTuoiXungKhac(canchi: string, data?: any) {
    if (!data) {
      data = this.taiThan_hyThan;
    }
    return this.mDepartureExchangeDay.getTuoiXungKhac(canchi, data);
  }

  public getSaoTot(chi: string, lunarMonth: number, data?: any) {
    if (!data) {
      data = this.sao_tot_data;
    }
    return this.mDepartureExchangeDay.getSaoTot(chi, lunarMonth, data);
  }
  public getSaoXau(can: string, chi: string, lunarMonth: number, data?: any) {
    if (!data) {
      data = this.sao_tot_data;
    }
    return this.mDepartureExchangeDay.getSaoXau(can, chi, lunarMonth, data);
  }

  public getSpecialDate(lunarDay: string, solarDay: string, data?: any) {
    if (!data) {
      data = this.special_data;
    }
    return this.mDepartureLoadData.getSpecialDate(lunarDay, solarDay, data);
  }

  public getValueDataLeVNAL() {
    if (this.cavalVNAL) {
      return this.cavalVNAL;
    }
  }
  public getValueDataLeVNDL() {
    if (this.cavalVNDL) {
      return this.cavalVNDL;
    }
  }
  showInterstitial() {
    let adId;
    adId = 'ca-app-pub-7122576438584960/5503171687';
    this.admob.prepareInterstitial(
      {
        adId: adId,
        isTesting: true,
        overlap: true,
      }
    )
      .then(() => { this.admob.showInterstitial(); });
    this.admob.onAdDismiss().subscribe(() => {
      setTimeout(function() {
        this.showInterstitial();
      },300000);
    });
  }
  showAdvertisement() {
    this.dem++;
    this.checkFibonaci(this.dem);
  }
  // day fibonaci: 0,1,1,2,3,5,8,13,21,34,55,89,....
  checkFibonaci(number) {
    if (number == (this.n1 + this.n2)) {
      this.n1 = this.n2;
      this.n2 = number;
      if (number > this.period_number) {
        this.showInterstitial();
        this.period_number = number;
        this.dem = 0;
      }
    }
  }


  // set uid googleanalytic, 30 is dispath period
  startTrackerWithId() {
    this.googleAnalytics.startTrackerWithId("'UA-XXXX-YY", 30);
  }
  // To track a Screen 
  trackView() {
    this.googleAnalytics.trackView('Page view');
  }
  // To track an event
  tracEvent() {
    this.googleAnalytics.trackEvent('Category', 'Action', 'Label', 1);
  }
  // To track timing
  trackTiming(IntervalInMilliseconds) {
    this.googleAnalytics.trackTiming('Category', IntervalInMilliseconds, 'Variable', 'Label') // where IntervalInMilliseconds is numeric
  }
  //to enabling Advertising Features in Google Analytics allows you to take advantage of Remarketing
  setAllowIDFACollection(value: boolean) {
    this.googleAnalytics.setAllowIDFACollection(value);
  }


}


