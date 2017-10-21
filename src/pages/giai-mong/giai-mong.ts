import { Component, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DepartureModule } from '../../providers/departure/departure';
import { AppModule } from '../../providers/app-module';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the GiaiMongPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface Letter {
  letter: string;
  index: number;
}

@IonicPage()
@Component({
  selector: 'page-giai-mong',
  templateUrl: 'giai-mong.html',
})
//#49627c
export class GiaiMongPage {
  @ViewChild('mongName') mongName: ElementRef;
  @ViewChild('mongContent') mongContent: ElementRef;
  row_height = 30;
  data: any;
  selectedIndex = 0;
  letters = new Array<Letter>();
  divID = ['scroll1', 'scroll2'];
  currentID: any;
  timeoutID = [];
  touchID = [];
  scroll_controller = AppModule.getInstance().getScrollController();
  constructor(
    private statusBar: StatusBar,
    private rd: Renderer2,
    private mAppModule: DepartureModule,
    public navCtrl: NavController, public navParams: NavParams) {
  }
  closeView() {
    this.navCtrl.pop();
  }
  loadData() {
    if (!this.data) {
      this.mAppModule.getGiaiMongDataJSON().then(
        data => {
          this.data = data;
          this.data = this.data.sort((a, b) => {
            let x = this.bodauTiengViet(a.mong_name);
            let y = this.bodauTiengViet(b.mong_name);
            if (x < y) { return -1; }
            if (x > y) { return 1; }
            return 0;
          });
          this.getLetter();
        }, error => { }
      )
    }
  }
  ionViewDidEnter() {
    this.loadData();
    if (!this.mAppModule.mIsOnIOSDevice) this.statusBar.backgroundColorByHexString("#274c7c");
    this.addEventListener();
    // console.log('ionViewDidLoad GiaiMongPage');
  }
  addEventListener() {
    for (let i = 0; i < this.divID.length; i++) {
      let scrollElem = document.getElementById(this.divID[i]);

      scrollElem.addEventListener("scroll", (event) => {
        if (!this.touchID[i]) {
          this.scrollEnd(this.divID[i], scrollElem, i);
        }
      });

      scrollElem.addEventListener("touchstart", () => {
        this.touchID[i] = true;
        this.currentID = i;
      });

      scrollElem.addEventListener("touchend", () => {
        this.touchID[i] = false;
        this.scrollEnd(this.divID[i], scrollElem, i);
      });
    }
  }
  scrollEnd(divID: string, scrollElm: HTMLElement, i: number) {
    if (this.timeoutID[i]) clearTimeout(this.timeoutID[i]);
    if (i == this.currentID) {
      let topNumber = Math.round(scrollElm.scrollTop / this.row_height) * this.row_height;
      this.timeoutID[i] = setTimeout(() => {
        this.scrollTop(divID, topNumber, i);
      }, 100)
    }
  }
  scrollTop(divID: string, top: number, i: number) {
    let nowScrollTop = document.getElementById(divID).scrollTop;
    this.scroll_controller.doScroll(divID, top, {
      alpha: 0.1,
      callback: () => {
        if (nowScrollTop % 30 == 0 && this.currentID == i) {
          this.getElement(i);
        }
      }
    });
  }
  getElement(i: number) {
    let scrollElm = document.getElementById(this.divID[i]);
    let childIndex = Math.round(scrollElm.scrollTop / this.row_height);
    if (i == 0) {
      let letter = this.letters[childIndex].letter;
      let element = document.getElementById("scroll2");
      let elementIndex = Math.round(element.scrollTop / this.row_height);
      if (letter == this.bodauTiengViet(this.data[elementIndex].mong_name.charAt(0)).toUpperCase()) {
        return;
      } else {
        element.scrollTop = this.findTopNumber(letter, i) * this.row_height;
      }
    } else {
      let letter = this.bodauTiengViet(this.data[childIndex].mong_name.charAt(0)).toUpperCase();
      let element = document.getElementById("scroll1");
      element.scrollTop = this.findTopNumber(letter, i) * this.row_height;
    }
  }
  findTopNumber(letter: string, i: number): number {
    if (i == 0) {
      for (let i = 0; i < this.letters.length; i++) {
        if (letter == this.letters[i].letter) {
          return this.letters[i].index;
        }
      }
    } else {
      for (let i = 0; i < this.letters.length; i++) {
        if (letter == this.letters[i].letter) {
          return i;
        }
      }
    }

  }
  bodauTiengViet(str: string): string {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    // str = str.replace(/\W+/g, ' ');
    // str = str.replace(/\s/g, '-');
    return str;
  }
  checkLetter(lettter: string): boolean {
    for (let i = 0; i < this.letters.length; i++) {
      if (lettter == this.letters[i].letter) {
        return true;
      }
    }
    return false;
  }
  getLetter() {
    for (let i = 0; i < this.data.length; i++) {
      let letter = this.bodauTiengViet(this.data[i].mong_name.charAt(0)).toUpperCase();
      if (i == 0) {
        this.letters.push({
          letter: letter,
          index: 0
        });
      }
      if (!this.checkLetter(letter)) {
        this.letters.push({
          letter: letter,
          index: i
        });
      }
    }
  }
  isClickView: boolean = false;
  viewDetail() {
    let element = document.getElementById("scroll2");
    let index = element.scrollTop / this.row_height;
    this.selectedIndex = index;
    this.navCtrl.push("GiaiMongDetailPage",{data:this.data[this.selectedIndex]});
    // this.rd.addClass(this.mongContent.nativeElement,"fadeInUp");
  }
}
