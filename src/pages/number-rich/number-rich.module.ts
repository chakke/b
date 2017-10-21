import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NumberRichPage } from './number-rich';

@NgModule({
  declarations: [
    NumberRichPage,
  ],
  imports: [
    IonicPageModule.forChild(NumberRichPage),
  ],
})
export class NumberRichPageModule {}
