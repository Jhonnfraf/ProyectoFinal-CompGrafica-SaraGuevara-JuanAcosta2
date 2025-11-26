import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarCompComponent } from './calendar-comp/calendar-comp.component';
import { UserComponent } from './user/user.component';
import { ObjetosComponent } from './objetos/objetos.component';
import { HeaderComponent } from './header/header.component';
import { CalendarioService } from '../../services/calendario.service';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, CalendarCompComponent, UserComponent, ObjetosComponent,HeaderComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  // current selected date held in the parent so the child can be controlled
  selectedDate: Date = new Date();

  calendars = [];
  userId = Number(localStorage.getItem("userId"));
  username = localStorage.getItem("username");

  // optional: mapping of items per date (yyyy-mm-dd) - empty by default
  itemsByDate: { [date: string]: number } = {};

  constructor(private calendarioService: CalendarioService) {}

  // handler for the child's selectDate event (day click or month navigation)
  onSelectDate(date: Date) {
    this.selectedDate = date;
    this.calendarioService.setSelectedDate(date);
  }
}
