import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { CustomersComponent } from './customers/customers.component';
import { ServicesComponent } from './services/services.component';
import { SettingsComponent } from './settings/settings.component';
import { StatsComponent } from './stats/stats.component';

const routes: Routes = [
  // { path: '', redirectTo: '/calendar', pathMatch: 'full'},
  { path: 'calendar', component: CalendarComponent},
  { path: 'customers', component: CustomersComponent},
  { path: 'services', component: ServicesComponent},
  { path: 'stats', component: StatsComponent},
  { path: 'settings', component: SettingsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
