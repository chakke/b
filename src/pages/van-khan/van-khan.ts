import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams,Searchbar} from 'ionic-angular';
import { DepartureModule } from '../../providers/departure/departure';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';

/**
 * Generated class for the VanKhanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-van-khan',
  templateUrl: 'van-khan.html',
})
export class VanKhanPage {
  @ViewChild(Searchbar) searchBar: Searchbar;
  data: any = [];
  data_backup: any = [];
  isClickSearch: boolean = false;
  item_height = screen.height / 10 + "px";
  constructor(
    private keyboard : Keyboard,
    private rd: Renderer2,
    private mAppModule: DepartureModule,
    public navCtrl: NavController, public navParams: NavParams,
    private statusBar: StatusBar
  ) {
  }
  ngOnInit() {
    this.data = this.mAppModule.getVanKhanValue();
    this.data_backup = this.data;
    if (!this.data) {
      this.mAppModule.getVanKhanDataJSON().then(
        data => {
          this.data = data;
          this.data_backup = data;
        }, error => { }
      )
    }
  }
  ionViewDidEnter() {
    if (!this.mAppModule.mIsOnIOSDevice) this.statusBar.backgroundColorByHexString("#274c7c");

  }
  search() {
    this.isClickSearch = true;
    setTimeout(()=> {
    this.searchBar.setFocus();
    }, 300);
  }
  cancel() {
    this.keyboard.close();
    let element =  this.searchBar.getNativeElement();
    this.rd.addClass(element,"slideOutUp");
    setTimeout(()=> {
      this.rd.removeClass(element,"slideOutUp");
      this.isClickSearch = false;
    }, 200);
  }
  initializeItems() {
    this.data = this.data_backup;
  }
  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.data = this.data.filter((item) => {
        return (item.TenLoai.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  viewItem(item) {
    if(this.isClickSearch){this.isClickSearch = false;}
    if (item.VanKhan) {
      this.navCtrl.push("VanKhanCtPage", {
        data: item
      });
    }
  }
  closeView() {
    this.navCtrl.pop();
  }
}
