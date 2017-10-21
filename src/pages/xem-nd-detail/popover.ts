import {Component} from '@angular/core';
import { NavParams,ViewController } from 'ionic-angular';

@Component({
    template:`
        <div text-left *ngIf= "!isLoading" padding style="background: rgba(black,0.2)">
            <p style="line-height: 1.5em">{{description}}</p>
            <div style="width:100%" text-right><span style="color:#488aff" (click)="closeView()">OK</span></div>
        </div>
    `
})

export class XEMNDPopover{
    isLoading : boolean = true;
    description: any = "";
    constructor(
        private navParams: NavParams,
        public viewCtrl: ViewController
    ){

    }
    ionViewDidLoad(){
        this.description = this.navParams.get('description');
        this.isLoading = false;
    }
    closeView(){
        this.viewCtrl.dismiss();
    }
}