import { Component, OnInit } from '@angular/core';
import { PdbInit } from '@ngx-dnd/pdb-wrapper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
title="aplikacja";

constructor(
  private pdbinit: PdbInit
) {
  this.pdbinit.set_basename('testbazy');
}

  ngOnInit() {


  }
}
