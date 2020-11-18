import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { AuslieferungenService } from 'src/app/services/auslieferungen.service';
const { Storage } = Plugins;


@Component({
  selector: 'app-auslieferungen',
  templateUrl: './auslieferungen.page.html',
  styleUrls: ['./auslieferungen.page.scss'],
})
export class AuslieferungenPage implements OnInit {
  preorderList: any;

  constructor(private lieferungen: AuslieferungenService) { }

  ngOnInit() {
  }
  async getPreorders(){//kriegt alle bestellungen, periodisch refreshen
    const ret = await Storage.get({ key: 'BetriebsID' });    
    const id = JSON.parse(ret.value);
    setTimeout(() =>{//noch einen Fall einbauen wo der call nicht funktioniert
      this.lieferungen.getPreOrders(id).subscribe( (res) =>{
        this.preorderList = JSON.parse(res.Data)
    });
    }, 10000);
  }

  //hier die preorders einem fahrer zuordnen und anschließend die information der einzelnen preorders(name des kunden etc) im infowindow auf der karte abbilden
}
