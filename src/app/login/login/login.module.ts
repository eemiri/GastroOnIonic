import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { TranslateModule } from '@ngx-translate/core';
import { BetriebswahlPageModule } from '../betriebswahl/betriebswahl/betriebswahl.module';
import { AppDatenschutzPageModule } from '../app-datenschutz/app-datenschutz/app-datenschutz.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    BetriebswahlPageModule,
    AppDatenschutzPageModule
     
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
