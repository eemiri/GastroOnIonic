import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuslieferungenPageRoutingModule } from './auslieferungen-routing.module';

import { AuslieferungenPage } from './auslieferungen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuslieferungenPageRoutingModule
  ],
  declarations: [AuslieferungenPage]
})
export class AuslieferungenPageModule {}
