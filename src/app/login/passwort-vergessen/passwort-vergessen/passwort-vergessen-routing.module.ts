import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswortVergessenPage } from './passwort-vergessen.page';

const routes: Routes = [
  {
    path: '',
    component: PasswortVergessenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswortVergessenPageRoutingModule {}
