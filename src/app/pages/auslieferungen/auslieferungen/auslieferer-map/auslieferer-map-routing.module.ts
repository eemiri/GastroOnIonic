import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AusliefererMapPage } from './auslieferer-map.page';

const routes: Routes = [
  {
    path: '',
    component: AusliefererMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AusliefererMapPageRoutingModule {}
