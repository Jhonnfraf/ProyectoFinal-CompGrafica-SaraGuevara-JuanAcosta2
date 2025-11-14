import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {
  // behavior subject para seleccionar el ultimo valor
  // en este caso (la fecha seleccionada)
  private selectedDateSource = new BehaviorSubject<Date>(new Date());
  selectedDate$ = this.selectedDateSource.asObservable();

  //Cambia el dia seleccionado
  setSelectedDate(date: Date) {
    this.selectedDateSource.next(date);
  }

  //Devuelve el valor actual del dia seleccionado
  getSelectedDate(): Date {
    return this.selectedDateSource.getValue();
  }


}
