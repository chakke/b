import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ZodiacDetailPage } from './zodiac-detail';

@NgModule({
  declarations: [
    ZodiacDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ZodiacDetailPage),
  ],
})
export class ZodiacDetailPageModule {}
