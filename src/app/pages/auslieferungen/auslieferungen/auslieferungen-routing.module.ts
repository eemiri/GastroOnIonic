import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuslieferungenPage } from './auslieferungen.page';

const routes: Routes = [
  {
    path: '',
    component: AuslieferungenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuslieferungenPageRoutingModule {}
