import { Component, OnInit } from '@angular/core';
import { PdbCore, PdbFind, PdbInit } from 'projects/ngx-dnd/pdb/src/public_api';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  openHoursForm = new FormGroup({
    mo: new FormGroup({
      isOpen: new FormControl(true),
      openFrom: new FormControl(''),
      openTo: new FormControl('')
    }),
    tu: new FormGroup({
      isOpen: new FormControl(true),
      openFrom: new FormControl(''),
      openTo: new FormControl('')
    }),
    we: new FormGroup({
      isOpen: new FormControl(true),
      openFrom: new FormControl(''),
      openTo: new FormControl('')
    }),
    th: new FormGroup({
      isOpen: new FormControl(true),
      openFrom: new FormControl(''),
      openTo: new FormControl('')
    }),
    fr: new FormGroup({
      isOpen: new FormControl(true),
      openFrom: new FormControl(''),
      openTo: new FormControl('')
    }),
    sa: new FormGroup({
      isOpen: new FormControl(true),
      openFrom: new FormControl(''),
      openTo: new FormControl('')
    }),
    su: new FormGroup({
      isOpen: new FormControl(true),
      openFrom: new FormControl(''),
      openTo: new FormControl('')
    })
  }); // end: registrationForm;

  calendarSettingsForm = new FormGroup({
    intervals: new FormControl(''),
    });

result: any; // open_hours_weekly variable
calendarSettings: any; // calendar_settings variable

  constructor(
    private pdbinit: PdbInit,
    private pdbfind: PdbFind
  ) { }

  async ngOnInit() {
    await this.load_openHours_from_db();
    await this.load_settings_from_db();

    await this.openHoursForm.patchValue(this.result);
    console.log('log przed patchvalue: ', this.calendarSettings);
    this.calendarSettingsForm.patchValue(this.calendarSettings);

    // this.calendarSettingsForm.setValue(this.calendarSettings);

    this.openHoursForm.valueChanges.subscribe((update) => {
      console.log(update);
      this.pdbfind.put_by_type_and_name('settings', 'open_hours_weekly', update);
      // this.fields = JSON.parse(update.fields);
    });

    this.calendarSettingsForm.valueChanges.subscribe((update) => {
      console.log(update);
      this.pdbfind.put_by_type_and_name('settings', 'calendar_settings', update);
      // this.fields = JSON.parse(update.fields);
    });


  } // end: ngOninit()



  async load_settings_from_db() { // load calendar settings from DB
    const db = this.pdbinit.db_connect();
    this.pdbfind.create_index();
    try {
      const result: any = await db.find({
        selector: { type: 'settings', name: 'calendar_settings' }
      });
      await delay(10);
      console.log('calendar settings: ', result.docs[0].data);
      // return result.docs[0].data;
      this.calendarSettings = result.docs[0].data;
    } catch (err) {
      console.log(err);
      await delay(100);
      this.load_settings_from_db();
    }
  } // end: load_settings_from_db();


  async load_openHours_from_db() { // load OpenHours from DB
    const db = this.pdbinit.db_connect();
    this.pdbfind.create_index();
    try {
      this.result = await db.find({
        selector: { type: 'settings', name: 'open_hours_weekly' }
      });
      await delay(10);
      this.result = this.result.docs[0].data;
      await delay(10);
      // await console.log('DATABLE: ', this.result);
    } catch (err) {
      console.log(err);
      this.load_openHours_from_db();
    }
  } // end: load_openHours_from_db();


}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
