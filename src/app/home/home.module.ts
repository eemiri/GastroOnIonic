import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgCalendarModule } from 'ionic2-calendar';
import { CalModalPageModule } from '../pages/cal-modal/cal-modal.module';
import { BetriebswahlPageModule } from '../login/betriebswahl/betriebswahl/betriebswahl.module';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
registerLocaleData(localeDe);//Language Package ist deutsch, noch anpassen

import localeEn from '@angular/common/locales/en';
registerLocaleData(localeEn);//Language Package ist deutsch, noch anpassen


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    TranslateModule,
    NgCalendarModule,
    CalModalPageModule,
    BetriebswahlPageModule
  ],
  declarations: [HomePage],
  // providers:[
  //   {provide: LOCALE_ID, useValue: 'de-DE'}//noch anpassen damit die sprache veränderbar ist
  // ]
})
export class HomePageModule {}
