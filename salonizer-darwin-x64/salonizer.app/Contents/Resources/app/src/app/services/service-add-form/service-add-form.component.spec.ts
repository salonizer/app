import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceAddFormComponent } from './service-add-form.component';

describe('ServiceAddFormComponent', () => {
  let component: ServiceAddFormComponent;
  let fixture: ComponentFixture<ServiceAddFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceAddFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
