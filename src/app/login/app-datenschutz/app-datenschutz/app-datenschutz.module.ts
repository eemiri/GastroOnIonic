import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppDatenschutzPageRoutingModule } from './app-datenschutz-routing.module';

import { AppDatenschutzPage } from './app-datenschutz.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppDatenschutzPageRoutingModule,
    TranslateModule
  ],
  declarations: [AppDatenschutzPage]
})
export class AppDatenschutzPageModule {}
