import { formatDate } from '@angular/common';
import { Inject, Injectable, LOCALE_ID, ViewChild } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { CalendarComponent } from 'ionic2-calendar';
import { CalModalPage } from '../pages/cal-modal/cal-modal.page';

@Injectable({
  providedIn: 'root'
})
export class CalendarproviderService {
  eventSource = [];
  viewTitle: string;

  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };

  @ViewChild(CalendarComponent) myCal: CalendarComponent;
  
  constructor(private modalCtrl: ModalController,private alertCtrl: AlertController, @Inject(LOCALE_ID) private locale: string) { }

  //calender
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
    buttons: ['OK'],
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
  this.eventSource = events;//hier noch die src der events anpassen, API? Also nicht bei random events aber wenn man welche selbst einfügen will
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
