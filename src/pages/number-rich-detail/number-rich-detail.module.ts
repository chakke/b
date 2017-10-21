import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NumberRichDetailPage } from './number-rich-detail';

@NgModule({
  declarations: [
    NumberRichDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(NumberRichDetailPage),
  ],
})
export class NumberRichDetailPageModule {}
