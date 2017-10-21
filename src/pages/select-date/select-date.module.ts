import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectDatePage } from './select-date';

@NgModule({
  declarations: [
    SelectDatePage,
  ],
  imports: [
    IonicPageModule.forChild(SelectDatePage),
  ],
})
export class SelectDatePageModule {}
