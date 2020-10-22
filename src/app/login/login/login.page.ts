import { AuthenticationService } from './../../services/authentication.service';
import { Component, isDevMode, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Betrieb } from 'src/app/model/betrieb.model';
import { BetriebswahlPage } from '../betriebswahl/betriebswahl/betriebswahl.page';
import { LanguagePopoverPage } from 'src/app/pages/language-popover/language-popover.page';
import { HelperService } from 'src/app/services/helper.service';
import { AppDatenschutzPage } from '../app-datenschutz/app-datenschutz/app-datenschutz.page';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;

  betrieb: string = "";
  betriebId: number = -1;

  dataSecurityAccepted: boolean = false;

 
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private popoverCtrl: PopoverController,
    private helperService: HelperService
  ) {}
 
  ngOnInit() {
    this.credentials = this.fb.group({//placeholdervalues, if changed it doesn't work
      email: ['eve.holt@reqres.in', [Validators.required, Validators.email]],
      password: ['cityslicka', [Validators.required, Validators.minLength(6)]],
    });
  }
 
  async login() {
    const loading = await this.loadingController.create();
    await loading.present();
    
    this.authService.login(this.credentials.value).subscribe(
      async (res) => {
        await loading.dismiss();        
        this.router.navigateByUrl('/home', { replaceUrl: true });
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: res.error.error,
          buttons: ['OK'],
        });
 
        await alert.present();
      }
    );
  }
 
  // Easy access for form fields
  get email() {
    return this.credentials.get('email');
  }
  
  get password() {
    return this.credentials.get('password');
  }

  async openLanguagePopover(ev){
    const popover = await this.popoverCtrl.create({
      component: LanguagePopoverPage,
      event: ev
    });
    await popover.present();
  }


  async openBetriebeModal() {
    
    const betriebeModal = await this.modalController.create({
      component: BetriebswahlPage
      //cssClass: this.helperService.getModalOpts()
    });
    
    // const {data} = await betriebeModal.onDidDismiss();
    // this.betrieb = data.Betriebsname;
    // this.betriebId = data.Id;
    betriebeModal.onDidDismiss().then((ergebnisBetrieb) => {
      if (ergebnisBetrieb != null) {
        this.betrieb = ergebnisBetrieb.data.Betriebsname;
        this.betriebId = ergebnisBetrieb.data.Id;
      }
    });
   
    return await betriebeModal.present();
//  return this.http.get(this.helperService.getUrl("GetBetriebeStartsWith")).pipe(map((betriebe: Array<Betrieb>) =>{
//       return betriebe.map((betrieb) => new Betrieb(betrieb.Id, betrieb.Betriebsname, betrieb.Strasse, betrieb.Ort, betrieb.ShowDivider));
//     }));
             
  }

  async openDataSecurityTextModal() {
    if (isDevMode()) {
      const modal = await this.modalController.create({
        component: AppDatenschutzPage,        
        //cssClass: this.helperService.getModalOpts()
      });

      // const {data} = await modal.onDidDismiss();
      // this.dataSecurityAccepted = data;    
      modal.onDidDismiss().then((confirmed) => {
        if (confirmed != null){
          this.dataSecurityAccepted = confirmed.data;
        }
      });    
      
      modal.present();
    } else {
      this.dataSecurityAccepted = true;
    }
  }
}