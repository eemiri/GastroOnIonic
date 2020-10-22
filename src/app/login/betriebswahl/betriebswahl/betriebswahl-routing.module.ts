import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BetriebswahlPage } from './betriebswahl.page';

const routes: Routes = [
  {
    path: '',
    component: BetriebswahlPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BetriebswahlPageRoutingModule {}
