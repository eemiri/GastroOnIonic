import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FahrerKommentarPage } from './fahrer-kommentar.page';

const routes: Routes = [
  {
    path: '',
    component: FahrerKommentarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FahrerKommentarPageRoutingModule {}
