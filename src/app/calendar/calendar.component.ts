import { Component, OnInit } from '@angular/core';
import { PdbFind, PdbCore, console_log, PdbDate } from 'projects/ngx-dnd/pdb/src/public_api';
import { PdbKeys } from 'projects/ngx-dnd/pdb/src/lib/pdb-keys.service';
import { NgxIndexedDB } from 'ngx-indexed-db';
import { convert_hour_to_minutes, json_day, delay } from './calendar-functions';
import { AddEventClass } from './calendar-class';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  dayString: string ;
  dayJson: any[];
  dayEvents: any;

  addEventForm = new FormGroup({
    name: new FormControl(''),
    start: new FormControl(''),
    length: new FormControl(''),
    date: new FormControl('2019-03-15'),
    });

  constructor(
    private pdbcore: PdbCore,
    private pdbfind: PdbFind,
    private pdbkeys: PdbKeys,
    private pdbdate: PdbDate
  ) { }

  async ngOnInit() {
    {
      const openHoursWeekly: any = await this.pdbkeys.get_doc_data('settings', 'open_hours_weekly');
      const calendarSettings: any = await this.pdbkeys.get_doc_data('settings', 'calendar_settings');
      const intervalTime: number = calendarSettings.intervals;
      const openHours: any = openHoursWeekly.mo;
      this.dayEvents = await this.pdbdate.get_docs_data_by_date('calendar_events', '2019-03-15');
      this.dayEvents.sort((a, b) => a.start - b.start);
      await delay(0);
      await console_log('dayEvents :', this.dayEvents);
      this.dayJson = await json_day(openHours, this.dayEvents, intervalTime);

    }
  } // end function ngOnInit();


  async openModal() {
    document.getElementById('addEventModal').classList.add('showModal');
  } // end function openModal();


  onCencel() {
    this.refresh();
    this.closeModal();
  }


  closeModal() {
    document.getElementById('addEventModal').classList.remove('showModal');
  }


  async refresh() {
    // this.fresult = new Array();
    await delay(10);
    // this.ngOnInit();
  }


  async onEmptyEventClick() {
    // this.addEventForm = new AddEventClass();
    await this.openModal();
  } // end function onEmptyEventClick()


  async onSubmit() {
    this.pdbdate.put('calendar_events', null, this.addEventForm.value.date, this.addEventForm.value);
    this.closeModal();
    this.refresh();
  } // end function onSubmit();


} // end class CalendarComponent;
