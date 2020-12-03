import { EventEmitter, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-fahrer-kommentar',
  templateUrl: './fahrer-kommentar.page.html',
  styleUrls: ['./fahrer-kommentar.page.scss'],
})

export class FahrerKommentarPage implements OnInit {
  waypoint = this.navParams.get("waypoint");
  kommentar: string = "";

  @Output() preListEvent = new EventEmitter();
  constructor(private navParams: NavParams, private modalCtrl: ModalController) { }
  

  ngOnInit() {
  }

  speichern(){
    const ret = {address:this.waypoint, comment:this.kommentar};//das kommentar wird in seine chars gesplitted
    this.preListEvent.emit(ret);
    this.modalCtrl.dismiss(ret);
  }

  abbruch(){
    this.modalCtrl.dismiss();
  }

}
