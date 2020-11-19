import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { UserData } from 'src/app/model/user-data';
import { AuslieferungenService } from 'src/app/services/auslieferungen.service';



@Component({
  selector: 'app-auslieferungen',
  templateUrl: './auslieferungen.page.html',
  styleUrls: ['./auslieferungen.page.scss'],
})
export class AuslieferungenPage implements OnInit {
  preorderList: any;
  preOrderIds: Array<number>
  userdata: UserData

  constructor(private lieferungen: AuslieferungenService) { }

  ngOnInit() {
  }

  

  //hier die preorders einem fahrer zuordnen und anschließend die information der einzelnen preorders(name des kunden etc) im infowindow auf der karte abbilden
}
