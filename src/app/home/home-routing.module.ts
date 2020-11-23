import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children:[
      // { path: 'auslieferer-map',
      //   loadChildren: '/pages/auslieferungen/auslieferungen/auslieferer-map/auslieferer-map.module#AusliefererMapPageRoutingModule'
      // },
      { path: 'auslieferungen',
        loadChildren: '/pages/auslieferungen/auslieferungen/auslieferungen.module#AuslieferungenPageModule'        
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
