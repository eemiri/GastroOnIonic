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
import { PasswortVergessenPage } from '../passwort-vergessen/passwort-vergessen/passwort-vergessen.page';
import { DeviceInformation } from 'src/app/model/deviceInformation.model';
import { UserData } from 'src/app/model/user-data';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;

  loginObj: UserData;
  deviceInformation: DeviceInformation;
  betrieb: string = "";
  betriebId: number = -1;
  benutzername: string = "";
  passwort: string = "";
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
    this.credentials = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      privacy: ['', Validators.required]//vielleicht muss hier checked statt true
    });
  }
 
  async login() {
    

    this.loginObj = new UserData(
      this.benutzername,
      this.betriebId,
      this.passwort,
      this.betrieb,
      this.deviceInformation.Uuid,
      this.deviceInformation.DeviceToken,
      this.deviceInformation.Platform
    );
    
    const loading = await this.loadingController.create();
    await loading.present();


    if(this.credentials.valid){
      this.authService.login(this.loginObj).subscribe(//gewechselt von credentials zu loginobj
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
  }
 
  //Easy access for form fields
  get email() {
    return this.credentials.get('username');
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
    });    
    betriebeModal.onDidDismiss().then((ergebnisBetrieb) => {
      if (ergebnisBetrieb != null) {
        this.betrieb = ergebnisBetrieb.data.Betriebsname;
        this.betriebId = ergebnisBetrieb.data.Id;
      }
    });   
    return await betriebeModal.present();             
  }

  async openDataSecurityTextModal() {{
    //if (!isDevMode()) {
      const modal = await this.modalController.create({
        component: AppDatenschutzPage,
        componentProps:{
          accepted : this.dataSecurityAccepted
        }        
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
   // } else {
      //this.dataSecurityAccepted = true; //nicht sicher ob ich das hier auskommentiert lassen kann, im büro testen
    }
  }

  async openResetPasswordModal() {    
    const passwortVergessenModal = await this.modalController.create({
      component: PasswortVergessenPage,
      componentProps:{
        benutzername: this.benutzername,
        betrieb: this.betrieb,
        betriebId: this.betriebId
      }
    }); 
    
    passwortVergessenModal.present();
  }




}

