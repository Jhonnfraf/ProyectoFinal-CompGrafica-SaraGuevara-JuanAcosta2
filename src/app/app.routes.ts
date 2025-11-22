import { Routes } from '@angular/router';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    

    //Home
    { path: '', component: HomeComponent },

    //Calendario
    { path: 'calendar', component: CalendarComponent },

    { path: '**', redirectTo: '' },

];
