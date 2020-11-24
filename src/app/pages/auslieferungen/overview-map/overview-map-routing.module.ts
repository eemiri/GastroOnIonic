import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverviewMapPage } from './overview-map.page';

const routes: Routes = [
  {
    path: '',
    component: OverviewMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OverviewMapPageRoutingModule {}
