import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasswortVergessenPageRoutingModule } from './passwort-vergessen-routing.module';

import { PasswortVergessenPage } from './passwort-vergessen.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasswortVergessenPageRoutingModule,
    TranslateModule
  ],
  declarations: [PasswortVergessenPage]
})
export class PasswortVergessenPageModule {}
