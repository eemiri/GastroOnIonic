import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BetriebswahlPageRoutingModule } from './betriebswahl-routing.module';

import { BetriebswahlPage } from './betriebswahl.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BetriebswahlPageRoutingModule,
    TranslateModule
  ],
  declarations: [BetriebswahlPage]
})
export class BetriebswahlPageModule {}
