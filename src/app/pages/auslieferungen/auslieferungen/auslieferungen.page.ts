import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { UserData } from 'src/app/model/user-data';
import { AuslieferungenService } from 'src/app/services/auslieferungen.service';
import { AusliefererMapPage } from './auslieferer-map/auslieferer-map.page';
const { Storage } = Plugins;



@Component({
  selector: 'app-auslieferungen',
  templateUrl: './auslieferungen.page.html',
  styleUrls: ['./auslieferungen.page.scss'],
})
export class AuslieferungenPage implements OnInit {
  preOrderIds: Array<number>
  userdata: UserData
  preorderList:any =[
    {PreorderID:1, Status: 4, TotalPrice: 10.99, DeliveryAddressData: 'Riegelsbergerstraße 45, 66113 Saarbrücken', CustomerData: 'Günther Jauch', CustomerMessage: '1riegelsberger millionär'},
    {PreorderID:2, Status: 4, TotalPrice: 8.55, DeliveryAddressData: 'Saargemünderstraße 45, 66271 Kleinblittersdorf', CustomerData: 'Alexander Marcus', CustomerMessage: '2saargemünder yeah boiii'},
    {PreorderID:3, Status: 4, TotalPrice: 23.34, DeliveryAddressData: 'Jenneweg 12, 66113 Saarbrücken', CustomerData: 'babaji', CustomerMessage: '3jenne besser oben als unten'},
    {PreorderID:3, Status: 4, TotalPrice: 23.34, DeliveryAddressData: 'Malstatterstraße 1, 66117 Saarbrücken', CustomerData: 'maalstatt', CustomerMessage: 'peace'},
    {PreorderID:3, Status: 4, TotalPrice: 23.34, DeliveryAddressData: 'Mainzerstraße 171, 66121 Saarbrücken', CustomerData: 'mainzer', CustomerMessage: 'hotel, trivago'},
    {PreorderID:3, Status: 4, TotalPrice: 23.34, DeliveryAddressData: 'Europaallee 14, 66113 Saarbrücken', CustomerData: 'Europa', CustomerMessage: 'apo'}
  ];
  claimedList: any = [];
  
  constructor(private lieferungen: AuslieferungenService, public modalCtrl: ModalController) { }

  ngOnInit() {
  }
    
  async getPreOrderList(){//kriegt alle bestellungen, periodisch refreshen
    const ret = await Storage.get({ key: 'BetriebsID' });    
    const id = JSON.parse(ret.value);
    setTimeout(() =>{//noch einen Fall einbauen wo der call nicht funktioniert
      this.lieferungen.getPreOrders(id).subscribe( (res) =>{
        this.preorderList = [];
        this.preorderList = JSON.parse(res.Data)
    });
    }, 10000);
  }

  setPreorderToDriver(status: number){
    this.preOrderIds = [];
    for(const preorder of this.preorderList){
      this.preOrderIds.push(preorder.PreorderID)
    }
    this.lieferungen.setPreOrderToUser(this.preOrderIds, this.userdata.benutzer_id, status).subscribe(responseData => {
      this.preorderList.splice(
        this.preorderList.findIndex(
          order => order.PreorderID == responseData.Data.PreorderID
        ),
        1,
        responseData.Data
      );
      //this.claimedList.push(responseData.Data);
    });
  }

  claimPreorder(preorder){
    this.claimedList.push(preorder);
    this.preorderList = this.preorderList.filter(obj => obj !== preorder)
  }

  resetClaimedPreorder(claimed){
    this.preorderList.push(claimed);
    this.claimedList = this.claimedList.filter(obj => obj !== claimed)
  }

  // openMapModal(ClaimedList){
  //   //Ondiddismiss unterscheiden ob abbruch oder fahrt beendet
  //     //Wenn beendet die claimedList leeren / Speichern für den Overview
  // }

  async openMapModal(){
    const mapModal = await this.modalCtrl.create({
      component: AusliefererMapPage,
      componentProps:{
        'liste': this.preorderList
      }
    });
    this.preorderList=[];   

    mapModal.onDidDismiss().then((dataReturned)=>{
      if(dataReturned !== null){
        this.claimedList = dataReturned['data'];
      }
    });

    return await mapModal.present();
  }

  // receiveList($event){
  //   this.claimedList = $event;
  // }

  
}
