import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppDatenschutzPage } from './app-datenschutz.page';

const routes: Routes = [
  {
    path: '',
    component: AppDatenschutzPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppDatenschutzPageRoutingModule {}
