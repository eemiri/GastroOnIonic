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
  totalTurnover: number; 
  totalTrips: number;
  totalStops: number;

  constructor(public lieferungen: AuslieferungenService, public modalCtrl: ModalController) { }
  

  ngOnInit() {
    this.totalStops = 0;
    this.totalTurnover = 0;
    this.drivenRoutes = this.lieferungen.drivenRoutes;
    for (var i = 0; i<this.drivenRoutes.length; i++){
      this.timeStamps.push(this.drivenRoutes[i][0]);
      this.totalStops = this.totalStops + this.drivenRoutes[i].length-1;
      
      for(var j = 1; j<this.drivenRoutes[i].length; j++){
        this.totalTurnover = this.totalTurnover + this.drivenRoutes[i][j].TotalPrice
      }
    }
    this.totalTrips = i;
  }

  async openMapModal(i){
    const mapModal = await this.modalCtrl.create({
      component: OverviewMapPage,
      componentProps:{
        'drivenList': this.drivenRoutes[i]
      },
      backdropDismiss: false      
    }); 
    console.log(this.drivenRoutes[i]);
    return await mapModal.present();
  }

}
