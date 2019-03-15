import { Component, OnInit } from '@angular/core';
import { PdbFind } from 'projects/ngx-dnd/pdb/src/public_api';
import { PdbKeys } from 'projects/ngx-dnd/pdb/src/lib/pdb-keys.service';
import { NgxIndexedDB } from 'ngx-indexed-db';
import { convert_hour_to_minutes, json_day } from './calendar-functions';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  dayString: string ;
  dayJson: any[];


  constructor(
    private pdbfind: PdbFind,
    private pdbkeys: PdbKeys
  ) { }

  async ngOnInit() {
    {
      const openHoursWeekly: any = await this.pdbkeys.get_doc_data('settings', 'open_hours_weekly');
      const calendarSettings: any = await this.pdbkeys.get_doc_data('settings', 'calendar_settings');
      const intervalTime: number = calendarSettings.intervals;
      const day: any = openHoursWeekly.mo;
      this.dayJson = await json_day(day, intervalTime);
    }


  } // end: ngOnInit();
} // end class CalendarComponent;








////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // indexedDB.deleteDatabase('myDb');

    // const db = new NgxIndexedDB('pdb_index', 1);

    // const nazwaindexu = 'nazwaBazy';

    // await db.openDatabase(1, evt => {
    //   const objectStore = evt.currentTarget.result.createObjectStore(nazwaindexu, { keyPath: 'id', autoIncrement: true });
    //   objectStore.createIndex('name', 'name', { unique: false });
    //   objectStore.createIndex('email', 'email', { unique: false });
    //   objectStore.createIndex('dane', 'dane', { unique: false });
    // });

    // await db.clear(nazwaindexu);


    // await db.add(nazwaindexu, { name: 'mirek', email: 'email@mirek.pl', dane: 'jakieś dane json' });
    // await db.add(nazwaindexu, { name: 'mirek2', email: 'email@mirek.pl', dane: 'jakieś dane json2' });
    // await db.add(nazwaindexu, { name: 'mirek3', email: 'email@mirek.pl', dane: 'jakieś dane json3' }).then(
    //   () => {
    //       console.log("Jest DObRAZE");
    //   },
    //   error => {
    //       console.log('INDEX JUZ ISTNIEJE', error);
    //   }
    // );



    // db.getByIndex(nazwaindexu, 'email', 'email@mirek.pl').then(
    //   result => {
    //       console.log(result);
    //   },
    //   error => {
    //       console.log(error);
    //   }
    // );