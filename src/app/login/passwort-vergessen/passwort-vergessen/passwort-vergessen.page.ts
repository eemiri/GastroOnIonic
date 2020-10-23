import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from '@ionic/angular';
import { Betrieb } from 'src/app/model/betrieb.model';
import { BenutzerService } from 'src/app/services/benutzer.service';
import { HelperService } from 'src/app/services/helper.service';
import { LanguageService } from 'src/app/services/language.service';
import { BetriebswahlPage } from '../../betriebswahl/betriebswahl/betriebswahl.page';

@Component({
  selector: 'app-passwort-vergessen',
  templateUrl: './passwort-vergessen.page.html',
  styleUrls: ['./passwort-vergessen.page.scss'],
})
export class PasswortVergessenPage implements OnInit {
  private email: string = "";
  public loading: boolean = false;

  public benutzername: string = "";
  public betrieb: string = "";
  public betriebId: number = -1;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private benutzerService: BenutzerService,
    private helperService: HelperService,
    private language: LanguageService,
    private loadingController: LoadingController) { }

  ngOnInit() {
  }
  ionViewDidLoad() {
    this.benutzername = this.navParams.get("benutzername");
    this.betrieb = this.navParams.get("betrieb");
    this.betriebId = this.navParams.get("betriebId");
  }

  ionViewWillEnter() {
    this.language.getLangForString("PLEASE SELECT COMPANY").then(data => {
      this.betrieb = data;
    });
  }

  validateEmail(email: string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  async resetPassword() {
    const loading = await this.loadingController.create();
    await loading.present();
    if (this.email != "" && this.validateEmail(this.email)) {
      this.benutzerService
        .requestPassword(this.email, this.benutzername, this.betriebId)
        .subscribe(async (response) => {
          if (response.Erfolg) {
            this.closeModal();
          } else {
            this.helperService.showBottomToast(response.Message);
          }
          await loading.dismiss();
        });
    } else {
      this.helperService.showBottomToast("EMAIL_NOT_VALID");
    }
  }

  async openBetriebeModal() {    
    const betriebeModal = await this.modalCtrl.create({
      component: BetriebswahlPage
    });    
    betriebeModal.onDidDismiss().then((ergebnisBetrieb) => {
      if (ergebnisBetrieb != null) {
        this.betrieb = ergebnisBetrieb.data.Betriebsname;
        this.betriebId = ergebnisBetrieb.data.Id;
      }
    });   
    return await betriebeModal.present();             
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
