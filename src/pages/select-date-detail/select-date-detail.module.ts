import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectDateDetailPage } from './select-date-detail';

@NgModule({
  declarations: [
    SelectDateDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectDateDetailPage),
  ],
})
export class SelectDateDetailPageModule {}
