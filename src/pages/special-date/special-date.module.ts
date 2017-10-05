import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpecialDatePage } from './special-date';

@NgModule({
  declarations: [
    SpecialDatePage,
  ],
  imports: [
    IonicPageModule.forChild(SpecialDatePage),
  ],
})
export class SpecialDatePageModule {}
