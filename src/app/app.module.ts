import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartComponent } from './start/start.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ServicesComponent } from './services/services.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { SettingsComponent } from './settings/settings.component';
import { CustomersComponent } from './customers/customers.component';
import { StatsComponent } from './stats/stats.component';
import { AddFormComponent } from './customers/add-form/add-form.component';
import { ServiceAddFormComponent } from './services/service-add-form/service-add-form.component';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    CalendarComponent,
    ServicesComponent,
    WelcomeComponent,
    SettingsComponent,
    CustomersComponent,
    StatsComponent,
    AddFormComponent,
    ServiceAddFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
