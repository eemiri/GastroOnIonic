import { Component, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LanguageService } from 'src/app/services/language.service';
 
@Component({
  selector: 'app-cal-modal',
  templateUrl: './cal-modal.page.html',
  styleUrls: ['./cal-modal.page.scss'],
})
export class CalModalPage implements AfterViewInit {
  calendar = {
    mode: 'month',
    currentDate: new Date(),
    locale: undefined
  };
  viewTitle: string;
  
  event = {
    title: '',
    desc: '',
    startTime: null,
    endTime: null,
    allDay: false,
    employee: ''
  };

  private lng: string;

  minDate = new Date().toISOString();
 
  modalReady = false;
 
  constructor(private modalCtrl: ModalController, private language: LanguageService
    ) { }
 
  ngAfterViewInit() {
    setTimeout(() => {
      this.modalReady = true;      
    }, 0);
    this.language.getCurrentLanguage().then((data) =>{
      this.lng = data;
      this.calendar.locale = this.lng;
    });
  }
  resetEvent() {
    this.event = {
      title: '',
      desc: '',
      startTime: null,
      endTime: null,
      allDay: false,
      employee: ''
    };
  }
 
  save() {       
    this.modalCtrl.dismiss({event: this.event}); 
    this.resetEvent();   
  }
 
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
 
  onTimeSelected(ev) {    //Im Tut wird gemeint dass das wichtig ist fürs speichern weil man die daten in ein date object transformieren soll
    // this.event.startTime = new Date(ev.selectedTime);
    // this.event.endTime = new Date(ev.selectedTime);
  }
 
  close() {
    this.modalCtrl.dismiss();
  }
}