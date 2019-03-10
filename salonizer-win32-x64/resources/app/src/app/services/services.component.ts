import { Component, OnInit, HostListener } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
import { PdbCore } from 'projects/ngx-pdb/pdb-wrapper/src/public_api';
import { ServiceClass } from './service-class';
PouchDB.plugin(PouchFind);


@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
dbname = new PouchDB('testbazy');
result: any;
fresult = new Array();
serviceForm = new ServiceClass();

@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
  // console.log(event);
  this.closeModal();
}


constructor(
  private db: PdbCore
) {
  this.dbname.createIndex({
    index: {fields: ['_id', 'type', 'data']}
  });
}

async ngOnInit() {
  try {
      this.result = await this.dbname.find({
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

async onEdit(item) {
  this.serviceForm = item;
  await delay(10);
  this.openModal();
}

async refresh() {
  this.fresult = new Array();
  await delay(10);
  this.ngOnInit();
}

async onNewService() {
  this.serviceForm = new ServiceClass();
  await this.openModal();
}

async openModal() {
  document.getElementById('addServiceModal').classList.add('showModal');
}

async onSubmit() {
  // console.log(this.serviceForm);
  if (!this.serviceForm.id) {
    this.db.put('services', this.serviceForm);
  } else {
    this.db.change(this.serviceForm.id, this.serviceForm);
  }
  this.closeModal();
  this.refresh();
}

onCencel() {
  this.refresh();
  this.closeModal();
}

closeModal() {
  document.getElementById('addServiceModal').classList.remove('showModal');
}

async onDelete(item: any) {
  if (confirm('Czy jesteś pewien, e chcesz usunąć wpis: ' + item.name + '?')) {
    this.db.remove_by_id(item.id);
    await this.refresh();
    this.closeModal();
  }
}


} // ngOnInit() end


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
