import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ServiceClass } from '../service-class';
import { PdbCore } from '@ngx-dnd/pdb-wrapper';


@Component({
  selector: 'app-service-add-form',
  templateUrl: './service-add-form.component.html',
  styleUrls: ['./service-add-form.component.css']
})
export class ServiceAddFormComponent implements OnInit {
  serviceForm = new ServiceClass();

  // tslint:disable-next-line:new-parens
  @Output() eventTask = new EventEmitter;

  constructor(
    private db: PdbCore
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.serviceForm);
    this.db.put('services', this.serviceForm);
    this.closeModal();
    this.eventTask.emit('test');
  }

  clicked(event) {
    this.closeModal();
  }

  closeModal() {
    document.getElementById('addServiceModal').classList.remove('showModal');
  }

}

