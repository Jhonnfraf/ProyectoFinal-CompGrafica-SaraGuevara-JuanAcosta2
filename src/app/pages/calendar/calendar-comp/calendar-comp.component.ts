import { Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  input,
  output
 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-calendar-comp',
  imports: [CommonModule, NgForOf],
  templateUrl: './calendar-comp.component.html',
  styleUrl: './calendar-comp.component.css'
})
export class CalendarCompComponent {
  @Input() selectedDate: Date = new Date(); //inicializa el calendario con fecha actual

  //Indica si un dia tiene items
  @Input() itemsByDate: {[date: string]: number} = {};

  //evento emitido cuando el usuario navega entre meses o selecciona un dia
  @Output() selectDate = new EventEmitter<Date>();

  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"
    , "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  dayNames = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

  get currentMonth() { 
    return this.selectedDate.getMonth(); 
  }

  get currentYear() {
    return this.selectedDate.getFullYear();
  }

  //Obtener el primer dia del mes
  private get firstDayOfMonth() {
    return new Date(this.currentYear, this.currentMonth, 1);
  }

  //obtener el ultimo dia del mes (para ciclo) saber si son 30 o 31 dias
  private get lastDayOfMonth() {
    return new Date(this.currentYear, this.currentMonth + 1, 0);
  }

  private get startingDayOfWeek() {
    return this.firstDayOfMonth.getDay();
  }

  private get daysInMonth() {
    return this.lastDayOfMonth.getDate();
  }

  //Botones para navegar entre meses
  previousMonth() {
    this.selectDate.emit(
      new Date(this.currentYear, this.currentMonth - 1, 1)
    )
  }

  nextMonth() {
    this.selectDate.emit(
      new Date(this.currentYear, this.currentMonth + 1, 1))
  }

  //formatea una fecha (yyyy-mm-dd) para usar como llave en itemsByDate
  private formatDateKey(year: number, month: number, day: number){
    const m = (month + 1).toString().padStart(2,'0');
    const d = day.toString().padStart(2,'0');
    return `${year}-${m}-${d}`;
  }

  //Verificar si un dia tiene items
  hasItemsOnDay(day: number): boolean {
    const key = this.formatDateKey(this.currentYear, this.currentMonth, day);
    return !!this.itemsByDate[key];
  }

  //(es hoy?)
  isToday(day: number): boolean {
    const today = new Date();
    return day === today.getDate() 
      && this.currentMonth === today.getMonth()
      && this.currentYear === today.getFullYear();
  }

  //se ha seleccionado un dia?
  isSelected(day: number): boolean {
    return day === this.selectedDate.getDate()
      && this.currentMonth === this.selectedDate.getMonth()
      && this.currentYear === this.selectedDate.getFullYear();
  }

  //Construccion del grid del calendario: celdas vacias + dias
  get gridDays(): Array<{type: 'empty'} | {type: 'day', day: number, hasItems: boolean, today:boolean , selected: boolean}> {
    const out: any[] = [];

    // celdas vacias antes del primer dia del mes
    for (let i = 0; i < this.startingDayOfWeek; i++) {
      out.push({ type: 'empty' });
    }

    // dias del mes
    for (let day = 1; day <= this.daysInMonth; day++) {
      const has = this.hasItemsOnDay(day);
      const today = this.isToday(day);
      const selected = this.isSelected(day);
      out.push({ type: 'day', day, hasItems: has, today, selected})
    }

    return out;
  }

  onSelectDay(day: number) {
    this.selectDate.emit(new Date(this.currentYear, this.currentMonth, day));
  }

}
