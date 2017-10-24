import { TNBINFO } from "../../providers/departure/interface/tnb_Info";
import { DepartureModule } from "../../providers/departure/departure";
import { Utils } from "../../providers/app-utils";
import { DepartureExchangeDay } from "../../providers/departure/departure-exchangeday";
import { HUONGXUATHANH } from "../../providers/departure/interface/huong_xuat_hanh";

export class DayDetail {
    dd: number;
    mm: number;
    yy: number;
    day_of_week: string;
    lunarDate: number;
    lunarMonth: number;
    lunarYear: number;
    special_info?: string;
    special_name?: any;
    sexagesimalCycleTime: string;
    sexagesimalCycleDate: string;
    sexagesimalCycleMonth: string;
    sexagesimalCycleYear: string;
    TNBINFO: TNBINFO;
    trucDay: string;
    tietDay: string;
    hour_better: any;
    hour_bad: any;
    huong_xuat_hanh =  new Array<HUONGXUATHANH>();
    tuoi_xung_khac: string;
    sao_tot: any;
    sao_xau: any;
    exchangeDays = new DepartureExchangeDay();
    constructor(dd?: number, mm?: number, yy?: number) {
        if (dd) this.dd = dd;
        if (mm) this.mm = mm;
        if (yy) this.yy = yy;
        
    }
    setData(dd: number, mm: number, yy: number) {
        this.dd = dd;
        this.mm = mm;
        this.yy = yy;
        this.special_info = "";
        this.getDayOfWeek();
        this.getSexagesimal();
        this.loadLunarDate();
    }
    getDayOfWeek() {
        this.day_of_week = Utils.getDayOfWeek(this.dd, this.mm, this.yy);
    }
    getSexagesimal() {
        let date = new Date();
        this.sexagesimalCycleTime = this.exchangeDays.getSexagesimalCycleByTime(this.dd, this.mm, this.yy, date.getHours());
        this.sexagesimalCycleDate = this.exchangeDays.getSexagesimalCycleByDay(this.dd, this.mm, this.yy);
        this.sexagesimalCycleMonth = this.exchangeDays.getSexagesimalCycleByMonth(this.dd, this.mm, this.yy);
        this.sexagesimalCycleYear = this.exchangeDays.getSexagesimalCycleByYear(this.dd, this.mm, this.yy);
    }
    loadLunarDate() {
        let lunarday = this.exchangeDays.convertSolar2Lunar(this.dd, this.mm, this.yy,7);
        this.lunarDate = lunarday[0];
        this.lunarMonth = lunarday[1];
        this.lunarYear = lunarday[2];
    }
}