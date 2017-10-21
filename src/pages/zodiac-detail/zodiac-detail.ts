import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DepartureModule } from '../../providers/departure/departure';
import { StatusBar } from '@ionic-native/status-bar';
import { AppModule } from '../../providers/app-module';

/**
 * Generated class for the ZodiacDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-zodiac-detail',
  templateUrl: 'zodiac-detail.html',
})
export class ZodiacDetailPage {
  data: any;
  isLoading: boolean = true;
  selectedIndex = 0;
  timeOut: any;
  isScroll: boolean = false;
  menu = ["Nội dung", "Lý lịch", "Truyền thuyết", "Biểu tượng", "Mô tả", "Tổng quát"];
  constructor(
    private mAppModule: DepartureModule,
    private statusBar: StatusBar,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
    if (!this.mAppModule.mIsOnIOSDevice) this.statusBar.backgroundColorByHexString("#274c7c");
    this.loadParams();
    this.isLoading = false;
    let element = document.getElementById("menu");
    element.addEventListener("scroll",()=>{
      if(!this.isScroll){
        this.scrollEnd(element);
      }
    })
  }
  scrollEnd(ele: HTMLElement) {
    if (this.timeOut) clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => {
      let distance = Math.round(ele.scrollLeft / (screen.width / 3));
      if (distance > 0) {
        this.selectedMenu(distance,false);
      }
    }, 100);
  }
  loadParams() {
    this.data = this.navParams.get("data");
  }
  closeView() {
    this.navCtrl.pop();
  }
  getContent(): string {
    if (this.selectedIndex == 0) {
      return this.data.content;
    }
    if (this.selectedIndex == 1) {
      return this.data.profile;
    }
    if (this.selectedIndex == 2) {
      return this.data.story;
    }
    if (this.selectedIndex == 3) {
      return this.data.symbol;
    }
    if (this.selectedIndex == 4) {
      return this.data.description;
    }
    if (this.selectedIndex == 5) {
      return this.data.commom;
    }
  }
  selectedMenu(index: number,isScroll : boolean) {
    this.selectedIndex = index;
    this.isScroll = isScroll;
    let menuElement = document.getElementById("menu");
    let element = document.getElementById("animateBar");
    let distanceTranform = index * screen.width/3;
    let distanceScroll: number = 0;
    distanceScroll = (index - 1) * screen.width/3;
    element.style.transform = "translate(" + distanceTranform + "px" + ",0)";
    if (index > 0 && index < 5 && isScroll) {
      AppModule.getInstance().getScrollController().doScrollLeft("menu", distanceScroll,{
        alpha: 0.2,
        callback:()=>{
          setTimeout(()=> {
            this.isScroll = false;
          }, 100);
        }
      });
    };
  }
  swipe($event){
    let direction = $event.direction;
    if(direction==2 && this.selectedIndex<5){
      this.selectedMenu(this.selectedIndex + 1,true);
    }
    if(direction==4 && this.selectedIndex>0){
      this.selectedMenu(this.selectedIndex-1,true);
    }
    
  }
}
