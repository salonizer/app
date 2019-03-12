import { Component, OnInit } from '@angular/core';
import { PdbCore, PdbFind, PdbInit } from 'projects/ngx-dnd/pdb/src/public_api';
import { FormGroup, FormControl } from '@angular/forms';
import { PdbKeys } from 'projects/ngx-dnd/pdb/src/lib/pdb-keys.service';
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
    private pdbfind: PdbFind,
    private pdbkeys: PdbKeys
  ) { }

  async ngOnInit() {
    this.result = await this.pdbkeys.get_doc_data('settings', 'open_hours_weekly');
    this.calendarSettings = await this.pdbkeys.get_doc_data('settings', 'calendar_settings');


    await delay(1000);
    console.log('RESULT: ', this.result);
    console.log('CALSETT: ', this.calendarSettings);


    await this.openHoursForm.patchValue(this.result);
    await this.calendarSettingsForm.patchValue(this.calendarSettings);

    // this.calendarSettingsForm.setValue(this.calendarSettings);

    this.openHoursForm.valueChanges.subscribe((update) => {
      console.log(update);
      this.pdbfind.put_by_type_and_key('settings', 'open_hours_weekly', update);
      // this.fields = JSON.parse(update.fields);
    });

    this.calendarSettingsForm.valueChanges.subscribe((update) => {
      console.log(update);
      this.pdbfind.put_by_type_and_key('settings', 'calendar_settings', update);
      // this.fields = JSON.parse(update.fields);
    });


  } // end: ngOninit()

} // end: class SettingsComponent;

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
