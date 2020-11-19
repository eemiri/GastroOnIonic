import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuslieferungenPageRoutingModule } from './auslieferungen-routing.module';

import { AuslieferungenPage } from './auslieferungen.page';
import { AusliefererMapPageModule } from './auslieferer-map/auslieferer-map.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuslieferungenPageRoutingModule,
    AusliefererMapPageModule
  ],
  declarations: [AuslieferungenPage]
})
export class AuslieferungenPageModule {}
