import { Component, OnInit, HostListener } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
PouchDB.plugin(PouchFind);
import { CustomerClass } from './customer-class';
import { PdbCore } from 'projects/ngx-dnd/pdb/src/public_api';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  dbname = new PouchDB('testbazy');
  result: any;
  fresult = new Array();
  customerForm = new CustomerClass();

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    // console.log(event);
    this.closeModal();
    this.refresh();
  }


  constructor(
    private db: PdbCore
  ) {
    this.dbname.createIndex({
      index: { fields: ['_id', 'type', 'data'] }
    });
  }

  async ngOnInit() {
    try {
      this.result = await this.dbname.find({
        selector: { type: 'customers' }
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
  } // end: ngOnInit();

  async onEdit(item) {
    this.customerForm = item;
    await delay(10);
    this.openModal();
  }

  async onClick(item) {
    this.customerForm = item;
    await delay(10);
    this.openCustomerHistoryModal();
  }

  async refresh() {
    this.fresult = new Array();
    await delay(10);
    this.ngOnInit();
  }

  async onNewCustomer() {
    this.customerForm = new CustomerClass();
    await this.openModal();
  }

  async openModal() {
    document.getElementById('addCustomerModal').classList.add('showModal');
  }

  async openCustomerHistoryModal() {
    document.getElementById('showCustomerHistoryModal').classList.add('showModal');
  }

  async onSubmit() {
    // console.log(this.customerForm);
    if (!this.customerForm.id) {
      this.db.put('customers', this.customerForm);
    } else {
      this.db.change(this.customerForm.id, this.customerForm);
    }
    this.closeModal();
    this.refresh();
  }

  onCencel() {
    this.refresh();
    this.closeModal();
  }

  closeModal() {
    document.getElementById('addCustomerModal').classList.remove('showModal');
    document.getElementById('showCustomerHistoryModal').classList.remove('showModal');
  }

  async onDelete(item: any) {
    if (confirm('Czy jesteś pewien, ze chcesz usunąć klienta: ' + item.name + '?')) {
      this.db.remove_by_id(item.id);
      await this.refresh();
      this.closeModal();
    }
  }


} // ngOnInit() end


function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
