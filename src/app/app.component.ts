import { Component, OnInit } from '@angular/core';
import { PdbInit, PdbCore, PdbFind } from 'projects/ngx-dnd/pdb/src/public_api';

// import PouchDB from 'pouchdb';
// import PouchFind from 'pouchdb-find';
// PouchDB.plugin(PouchFind);



// tslint:disable:max-line-length
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'aplikacja';

  constructor(
    private pdbinit: PdbInit,
    private pdbcore: PdbCore,
    private pdbfind: PdbFind,
  ) {
  }

  ngOnInit() {
    localStorage.setItem('pdb_basename', 'testbazy');
    this.first_run();
    this.pdbinit.set_console_log('true');
  }


  first_run() {
    if (localStorage.getItem('first_run') !== 'false') {
      localStorage.setItem('first_run', 'false');
      this.set_default_openHours();
      this.set_default_calendarSettings();
    }
  }

  set_default_openHours() {
    const openHours = '{"1":{"isOpen":true,"openFrom":"10:00","openTo":"18:00"},"2":{"isOpen":true,"openFrom":"10:00","openTo":"18:00"},"3":{"isOpen":true,"openFrom":"10:00","openTo":"18:00"},"4":{"isOpen":true,"openFrom":"10:00","openTo":"18:00"},"5":{"isOpen":true,"openFrom":"10:00","openTo":"18:00"},"6":{"isOpen":true,"openFrom":"10:00","openTo":"14:00"},"0":{"isOpen":false,"openFrom":"","openTo":""}}';
    const openHoursJson = JSON.parse(openHours);
    // console.log(openHoursJson);
    this.pdbfind.put_by_type_and_key('settings', 'open_hours_weekly', openHoursJson);
  }

  set_default_calendarSettings() {
    let calendarSettings = '{"intervals": 30}';
    calendarSettings = JSON.parse(calendarSettings);
    // console.log(calendarSettings);
    this.pdbfind.put_by_type_and_key('settings', 'calendar_settings', calendarSettings);
  }



}
