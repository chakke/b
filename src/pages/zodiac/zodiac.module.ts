import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ZodiacPage } from './zodiac';

@NgModule({
  declarations: [
    ZodiacPage,
  ],
  imports: [
    IonicPageModule.forChild(ZodiacPage),
  ],
})
export class ZodiacPageModule {}
