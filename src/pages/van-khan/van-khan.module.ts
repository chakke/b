import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VanKhanPage } from './van-khan';

@NgModule({
  declarations: [
    VanKhanPage,
  ],
  imports: [
    IonicPageModule.forChild(VanKhanPage),
  ],
})
export class VanKhanPageModule {}
