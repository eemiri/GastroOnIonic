import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-app-datenschutz',
  templateUrl: './app-datenschutz.page.html',
  styleUrls: ['./app-datenschutz.page.scss'],
})
export class AppDatenschutzPage implements OnInit {

  public loading: boolean = false;

  public dataSecurityText: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loginService: LoginService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getDataSecurtityText();
  }

  getDataSecurtityText() {
    this.loading = true;
    this.loginService.getDataSecurityText().subscribe(
      resp => {
        this.dataSecurityText = resp;
        this.loading = false;
      },
      err => {
        //this.viewCtrl.dismiss(true);
      }
    );
  }

  dismiss(bool: boolean) {
    this.modalCtrl.dismiss(bool);
  }
}
