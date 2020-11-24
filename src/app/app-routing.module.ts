import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canLoad:[AuthGuard]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login/login.module').then( m => m.LoginPageModule),
    canLoad:[AutoLoginGuard]
  },
  {
    path: 'language-popover',
    loadChildren: () => import('./pages/language-popover/language-popover.module').then( m => m.LanguagePopoverPageModule)
  },
  {
    path: 'betriebswahl',
    loadChildren: () => import('./login/betriebswahl/betriebswahl/betriebswahl.module').then( m => m.BetriebswahlPageModule)
  },
  {
    path: 'app-datenschutz',
    loadChildren: () => import('./login/app-datenschutz/app-datenschutz/app-datenschutz.module').then( m => m.AppDatenschutzPageModule)
  },
  {
    path: 'passwort-vergessen',
    loadChildren: () => import('./login/passwort-vergessen/passwort-vergessen/passwort-vergessen.module').then( m => m.PasswortVergessenPageModule)
  },
  {
    path: 'cal-modal',
    loadChildren: () => import('./pages/cal-modal/cal-modal.module').then( m => m.CalModalPageModule)
  },
  {
    path: 'auslieferungen',
    loadChildren: () => import('./pages/auslieferungen/auslieferungen/auslieferungen.module').then( m => m.AuslieferungenPageModule)
  },
  {
    path: 'auslieferer-map',
    loadChildren: () => import('./pages/auslieferungen/auslieferungen/auslieferer-map/auslieferer-map.module').then( m => m.AusliefererMapPageModule)
  },
  {
    path: 'overview',
    loadChildren: () => import('./pages/auslieferungen/overview/overview.module').then( m => m.OverviewPageModule)
  },
  {
    path: 'overview-map',
    loadChildren: () => import('./pages/auslieferungen/overview-map/overview-map.module').then( m => m.OverviewMapPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
