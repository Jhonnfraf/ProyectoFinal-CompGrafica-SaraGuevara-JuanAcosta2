import { Component, OnInit } from '@angular/core';
import { CalendarioService } from '../../../services/calendario.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  selectedDate: Date = new Date();

  constructor(private calendarioService: CalendarioService) {}

  ngOnInit(): void {
      this.calendarioService.selectedDate$.subscribe(date => {
        this.selectedDate = date;
      })
  }

  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"
    , "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  
  //Metodos para abrir modal con datos de la fecha seleccionada

  mostrarModal: boolean = false;
  ObtenerDatos() {
    const fecha = this.calendarioService.getSelectedDate();
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // Los meses en JavaScript son base 0
    const anio = fecha.getFullYear();

    const nombreDia = this.convertirDia(fecha.getDay());
    const nombreMes = this.convertirMes(fecha.getMonth());
    console.log(`Día: ${nombreDia}, Mes: ${nombreMes}, Año: ${anio}`);
    this.mostrarModal = true;
    return { dia, mes, anio };
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  //Metodos auxiliares para convertir numero a nombre de dia y mes

  convertirDia (diaNumero: number): string {
    return this.dayNames[diaNumero];
  }

  convertirMes(mesNumero: number): string {
    return this.monthNames[mesNumero];
  }

  // Métodos para las opciones del botón "Agregar"

  OpcionSelecEvento: boolean = false;
  OpcionSelecRecordatorio: boolean = false;
  OpcionSelecRutina: boolean = false;

  OpcionEvento() {
    this.OpcionSelecEvento = true;
    this.OpcionSelecRecordatorio = false;
    this.OpcionSelecRutina = false;
    console.log("Abrir opciones de evento");
  }

  OpcionRecordatorio() {
    this.OpcionSelecRecordatorio = true;
    this.OpcionSelecEvento = false;
    this.OpcionSelecRutina = false;
    console.log("Abrir opciones de recordatorio");
  }

  OpcionRutina() {
    this.OpcionSelecRutina = true;
    this.OpcionSelecEvento = false;
    this.OpcionSelecRecordatorio = false;
    console.log("Abrir opciones de rutina");
  }
}
