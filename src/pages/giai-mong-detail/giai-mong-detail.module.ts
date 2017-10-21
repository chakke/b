import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GiaiMongDetailPage } from './giai-mong-detail';

@NgModule({
  declarations: [
    GiaiMongDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(GiaiMongDetailPage),
  ],
})
export class GiaiMongDetailPageModule {}
