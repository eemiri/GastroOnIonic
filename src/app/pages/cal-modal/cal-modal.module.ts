import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalModalPageRoutingModule } from './cal-modal-routing.module';

import { CalModalPage } from './cal-modal.page';
import { NgCalendarModule } from 'ionic2-calendar';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalModalPageRoutingModule,
    NgCalendarModule,
    TranslateModule
  ],
  declarations: [CalModalPage]
})
export class CalModalPageModule {}
