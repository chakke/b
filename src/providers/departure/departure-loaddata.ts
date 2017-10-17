import { Http, HttpModule } from "@angular/http";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { TNBINFO } from "./interface/tnb_Info";


export class DepartureLoadData {
    day_in_months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    constructor(private http: Http) {

    }
    getTietDataFromJSON(){
        return this.http.get("./assets/departure/tiet.json")
        .map((res: any) => res.json());
    }
    getTrucDataFromJSON(){
        return this.http.get("./assets/departure/tbl_truc_ngay_thang.json")
        .map((res: any) => res.json());
    }
    getDataFromJSON() {
        return this.http.get("./assets/departure/departure.json")
            .map((res: any) => res.json());
    }
    getDayDetailFromJSON(){
        return this.http.get("./assets/departure/tbl_nhithapbat_tu.json")
        .map((res: any) => res.json());
    }
    getTaiThanHyThanFromJSON(){
        return this.http.get("./assets/departure/tbl_huong_taithan_hythan.json")
        .map((res: any) => res.json());
    } 
    getSaoTotSaoXauDataFromJSON(){
        return this.http.get("./assets/departure/sao_tot.json")
        .map((res: any) => res.json());
    } 
    getSpecialDataFromJSON(){
        return this.http.get("./assets/departure/tbl_special_date.json")
        .map((res: any) => res.json());
    }
    getLeVietNamAmLichDataFromJSON(){
        return this.http.get("./assets/departure/LeVietNamAmLich.json")
        .map((res: any) => res.json());
    }
    getLeVietNamDuongLichDataFromJSON(){
        return this.http.get("./assets/departure/LeVietNamDuongLich.json")
        .map((res: any) => res.json());
    }
    getVanKhanDataFromJSON(){
        return this.http.get("./assets/departure/VanKhan.json")
        .map((res: any) => res.json());
    }
    getGiaiMongDataFromJSON(){
        return this.http.get("./assets/departure/tbl_giaimong.json")
        .map((res: any) => res.json());
    }
    getTypeOfDay(lunarMonth: any, data: any) {
        let type: any;
        if (lunarMonth == 1 || lunarMonth == 4 || lunarMonth == 7 || lunarMonth == 10) {
            type = data.Departure[0]
        } else if (lunarMonth == 2 || lunarMonth == 5 || lunarMonth == 8 || lunarMonth == 11) {
            type = data.Departure[1];
        } else if (lunarMonth == 3 || lunarMonth == 6 || lunarMonth == 9 || lunarMonth == 12) {
            type = data.Departure[2];
        }
        return type;
    }

    getInfoDayInMonth(lunarDate: any, lunarMonth: any, data: any) {
        let type = this.getTypeOfDay(lunarMonth, data);
        let day: any[] = type.day;
        for (let x of day) {
            for (let y of x.dayindex) {
                if (lunarDate == y) {
                    return new Array(x.nameofday, x.comment ,x.id)
                }
            }
        }
    }
    GetTNBINFO(dd: number, mm : number, yy: number, data){
        let detailData = data.DayDetail;
        var idNUmber = this.getIDStar(dd,mm,yy);
        let tnb_info : TNBINFO = {
            thapnhibat_ten : data[idNUmber-1].thapnhibat_ten,
            nguhanh_id : data[idNUmber-1].nguhanh_id,
            thapnhibat_tho : data[idNUmber-1].thapnhibat_tho,
            nen_lam : data[idNUmber -1].nen_lam,
            kieng_ky: data[idNUmber-1].kieng_ky
        }
        return tnb_info;
    }

    getIDStar(dd: number, mm : number, yy: number){
        // moc la ngay 1-1-1900 id sao la 5 ;
        var number1 = (yy-1900) + Math.floor((yy-1900)/4);
        let number2 = dd;
        for(let i = 0; i< mm-1; i++){
            number2 += this.day_in_months[i];
        }
        let number = 0;

        if(mm<2 && yy%4==0){
            number = number1 + number2  - 1;
        }
        if(yy%4!=0){
            number = number1 + number2;
        }
        
        let number_day_more = 0;
        number_day_more = (number % 28);
        
        if(number_day_more<= 23){
            return number_day_more  + 4;
        }else{
            return (5 + number_day_more)%28;
        }
        
    }



    getSpecialDate(lunarDay: string, solarDay: string, data : any){
        let result = [];
        for(let i = 0; i< data.length; i++){
            let luna_date = data[i].luna_date;
            let sun_date = data[i].sun_date;
            if(luna_date && lunarDay == luna_date){
                result.push(data[i].luna_date +"/ "+ data[i].description);
            }
            if(sun_date && solarDay == sun_date){
                result.push(data[i].sun_date+"/ "+data[i].description);
            }
        }
        return result;
    }



}