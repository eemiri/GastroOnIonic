import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Betrieb } from 'src/app/model/betrieb.model';
import { HelperService } from 'src/app/services/helper.service';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-betriebswahl',
  templateUrl: './betriebswahl.page.html',
  styleUrls: ['./betriebswahl.page.scss'],
})
export class BetriebswahlPage implements OnInit {

  loading: boolean = false;
  rawBetriebeList: Array<Betrieb> = new Array<Betrieb>();
  betriebeList: Array<Betrieb> = new Array<Betrieb>();

  constructor(
    private modalCtrl: ModalController,
    private helperService: HelperService,
    private loginService: LoginService,
    private loadingController: LoadingController
    ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getBetriebe();
    this.rawBetriebeList.push(new Betrieb(0, "test", "", "", false)); 
    this.prepareDivider();
    this.initList();
  }

  async getBetriebe() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.loginService.getBetriebe().subscribe(
      async(res) =>{
        if (res.Erfolg){
          await loading.dismiss();
          this.rawBetriebeList = res.Data;
          this.prepareDivider();
          this.initList();
        }else{
          await loading.dismiss();
          this.helperService.showBottomToast(res.Message);
        }
        await loading.dismiss();
      }
    )
  }
    // this.loading = true;
    // this.loginService.getBetriebe().subscribe(response => {
    //   if (response.Erfolg) {
    //     this.rawBetriebeList = response.Data;
    //     this.prepareDivider();
    //     this.initList();
    //   } else {
    //     this.helperService.showBottomToast(response.Message);
    //   }
    //   this.loading = false;
    // });


  prepareDivider() {
    let lastChar = "";
    for (let i = 0; i < this.rawBetriebeList.length; i++) {
      const item = this.rawBetriebeList[i];

      const char = item.Betriebsname.charAt(0).toUpperCase();
      if (char != lastChar) {
        this.rawBetriebeList[i].ShowDivider = true;
        lastChar = char;
      }
    }
  }

  initList() {
    this.betriebeList = this.rawBetriebeList;
  }

  searchBetriebe(ev: any) {
    this.initList();

    const val = ev.target.value;

    if (val && val.trim() != "") {
      this.betriebeList = this.betriebeList.filter(betrieb => {
        return (
          betrieb.Betriebsname.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    }
  }

  isLetter(str: string) {
    return str.length === 1 && str.match(/[A-Z]/i);
  }

  async setBetrieb(betrieb: Betrieb) {
   await this.closeModal(betrieb);
  }

  async closeModal(betrieb: Betrieb) {
    await this.modalCtrl.dismiss(betrieb);
  }

}
