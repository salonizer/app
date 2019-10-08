import { Component, OnInit } from '@angular/core';
import { PdbFind, PdbCore, console_log, PdbDate } from 'projects/ngx-dnd/pdb/src/public_api';
import { PdbKeys } from 'projects/ngx-dnd/pdb/src/lib/pdb-keys.service';
import { NgxIndexedDB } from 'ngx-indexed-db';
import { convert_hour_to_minutes, json_day, delay, dateToString, addDays } from './calendar-functions';
import { AddEventClass } from './calendar-class';
import { FormGroup, FormControl } from '@angular/forms';
import {map, startWith} from 'rxjs/operators';

import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import { Observable } from 'rxjs';


export let openHours: any;
export let intervalTime: number;
export let calendarStartTime: number;
export let calendarStopTime: number;


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  dayString: string ;
  dayJson: any[];
  calendarData: any[];
  clientList: any;
  servicesList: any;
  index: any;

  addEventForm = new FormGroup({
    customer: new FormControl(''),
    service: new FormControl(''),
    start: new FormControl(''),
    nextevent: new FormControl(''),
    status: new FormControl(''),
    color: new FormControl(''),
    date: new FormControl(''),
    });

  constructor(
    private pdbcore: PdbCore,
    private pdbkeys: PdbKeys,
    private pdbdate: PdbDate
  ) { }

  async ngOnInit() {
    {

      const startDate = new Date();

      openHours = await this.pdbkeys.get_doc_data('settings', 'open_hours_weekly');
      const calendarSettings: any = await this.pdbkeys.get_doc_data('settings', 'calendar_settings');
      intervalTime = calendarSettings.intervals;
      calendarStartTime = openHours_get_min(openHours);
      calendarStopTime = openHours_get_max(openHours);


      this.clientList = await this.pdbcore.get_docs_by_type('customers');
      this.servicesList = await this.pdbcore.get_docs_data_by_type('services');

      await console.log('CLIENT LIST DATA: ', this.clientList.docs);
      await console.log('SERVICES LIST DATA: ', this.servicesList);


      const numberDaysDisplayed: number = 14;
      // const openHours: any = openHoursWeekly.mo;

      // this.calendarData = await json_day(openHours, this.dayEvents, intervalTime);
      this.calendarData = await this.jsonDaysRange(startDate, numberDaysDisplayed);



      await console.log('CALENDAR DATA: ', this.calendarData);

    }
  } // end function ngOnInit();


  async openModal() {
    document.getElementById('addEventModal').classList.add('showModal');
  } // end function openModal();


  onCencel() {
    // this.refresh();
    this.closeModal();
  }


  closeModal() {
    document.getElementById('addEventModal').classList.remove('showModal');
  }


  async refresh() {
    this.addEventForm.patchValue({date: '', start: '', customer: ''});
    await delay(0);
    this.ngOnInit();
  }


  async onEmptyEventClick(index) {
    // this.addEventForm = new AddEventClass();
    await this.openModal();
    await this.addEventForm.patchValue({date: index.date, start: index.start, status: 'normal'});
    this.index = index;
    console.log(index);
  } // end function onEmptyEventClick()


  async onSubmit() { /// ZROBIC FUNKCJE KTORA SUMUJE WSZYSTKIE CZASY SERVICEOW - gotowa
    console.log("SUBMIT CLICK", this.addEventForm.value);
    console.log("SUBMIT CLICK INDEX VALUE", this.index);
  
    let length = await sum_services_time(this.addEventForm.value.service);
    console.log('onSubmit next event: ', this.addEventForm.value.nextevent);
    if ( this.addEventForm.value.customer.length < 1) {
      alert('Wprowadź imie i nazwisko klienta');
    }else if ( this.addEventForm.value.service.length < 1) {
      alert('Wprowadź przynajmniej jedną usługę');
    } else if (length + this.addEventForm.value.start > this.index.nextevent) {
      if (confirm('Łączny czas wybranych zabiegów jest dłóższy niż czas potrzebny na ich wykonanie, czy na pewno dodać?')) {
        length = this.index.nextevent - this.addEventForm.value.start ;
        await this.addEventForm.patchValue({status: 'time_out'});
        console.log(length);
        // return;
      this.save_event(length);
    }} else {
      this.save_event(length);
    }
  } // end function onSubmit();

  async save_event(length) {
    const dataToDB = {
      clientId: this.addEventForm.value.customer._id,
      date: this.addEventForm.value.date,
      start: this.addEventForm.value.start,
      length: length,
      status: this.addEventForm.value.status,
      color: this.addEventForm.value.color,
      service: this.addEventForm.value.service
      };
    this.pdbdate.put('calendar_events', null, this.addEventForm.value.date, dataToDB);
    this.closeModal();
    this.refresh();
  } // end function save_event();


  async jsonDaysRange (startDate: Date, daysNumber: number) {
    let jsonDays = new Array;
    let jsonDay: any;
    // const stringDate: string = '2019-03-15';
    let dayDate: string = await dateToString(startDate);
    for (let i: number = 0; i < daysNumber; i++) {
      let dayEvents = new Array();
      dayEvents = await this.pdbdate.get_docs_data_by_date('calendar_events', dayDate); 
      // await console.log('DayEvents: ',dayEvents);
      // return;
      await dayEvents.sort((a, b) => a.start - b.start);
      await delay(0);
      jsonDay = await json_day(openHours, dayDate, dayEvents, intervalTime, calendarStartTime, calendarStopTime);
      jsonDays.push(jsonDay);
      // console.log('DayCounter: ', i);
      dayDate = await dateToString(addDays(startDate, 1));
    }
    return jsonDays;
} // end function jsonDaysRange



} // end class CalendarComponent;



function sum_services_time(services): number {
  let sum: number = 0;
  for(let index of services){
    // console.log('sum_services_time FUNCTION: ', index);
    sum = sum + index.time;
  }
  return sum
}

function openHours_get_min(openHours: any): number {
  // console.log('openHours_get_min function ALL: ', openHours);
  let min: number = 1440;
  for (var _i = 0; _i < 7; _i++) {
    const data: number = convert_hour_to_minutes(openHours[_i].openFrom);
    if ( data < min ) {
      min = data;
    }
  }
  // console.log('openHours_get_min RETURN: ', min);
  return min;
}

function openHours_get_max(openHours: any): number {
  // console.log('openHours_get_min function ALL: ', openHours);
  let max: number = 0;
  for (var _i = 0; _i < 7; _i++) {
    const data: number = convert_hour_to_minutes(openHours[_i].openTo);
    if ( data > max ) {
      max = data;
    }
  }
  // console.log('openHours_get_max RETURN: ', max);
  return max;
}