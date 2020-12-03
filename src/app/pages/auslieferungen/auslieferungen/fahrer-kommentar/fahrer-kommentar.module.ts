import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FahrerKommentarPageRoutingModule } from './fahrer-kommentar-routing.module';

import { FahrerKommentarPage } from './fahrer-kommentar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FahrerKommentarPageRoutingModule
  ],
  declarations: [FahrerKommentarPage]
})
export class FahrerKommentarPageModule {}
