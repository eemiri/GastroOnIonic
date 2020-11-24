import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuslieferungenService } from 'src/app/services/auslieferungen.service';
import { AusliefererMapPage } from '../auslieferungen/auslieferer-map/auslieferer-map.page';
import { OverviewMapPage } from '../overview-map/overview-map.page';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage implements OnInit {
  drivenRoutes: any;
  timeStamps = [];

  constructor(public lieferungen: AuslieferungenService, public modalCtrl: ModalController) { }
  

  ngOnInit() {
    this.drivenRoutes = this.lieferungen.drivenRoutes;
    for (var i = 0; i<this.drivenRoutes.length; i++){
      this.timeStamps.push(this.drivenRoutes[i][0]);
    }
    console.log(this.timeStamps);
  }

  async openMapModal(i){
    const mapModal = await this.modalCtrl.create({
      component: OverviewMapPage,
      componentProps:{
        'drivenList': this.drivenRoutes[i].shift()
      },
      backdropDismiss: false      
    }); 
    debugger;
    console.log(this.drivenRoutes[i]);
    return await mapModal.present();
  }
}
