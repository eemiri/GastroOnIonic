import { Component, Input, isDevMode, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavController, NavParams } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-app-datenschutz',
  templateUrl: './app-datenschutz.page.html',
  styleUrls: ['./app-datenschutz.page.scss'],
})
export class AppDatenschutzPage implements OnInit {
  @Input() accepted: boolean;

  public loading: boolean = false;

  public dataSecurityText: string;

  scrollDepthTriggered: boolean = false;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loginService: LoginService,
    private modalCtrl: ModalController,
    private loadingController: LoadingController
  ) {
    navParams.get('accepted');
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getDataSecurtityText();
  }

  async getDataSecurtityText() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.loginService.getDataSecurityText().subscribe(
      async (resp) => {
        this.dataSecurityText = resp;
        await loading.dismiss();
      },      
    );
  }

  dismiss(bool: boolean) {
    this.modalCtrl.dismiss(bool);
  }

//see if user has scrolled down to the button
async CheckScroll(event: any){
  if(this.scrollDepthTriggered) {
    return;
  }
  if(event.target.localName != "ion-content") {
    // not sure if this is required, just playing it safe
    return;
  }
  const scrollElement = await event.target.getScrollElement();

  // minus clientHeight because trigger is scrollTop
  // otherwise you hit the bottom of the page before 
  // the top screen can get to 80% total document height
  const scrollHeight = scrollElement.scrollHeight - scrollElement.clientHeight;

  const currentScrollDepth = event.detail.scrollTop;

  const targetPercent = 99;
  let triggerDepth = ((scrollHeight / 100) * targetPercent);

  if(currentScrollDepth > triggerDepth) {
    
    // this ensures that the event only triggers once
    this.scrollDepthTriggered = true;
    // do your analytics tracking here
  }
}
}
