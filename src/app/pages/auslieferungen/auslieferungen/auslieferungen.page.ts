import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { AlertController, ModalController } from '@ionic/angular';
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
    {PreorderID:1, Status: 3, TotalPrice: 10.99, DeliveryAddressData: 'Riegelsbergerstraße 45, 66113 Saarbrücken', CustomerData: 'Günther Jauch', CustomerMessage: '1riegelsberger millionär'},
    {PreorderID:2, Status: 2, TotalPrice: 8.55, DeliveryAddressData: 'Saargemünderstraße 45, 66271 Kleinblittersdorf', CustomerData: 'Alexander Marcus', CustomerMessage: '2saargemünder yeah boiii'},
    {PreorderID:3, Status: 3, TotalPrice: 23.34, DeliveryAddressData: 'Jenneweg 12, 66113 Saarbrücken', CustomerData: 'babaji', CustomerMessage: '3jenne besser oben als unten'},
    {PreorderID:3, Status: 3, TotalPrice: 23.34, DeliveryAddressData: 'Malstatterstraße 1, 66117 Saarbrücken', CustomerData: 'maalstatt', CustomerMessage: 'peace'},
    {PreorderID:3, Status: 2, TotalPrice: 23.34, DeliveryAddressData: 'Mainzerstraße 171, 66121 Saarbrücken', CustomerData: 'mainzer', CustomerMessage: 'hotel, trivago'},
    {PreorderID:3, Status: 2, TotalPrice: 23.34, DeliveryAddressData: 'Europaallee 14, 66113 Saarbrücken', CustomerData: 'Europa', CustomerMessage: 'apo'},
    
    {PreorderID:1, Status: 3, TotalPrice: 10.99, DeliveryAddressData: 'St. Ingberter Str. 46, 66123 Saarbrücken', CustomerData: 'Biggie Smalls', CustomerMessage: 'I love it when they call me big poppa'},
    {PreorderID:2, Status: 3, TotalPrice: 8.55, DeliveryAddressData: 'Neugrabenweg 8, 66123 Saarbrücken', CustomerData: 'Sweet Dee', CustomerMessage: 'Bird'},
    {PreorderID:3, Status: 3, TotalPrice: 23.34, DeliveryAddressData: 'Am Kieselhumes 4, 66121 Saarbrücken', CustomerData: 'MR Bombastik', CustomerMessage: 'Nippel aus Plastik'},
    {PreorderID:3, Status: 3, TotalPrice: 23.34, DeliveryAddressData: 'Egon-Reinert Straße 1, 66111 Saarbrücken', CustomerData: 'EGON', CustomerMessage: '3 ist die Zahl'},
    {PreorderID:3, Status: 3, TotalPrice: 23.34, DeliveryAddressData: 'Dudweilerstraße 71, 66123 Saarbrücken', CustomerData: 'dudi', CustomerMessage: 'bubi'},
    {PreorderID:3, Status: 3, TotalPrice: 23.34, DeliveryAddressData: 'Schloßstraße 50, 66117 Saarbrücken', CustomerData: 'Schlossi', CustomerMessage: 'bossi'}
  ];
  claimedList: any = [];
  //drivenRoutes = new Array<Array<any>>();
  
  constructor(private lieferungen: AuslieferungenService, public modalCtrl: ModalController, public alertController: AlertController) { }

  ngOnInit() {
    //this.getPreOrderList();
    this.sortPreorders();
  }

  sortPreorders(){//Setzt die fertigen Preorders nach oben in der Liste
    this.preorderList.sort((a, b) => a.Status < b.Status ? 1 : a.Status > b.Status ? -1 : 0);
  }
    
  async getPreOrderList(){//kriegt alle bestellungen, periodisch refreshen,
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
      this.preOrderIds.push(preorder.PreorderID)//erstelle hier eine liste von allen perorderID's
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

  savePreOrderStatus(order, status) {
    this.lieferungen
      .savePreOrderStatus(order.PreorderID, status)
      .subscribe(response => {
        this.getPreOrderList();
      });
  } 

  claimPreorder(preorder){
    if(preorder.Status === 3){
      this.claimedList.push(preorder);
      this.preorderList = this.preorderList.filter(obj => obj !== preorder)
    }    
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
    if(!this.claimedList.length){
      const alert = await this.alertController.create({
        header: 'Keine Bestellung angenommen',
        subHeader: 'Es müssen erst Bestellungen angenommen werden bevor die Fahrt beginnen kann',
        //message: 'This is an alert message.',
        buttons: ['OK']
       });
       await alert.present();
  }else{   
     const mapModal = await this.modalCtrl.create({
      component: AusliefererMapPage,
      componentProps:{
        'liste': this.claimedList
      },
      backdropDismiss: false
    });  
  this.claimedList=[];   

  mapModal.onDidDismiss().then((dataReturned)=>{
    if(dataReturned !== null){      
      this.claimedList = dataReturned['data'];      
    }
    if(this.claimedList.some(e => e.Status === 5)){
      this.claimedList.unshift(new Date().toLocaleTimeString());
      this.lieferungen.drivenRoutes.push(this.claimedList);
      this.claimedList = []
      console.log(this.lieferungen.drivenRoutes);
      //this.lieferungen.numOfRoutes.push("")
    }
  });

  return await mapModal.present();
    }
  }

  // receiveList($event){
  //   this.claimedList = $event;
  // }

  
}
