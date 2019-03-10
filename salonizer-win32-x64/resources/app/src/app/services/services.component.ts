import { Component, OnInit } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
PouchDB.plugin(PouchFind);


@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
db = new PouchDB('testbazy');
result: any;
fresult = new Array();

constructor() {
  this.db.createIndex({
    index: {fields: ['_id', 'type', 'data']}
  });
}

async ngOnInit() {
  try {
      this.result = await this.db.find({
        selector: { type: 'services' }
      });
      // tslint:disable:label-position
      // tslint:disable-next-line:no-unused-expression
      newResult: new Array();
      // await console.log('DATABLE: ', this.result.docs);
      for (let entry of this.result.docs) {
        let id: string = entry._id;
        entry = entry.data;
        entry.id = id;
        // console.log('ENTRY: ', entry);
        this.fresult.push(entry);
      }
      // console.log('New result: ', this.fresult);
  } catch (err) {
    console.log(err);
  }
}



async refresh() {
  this.fresult = new Array();
  await delay(10);
  this.ngOnInit();
}

async openModal() {
    document.getElementById('addServiceModal').classList.add('showModal');
  }

}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

export interface Data {
    name: string;
    time: string;
    cost: string;
}

export interface Doc {
    type: string;
    data: Data;
    _id: Date;
    _rev: string;
}

export interface RootObject {
    docs: Doc[];
}
