import { ZODIACTIME } from '../departure/departure-zodiactimestorage';
import { Hour } from './departure-hour';
import { HUONGXUATHANH } from './interface/huong_xuat_hanh';
import { TNBINFO } from './interface/tnb_Info';

export class DepartureExchangeDay {
    day_in_months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    jdFromDate(dd, mm, yy) {
        let a, y, m, jd;
        a = parseInt(((14 - mm) / 12).toString());
        y = yy + 4800 - a;
        m = mm + 12 * a - 3;
        jd = dd + parseInt(((153 * m + 2) / 5).toString()) + 365 * y + parseInt((y / 4).toString()) - parseInt((y / 100).toString()) + parseInt((y / 400).toString()) - 32045;
        if (jd < 2299161) {
            jd = dd + parseInt(((153 * m + 2) / 5).toString()) + 365 * y + parseInt((y / 4).toString()) - 32083;
        }
        return jd;
    }

    jdToDate(jd) {
        let a, b, c, d, e, m, day, month, year;
        if (jd > 2299160) { // After 5/10/1582, Gregorian calendar
            a = jd + 32044;
            b = parseInt(((4 * a + 3) / 146097).toString());
            c = a - parseInt(((b * 146097) / 4).toString());
        } else {
            b = 0;
            c = jd + 32082;
        }
        d = parseInt(((4 * c + 3) / 1461).toString());
        e = c - parseInt(((1461 * d) / 4).toString());
        m = parseInt(((5 * e + 2) / 153).toString());
        day = e - parseInt(((153 * m + 2) / 5).toString()) + 1;
        month = m + 3 - 12 * parseInt((m / 10).toString());
        year = b * 100 + d - 4800 + parseInt((m / 10).toString());
        return new Array(day, month, year);
    }

    getNewMoonDay(k, timeZone) {

        let T, T2, T3, dr, Jd1, M, Mpr, F, C1, deltat, JdNew;
        T = k / 1236.85; // Time in Julian centuries from 1900 January 0.5
        T2 = T * T;
        T3 = T2 * T;
        dr = Math.PI / 180;
        Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
        Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr); // Mean new moon
        M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3; // Sun's mean anomaly
        Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3; // Moon's mean anomaly
        F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3; // Moon's argument of latitude
        C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
        C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
        C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
        C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
        C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
        C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
        C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
        if (T < -11) {
            deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
        } else {
            deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
        };
        JdNew = Jd1 + C1 - deltat;
        return parseInt((JdNew + 0.5 + timeZone / 24).toString())
    }

    getSunLongitude(jdn, timeZone) {

        let T, T2, dr, M, L0, DL, L;
        T = (jdn - 2451545.5 - timeZone / 24) / 36525; // Time in Julian centuries from 2000-01-01 12:00:00 GMT
        T2 = T * T;
        dr = Math.PI / 180; // degree to radian
        M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2; // mean anomaly, degree
        L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2; // mean longitude, degree
        DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
        DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
        L = L0 + DL; // true longitude, degree
        L = L * dr;
        L = L - Math.PI * 2 * (parseInt((L / (Math.PI * 2)).toString())); // Normalize to (0, 2*PI)
        return parseInt((L / Math.PI * 6).toString())
    }

    getLunarMonth11(yy, timeZone) {

        var k, off, nm, sunLong;
        off = this.jdFromDate(31, 12, yy) - 2415021;
        k = parseInt((off / 29.530588853).toString());
        nm = this.getNewMoonDay(k, timeZone);
        sunLong = this.getSunLongitude(nm, timeZone); // sun longitude at local midnight
        if (sunLong >= 9) {
            nm = this.getNewMoonDay(k - 1, timeZone);
        }
        return nm;
    }

    getLeapMonthOffset(a11, timeZone) {
        var k, last, arc, i;
        k = parseInt(((a11 - 2415021.076998695) / 29.530588853 + 0.5).toString());
        last = 0;
        i = 1; // We start with the month following lunar month 11
        arc = this.getSunLongitude(this.getNewMoonDay(k + i, timeZone), timeZone);
        do {
            last = arc;
            i++;
            arc = this.getSunLongitude(this.getNewMoonDay(k + i, timeZone), timeZone);
        } while (arc != last && i < 14);
        return i - 1;
    }

    //Chuyển ngày dương sang ngày âm
    public convertSolar2Lunar(dd, mm, yy, timeZone) {

        let k, dayNumber, monthStart, a11, b11, lunarDay, lunarMonth, lunarYear, lunarLeap;
        dayNumber = this.jdFromDate(dd, mm, yy);
        k = parseInt(((dayNumber - 2415021.076998695) / 29.530588853).toString());
        monthStart = this.getNewMoonDay(k + 1, timeZone);
        if (monthStart > dayNumber) {
            monthStart = this.getNewMoonDay(k, timeZone);
        }
        a11 = this.getLunarMonth11(yy, timeZone);
        b11 = a11;
        if (a11 >= monthStart) {
            lunarYear = yy;
            a11 = this.getLunarMonth11(yy - 1, timeZone);
        } else {
            lunarYear = yy + 1;
            b11 = this.getLunarMonth11(yy + 1, timeZone);
        }
        lunarDay = dayNumber - monthStart + 1;
        let diff = parseInt(((monthStart - a11) / 29).toString());
        lunarLeap = 0;
        lunarMonth = diff + 11;
        if (b11 - a11 > 365) {
            let leapMonthDiff = this.getLeapMonthOffset(a11, timeZone);
            if (diff >= leapMonthDiff) {
                lunarMonth = diff + 10;
                if (diff == leapMonthDiff) {
                    lunarLeap = 1;
                }
            }
        }
        if (lunarMonth > 12) {
            lunarMonth = lunarMonth - 12;
        }
        if (lunarMonth >= 11 && diff < 4) {
            lunarYear -= 1;
        }
        return new Array(lunarDay, lunarMonth, lunarYear);
    }

    //Chuyển ngày âm sang ngày dương
    convertLunar2Solar(lunarDay, lunarMonth, lunarYear, timeZone) {

        let k, a11, b11, off, leapOff, leapMonth, monthStart;
        if (lunarMonth < 11) {
            a11 = this.getLunarMonth11(lunarYear - 1, timeZone);
            b11 = this.getLunarMonth11(lunarYear, timeZone);
        } else {
            a11 = this.getLunarMonth11(lunarYear, timeZone);
            b11 = this.getLunarMonth11(lunarYear + 1, timeZone);
        }
        off = lunarMonth - 11;
        if (off < 0) {
            off += 12;
        }
        if (b11 - a11 > 365) {
            leapOff = this.getLeapMonthOffset(a11, timeZone);
            leapMonth = leapOff - 2;
            if (leapMonth < 0) {
                leapMonth += 12;
            }
            if (off >= leapOff) {
                off += 1;
            }
        }
        k = parseInt((0.5 + (a11 - 2415021.076998695) / 29.530588853).toString());
        monthStart = this.getNewMoonDay(k + off, timeZone);
        return this.jdToDate(monthStart + lunarDay - 1);
    }


    //Tính Can Chi Theo Năm (đầu vào theo dương lịch)
    getSexagesimalCycleByYear(date: number, month: number, year: number) {
        let can: string;
        let chi: string;
        let result: string;
        let x: number[] = this.convertSolar2Lunar(date, month, year, 7);
        if (parseInt(((x[2] + 6) % 10).toString()) == 0) {
            can = "Giáp"
        }
        if (parseInt(((x[2] + 6) % 10).toString()) == 1) {
            can = "Ất"
        }
        if (parseInt(((x[2] + 6) % 10).toString()) == 2) {
            can = "Bính"
        }
        if (parseInt(((x[2] + 6) % 10).toString()) == 3) {
            can = "Đinh"
        }
        if (parseInt(((x[2] + 6) % 10).toString()) == 4) {
            can = "Mậu"
        }
        if (parseInt(((x[2] + 6) % 10).toString()) == 5) {
            can = "Kỷ"
        }
        if (parseInt(((x[2] + 6) % 10).toString()) == 6) {
            can = "Canh"
        }
        if (parseInt(((x[2] + 6) % 10).toString()) == 7) {
            can = "Tân"
        }
        if (parseInt(((x[2] + 6) % 10).toString()) == 8) {
            can = "Nhâm"
        }
        if (parseInt(((x[2] + 6) % 10).toString()) == 9) {
            can = "Quý"
        }

        if (parseInt(((x[2] + 8) % 12).toString()) == 0) {
            chi = "Tý"
        }
        if (parseInt(((x[2] + 8) % 12).toString()) == 1) {
            chi = "Sửu"
        }
        if (parseInt(((x[2] + 8) % 12).toString()) == 2) {
            chi = "Dần"
        }
        if (parseInt(((x[2] + 8) % 12).toString()) == 3) {
            chi = "Mão"
        }
        if (parseInt(((x[2] + 8) % 12).toString()) == 4) {
            chi = "Thìn"
        }
        if (parseInt(((x[2] + 8) % 12).toString()) == 5) {
            chi = "Tỵ"
        }
        if (parseInt(((x[2] + 8) % 12).toString()) == 6) {
            chi = "Ngọ"
        }
        if (parseInt(((x[2] + 8) % 12).toString()) == 7) {
            chi = "Mùi"
        }
        if (parseInt(((x[2] + 8) % 12).toString()) == 8) {
            chi = "Thân"
        }
        if (parseInt(((x[2] + 8) % 12).toString()) == 9) {
            chi = "Dậu"
        }
        if (parseInt(((x[2] + 8) % 12).toString()) == 10) {
            chi = "Tuất"
        }
        if (parseInt(((x[2] + 8) % 12).toString()) == 11) {
            chi = "Hợi"
        }

        result = can + " " + chi;
        return result
    }

    //tính can chi theo tháng (đầu vào theo dương lịch)
    getSexagesimalCycleByMonth(dd: any, mm: any, yy: any) {
        let result: string;
        let chi: string;
        let y: number[] = this.convertSolar2Lunar(dd, mm, yy, 7);
        let month: number = y[1];
        if (month == 1) {
            chi = "Dần"
        }
        if (month == 2) {
            chi = "Mão"
        }
        if (month == 3) {
            chi = "Thìn"
        }
        if (month == 4) {
            chi = "Tỵ"
        }
        if (month == 5) {
            chi = "Ngọ"
        }
        if (month == 6) {
            chi = "Mùi"
        }
        if (month == 7) {
            chi = "Thân"
        }
        if (month == 8) {
            chi = "Dậu"
        }
        if (month == 9) {
            chi = "Tuất"
        }
        if (month == 10) {
            chi = "Hợi"
        }
        if (month == 11) {
            chi = "Tý"
        }
        if (month == 12) {
            chi = "Sửu"
        }

        let z: number[] = this.convertSolar2Lunar(dd, mm, yy, 7);
        let x: number = (z[2] * 12 + z[1] + 3) % 10;
        let can: string;
        if (x == 0) {
            can = "Giáp"
        }
        if (x == 1) {
            can = "Ất"
        }
        if (x == 2) {
            can = "Bính"
        }
        if (x == 3) {
            can = "Đinh"
        }
        if (x == 4) {
            can = "Mậu"
        }
        if (x == 5) {
            can = "Kỷ"
        }
        if (x == 6) {
            can = "Canh"
        }
        if (x == 7) {
            can = "Tân"
        }
        if (x == 8) {
            can = "Nhâm"
        }
        if (x == 9) {
            can = "Quý"
        }

        result = can + " " + chi;
        return result;
    }

    //Tính Can Chi theo Ngày (đầu vào theo dương lịch)
    getSexagesimalCycleByDay(date: any, month: any, year: any) {
        let can: string;
        let chi: string;
        let result: string;
        let N: number = parseInt(this.jdFromDate(date, month, year).toString());
        
        if (parseInt(((N + 9) % 10).toString()) == 0) {
            can = "Giáp"
        }
        if (parseInt(((N + 9) % 10).toString()) == 1) {
            can = "Ất"
        }
        if (parseInt(((N + 9) % 10).toString()) == 2) {
            can = "Bính"
        }
        if (parseInt(((N + 9) % 10).toString()) == 3) {
            can = "Đinh"
        }
        if (parseInt(((N + 9) % 10).toString()) == 4) {
            can = "Mậu"
        }
        if (parseInt(((N + 9) % 10).toString()) == 5) {
            can = "Kỷ"
        }
        if (parseInt(((N + 9) % 10).toString()) == 6) {
            can = "Canh"
        }
        if (parseInt(((N + 9) % 10).toString()) == 7) {
            can = "Tân"
        }
        if (parseInt(((N + 9) % 10).toString()) == 8) {
            can = "Nhâm"
        }
        if (parseInt(((N + 9) % 10).toString()) == 9) {
            can = "Quý"
        }
        if (parseInt(((N + 1) % 12).toString()) == 0) {
            chi = "Tý"
        }
        if (parseInt(((N + 1) % 12).toString()) == 1) {
            chi = "Sửu"
        }
        if (parseInt(((N + 1) % 12).toString()) == 2) {
            chi = "Dần"
        }
        if (parseInt(((N + 1) % 12).toString()) == 3) {
            chi = "Mão"
        }
        if (parseInt(((N + 1) % 12).toString()) == 4) {
            chi = "Thìn"
        }
        if (parseInt(((N + 1) % 12).toString()) == 5) {
            chi = "Tỵ"
        }
        if (parseInt(((N + 1) % 12).toString()) == 6) {
            chi = "Ngọ"
        }
        if (parseInt(((N + 1) % 12).toString()) == 7) {
            chi = "Mùi"
        }
        if (parseInt(((N + 1) % 12).toString()) == 8) {
            chi = "Thân"
        }
        if (parseInt(((N + 1) % 12).toString()) == 9) {
            chi = "Dậu"
        }
        if (parseInt(((N + 1) % 12).toString()) == 10) {
            chi = "Tuất"
        }
        if (parseInt(((N + 1) % 12).toString()) == 11) {
            chi = "Hợi"
        }

        result = can + " " + chi;
        return result;
    }

    //Tính ngày hoàng đạo, hắc đạo
    getZodiacDay(date: any, month: any, year: any) {
        let lunarmonth = this.convertSolar2Lunar(date, month, year, 7)[1];
        let temp = this.getSexagesimalCycleByDay(date, month, year).split(" ");
        let can = temp[0];
        let chi = temp[1];
        if (lunarmonth == 1 || lunarmonth == 7) {
            if (chi == "Tý" || chi == "Sửu" || chi == "Tỵ" || chi == "Mùi") {
                return 1;
            } else if (chi == "Ngọ" || chi == "Mão" || chi == "Hợi" || chi == "Dậu") {
                return 2;
            } else {
                return 0;
            }
        }

        if (lunarmonth == 2 || lunarmonth == 8) {
            if (chi == "Dần" || chi == "Mão" || chi == "Mùi" || chi == "Dậu") {
                return 1;
            } else if (chi == "Thân" || chi == "Tỵ" || chi == "Hợi" || chi == "Sửu") {
                return 2;
            } else {
                return 0;
            }
        }

        if (lunarmonth == 3 || lunarmonth == 9) {
            if (chi == "Thìn" || chi == "Tỵ" || chi == "Dậu" || chi == "Hợi") {
                return 1;
            } else if (chi == "Tuất" || chi == "Mùi" || chi == "Mão" || chi == "Sửu") {
                return 2;
            } else {
                return 0;
            }
        }

        if (lunarmonth == 4 || lunarmonth == 10) {
            if (chi == "Ngọ" || chi == "Sửu" || chi == "Hợi" || chi == "Mùi") {
                return 1;
            } else if (chi == "Tý" || chi == "Dậu" || chi == "Tỵ" || chi == "Mão") {
                return 2;
            } else {
                return 0;
            }
        }

        if (lunarmonth == 5 || lunarmonth == 11) {
            if (chi == "Thân" || chi == "Sửu" || chi == "Dậu" || chi == "Mão") {
                return 1;
            } else if (chi == "Dần" || chi == "Mùi" || chi == "Hợi" || chi == "Tỵ") {
                return 2;
            } else {
                return 0;
            }
        }

        if (lunarmonth == 6 || lunarmonth == 12) {
            if (chi == "Tuất" || chi == "Hợi" || chi == "Tỵ" || chi == "Mão") {
                return 1;
            } else if (chi == "Thìn" || chi == "Sửu" || chi == "Mùi" || chi == "Dậu") {
                return 2;
            } else {
                return 0;
            }
        }
    }
    //tính can của ngày
    getCanDay(date: any, month: any, year: any) {
        let result: string;
        let N: number = parseInt(this.jdFromDate(date, month, year).toString());
        let tempCalculation: number = parseInt(((N + 9) % 10).toString());
        switch (tempCalculation) {
            case 0:
                result = "Giáp";
                break;
            case 1:
                result = "Ất";
                break;
            case 2:
                result = "Bính";
                break;
            case 3:
                result = "Đinh";
                break;
            case 4:
                result = "Mậu";
                break;
            case 5:
                result = "Kỷ";
                break;
            case 6:
                result = "Canh";
                break;
            case 7:
                result = "Nhâm";
                break;
            case 8:
                result = "Tân";
                break;
            case 9:
                result = "Quý";
                break;
            default:
                break;
        }
        return result;
    }

    //quy đổi giờ sang 12 canh
    exchangetoZodiacTime(hour: number) {
        let result: string;
        if (hour >= 1 && hour < 3) {
            result = "Sửu"
        } else if (hour >= 3 && hour < 5) {
            result = "Dần"
        } else if (hour >= 5 && hour < 7) {
            result = "Mão"
        } else if (hour >= 7 && hour < 9) {
            result = "Thìn"
        } else if (hour >= 9 && hour < 11) {
            result = "Tỵ"
        } else if (hour >= 11 && hour < 13) {
            result = "Ngọ"
        } else if (hour >= 13 && hour < 15) {
            result = "Mùi"
        } else if (hour >= 15 && hour < 17) {
            result = "Thân"
        } else if (hour >= 17 && hour < 19) {
            result = "Dậu"
        } else if (hour >= 19 && hour < 21) {
            result = "Tuất"
        } else if (hour >= 21 && hour < 23) {
            result = "Hợi"
        } else if (hour >= 23 && hour <= 24) {
            result = "Tý"
        } else if (hour >= 0 && hour < 1) {
            result = "Tý"
        }
        return result;
    }

    //lấy dữ liệu từ bảng dữ liệu can của giờ
    getDataFromZodiacTime(can: String, canh: String) {
        let result: string;
        for (let x of ZODIACTIME) {
            for (let y of x.can) {
                if (can == y) {
                    if (canh == "Tý") {
                        result = x.ti;
                    } else if (canh == "Sửu") {
                        result = x.suu;
                    } else if (canh == "Dần") {
                        result = x.dan;
                    } else if (canh == "Mão") {
                        result = x.mao;
                    } else if (canh == "Thìn") {
                        result = x.thin;
                    } else if (canh == "Tỵ") {
                        result = x.ty;
                    } else if (canh == "Ngọ") {
                        result = x.ngo;
                    } else if (canh == "Mùi") {
                        result = x.mui;
                    } else if (canh == "Thân") {
                        result = x.than;
                    } else if (canh == "Dậu") {
                        result = x.dau;
                    } else if (canh == "Tuất") {
                        result = x.tuat;
                    } else if (canh == "Hợi") {
                        result = x.hoi;
                    }
                }
            }
        }
        return result;
    }

    //tính can chi cho giờ 
    getSexagesimalCycleByTime(dd: any, mm: any, yy: any, hour: number) {
        let result: string;
        let can: string = this.getCanDay(dd, mm, yy);
        let canh: string = this.exchangetoZodiacTime(hour);
        result = this.getDataFromZodiacTime(can, canh);
        return result;
    }

    //Tính năm nhuận. Trả về số ngày nhuận
    isLeap(year) {
        if ((year % 4) || ((year % 100 === 0) && (year % 400))) return 0;
        else return 1;
    }

    //Tính số ngày của một tháng
    daysInMonth(month, year) {
        return (month === 2) ? (28 + this.isLeap(year)) : 31 - (month - 1) % 7 % 2;
    }
    getTrucDay(lunarMonth: number,chi:string,data:any){
        for(let i = (lunarMonth-1)*12 ; i<(lunarMonth-1)*12 + 12; i++){
            if(chi==data[i].ngay_chi){
                return data[i].name;
            }
        }
    }
    getTietDay(date: number , solarMonth: number,data: any){
        
        let dateNumber = [];
        for(let j = ((solarMonth-1)*2); j < ((solarMonth-1)*2) + 2; j++){
            dateNumber.push(parseInt(data[j].date));
        }
        // console.log(dateNumber);
        if(date < dateNumber[0] && solarMonth==1){
            return data[data.length-1].name;
        }
        if(date < dateNumber[0]){
            return data[(solarMonth-1)*2 -1].name;
        }else if(date >= dateNumber[0] && date < dateNumber[1]){
            return data[(solarMonth-1)*2].name;
        }else if(date >= dateNumber[1]){
            return data[(solarMonth-1)*2 + 1].name;
        }
    }
    getHourDay(){
        return Hour;
    }
    getHoursBetterAndBad(chi: string){
        let result = [[],[]];
        let hourdata = this.getHourDay();
        let check: boolean = false;
        for(let k = 0; k<hourdata.length;k++){
            let chi_array = hourdata[k].chi.split(",");
            chi_array.forEach(element => {
                if(chi.toLowerCase()==element.toLowerCase()){
                    result[0].push(hourdata[k].gio_tot);
                    result[1].push(hourdata[k].gio_xau);
                    check = true;
                }
            });
            if(check){
                break;
            }
        }
        return result;
    }
    getTaiThanHyThan(canchi: string,data: any){
        let can = canchi.split(" ")[0];
        let chi = canchi.split(" ")[1];
        let taiThan_hyThan_data = data.taithan_hythan;
        let hac_than_data = data.hac_than;
        let result = [];
        for(let i = 0;i<taiThan_hyThan_data.length;i++){
            if(can==taiThan_hyThan_data[i].can){
                let huong_xuat_hanh : HUONGXUATHANH = {
                    huong_id : taiThan_hyThan_data[i].huong_id,
                    huong_name: taiThan_hyThan_data[i].taithan_hythan
                }
                result.push(huong_xuat_hanh);
            }
        }
        for(let j = 0; j<hac_than_data.length; j++){
            if(can==hac_than_data[j].can && chi==hac_than_data[j].chi){
                let huong_xuat_hanh : HUONGXUATHANH = {
                    huong_id : hac_than_data[j].huong_id,
                    huong_name: "Hắc Thần"
                }
                result.push(huong_xuat_hanh);
                break;
            }
        }
        return result;
    }
    getTuoiXungKhac(canchi: string, data: any){
        
        let tuoi_xung_khac_data = data.tuoi_xung_khac;
        for(let t = 0; t< tuoi_xung_khac_data.length;t++){
            if(canchi.toLowerCase()==tuoi_xung_khac_data[t].canchi.toLowerCase()){
                return tuoi_xung_khac_data[t].tuoi_xung_khac;
            }
        }
    }

    getSaoTot(chi: string,lunarMonth: number,data : any){
        let result= [];
        let data_sao_tot = data.sao_tot;
        for(let i = 0;i<data_sao_tot.length;i++){
            if(chi.toLowerCase()==data_sao_tot[i].chi.split(", ")[lunarMonth-1].toLowerCase()){
                result.push(data_sao_tot[i].name);
            }
        }
        return result;
    }
    getSaoXau(can : string, chi: string,lunarMonth: number,data : any){
        let result= [];
        let data_sao_xau = data.sao_xau;
        for(let i = 0;i<data_sao_xau.length;i++){
            if(i<data_sao_xau.length - 2 && chi.toLowerCase()==data_sao_xau[i].chi.split(", ")[lunarMonth-1].toLowerCase()){
                result.push(data_sao_xau[i].name);
            }
            if(i>=data_sao_xau.length - 2 && can.toLowerCase()==data_sao_xau[i].chi.split(", ")[lunarMonth-1].toLowerCase()){
                result.push(data_sao_xau[i].name);
            }
        }
        return result;
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

   
}