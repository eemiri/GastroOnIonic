import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OverviewMapPageRoutingModule } from './overview-map-routing.module';

import { OverviewMapPage } from './overview-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OverviewMapPageRoutingModule
  ],
  declarations: [OverviewMapPage]
})
export class OverviewMapPageModule {}
