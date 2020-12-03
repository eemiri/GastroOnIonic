import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AusliefererMapPageRoutingModule } from './auslieferer-map-routing.module';

import { AusliefererMapPage } from './auslieferer-map.page';
import { FahrerKommentarPageModule } from '../fahrer-kommentar/fahrer-kommentar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AusliefererMapPageRoutingModule,
    FahrerKommentarPageModule
  ],
  declarations: [AusliefererMapPage]
})
export class AusliefererMapPageModule {}
