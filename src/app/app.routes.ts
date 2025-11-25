import { Routes } from '@angular/router';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
    

    //Home
    { path: '', component: HomeComponent },

    //Calendario
    { path: 'calendar', component: CalendarComponent },

    { path: 'login', component: LoginComponent },

    { path: 'register', component: RegisterComponent },

    { path: '**', redirectTo: '' },

];
