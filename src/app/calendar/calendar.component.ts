import { Component, OnInit } from '@angular/core';
import { PdbFind } from 'projects/ngx-dnd/pdb/src/public_api';
import { PdbKeys } from 'projects/ngx-dnd/pdb/src/lib/pdb-keys.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  constructor(
    private pdbfind: PdbFind,
    private pdbkeys: PdbKeys
  ) { }

  async ngOnInit() {
    const wart = await this.pdbkeys.get_doc_data('settings', 'open_hours_weekly');
    console.log('Wart: ', wart);
  }

}
