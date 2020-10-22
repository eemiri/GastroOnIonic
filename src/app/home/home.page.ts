import { Component, Inject, LOCALE_ID, NgZone, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from './../services/authentication.service';
import { Router } from '@angular/router';
import { LanguagePopoverPage } from '../pages/language-popover/language-popover.page';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { CalendarComponent } from 'ionic2-calendar';
import { formatDate } from '@angular/common';
import { CalModalPage } from '../pages/cal-modal/cal-modal.page';

import { LanguageService } from '../services/language.service';
import { BetriebswahlPage } from '../login/betriebswahl/betriebswahl/betriebswahl.page';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  
 
  private lng: string;
  viewTitle: string;

  params = {
    name: "Guenther"
  };
  
 
  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  constructor(
    private authService: AuthenticationService, 
    private router: Router, 
    private popoverCtrl: PopoverController, 
    private alertCtrl: AlertController, 
    private translate: TranslateService,
    private modalCtrl: ModalController,
    @Inject(LOCALE_ID) private locale: string,
    private language: LanguageService
    ) {}

    ngOnInit(){
      this.loading = true;
      this.language.getCurrentLanguage().then((data) =>{
        this.lng = data;
        this.calendar.locale = this.lng;
        this.loading = false;
      });
    }
  
  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  async showAlert(){
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('ALERT.header'),
      message: this.translate.instant('ALERT.msg'),
      buttons:['OK']
    });
    alert.present();
  }

async openLanguagePopover(ev){
  const popover = await this.popoverCtrl.create({
    component: LanguagePopoverPage,
    event: ev
  });  
   popover.onDidDismiss().then(dummy => { // changes the calendarlanguage when the lanuagepopup was dismissed, the calendar is slow on registering, that's why the timeout is there
    this.loading = true;
    this.language.getCurrentLanguage().then((data) =>{
      this.lng = data;
      this.calendar.locale = this.lng;
      setTimeout(() =>{
        this.loading = false;
      },500);
      
    });
   });  	
  await popover.present();
}


betrieb: string = "";
  betriebId: number = -1;

async openBetriebeModal() {
  
    
  const betriebeModal = await this.modalCtrl.create({
    component: BetriebswahlPage
    //cssClass: this.helperService.getModalOpts()
  });
  
  // const {data} = await betriebeModal.onDidDismiss();
  // this.betrieb = data.Betriebsname;
  // this.betriebId = data.Id;
 
   betriebeModal.present();

  //  betriebeModal.onDidDismiss().then((ergebnisBetrieb) => {
  //   if (ergebnisBetrieb != null) {
  //     this.betrieb = ergebnisBetrieb.Betriebsname;
  //     this.betriebId = ergebnisBetrieb.Id;
  //   }
  // });
}

  

//calender
eventSource = [];
loading: boolean = false;
  calendar = {
    mode: 'month',
    currentDate: new Date(),
    locale: undefined  
  };
// Change current month/week/day
next() {
  this.myCal.slideNext();
}

back() {
  this.myCal.slidePrev();
}

// Selected date reange and hence title changed
onViewTitleChanged(title) {
  this.viewTitle = title;
}

// Calendar event was clicked
async onEventSelected(event) {
  // Use Angular date pipe for conversion
  let start = formatDate(event.startTime, 'medium', this.locale);
  let end = formatDate(event.endTime, 'medium', this.locale);

  const alert = await this.alertCtrl.create({
    header: event.title,
    subHeader: event.desc,
    message: 'From: ' + start + '<br><br>To: ' + end,
    buttons: ['Delete','OK'],
  });
  alert.present();
}

createRandomEvents() {
  var events = [];
  for (var i = 0; i < 50; i += 1) {
    var date = new Date();
    var eventType = Math.floor(Math.random() * 2);
    var startDay = Math.floor(Math.random() * 90) - 45;
    var endDay = Math.floor(Math.random() * 2) + startDay;
    var startTime;
    var endTime;
    if (eventType === 0) {
      startTime = new Date(
        Date.UTC(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() + startDay
        )
      );
      if (endDay === startDay) {
        endDay += 1;
      }
      endTime = new Date(
        Date.UTC(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() + endDay
        )
      );
      events.push({
        title: 'All Day - ' + i,
        startTime: startTime,
        endTime: endTime,
        allDay: true,
      });
    } else {
      var startMinute = Math.floor(Math.random() * 24 * 60);
      var endMinute = Math.floor(Math.random() * 180) + startMinute;
      startTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + startDay,
        0,
        date.getMinutes() + startMinute
      );
      endTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + endDay,
        0,
        date.getMinutes() + endMinute
      );
      events.push({//Object that is pushed
        title: 'Event - ' + i,
        startTime: startTime,
        endTime: endTime,
        allDay: false,
      });
    }
  }
  this.eventSource = events;//hier noch die src der events anpassen, API? Also nicht beim random dann
}

removeEvents() {
  this.eventSource = [];
}

//adding events
async openCalModal() {
  const modal = await this.modalCtrl.create({
    component: CalModalPage,
    cssClass: 'cal-modal',
    backdropDismiss: false
  });
 
  await modal.present();
 
  modal.onDidDismiss().then((result) => {
    debugger;
    if (result.data && result.data.event) {      
      let event = result.data.event;
      if (event.allDay) {//hier anpassen wenn man spezifische uhrzeiten will, bzw untendrunter die stunden und minuten noch eingeben
        let start = event.startTime;
        event.startTime = new Date(
          Date.UTC(            
            start.getUTCFullYear(),
            start.getUTCMonth(),
            start.getUTCDate()            
          )
        );
        event.endTime = new Date(
          Date.UTC(
            start.getUTCFullYear(),
            start.getUTCMonth(),
            start.getUTCDate() + 1
          )
        );
      }
      this.eventSource.push(result.data.event);
      this.myCal.loadEvents();      
    }
  });
}



}
