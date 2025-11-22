import { Component, OnInit } from '@angular/core';
import { CalendarioService } from '../../../services/calendario.service';
import { NgIf } from '@angular/common';
import { LabelComponent } from '../../../components/label/label.component';
import { DateComponent } from '../../../components/date/date.component';
import { HourComponent } from '../../../components/hour/hour.component';
import { FormsModule } from "@angular/forms";
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [NgIf,NgFor, LabelComponent, DateComponent, HourComponent, FormsModule],
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

  //Guardar variables de fecha, mes y año actuales
  tituloFecha: string = "";
  dia: number = 0;
  mes: string = "";
  anio: number = 0;

  //Variables encargadas de los modelos de los inputs (Probablemente use estas para la base de datos)
  diasSeleccionados: number[] = [];

  diasSemana = [
    {id:1, nombre:"L"},
    { id: 2, nombre: 'M' },
    { id: 3, nombre: 'X' },
    { id: 4, nombre: 'J' },
    { id: 5, nombre: 'V' },
    { id: 6, nombre: 'S' },
    { id: 0, nombre: 'D' }
  ]
  //Evento
  nombreEvento: string = '';
  descripcionEvento: string = '';
  fechaEvento: string = '';
  horaEvento: string = '';
  //Recordatorio
  horaRecordatorio: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';
  //Rutina
  horaInicio: string = '';
  horaFin: string = '';
  
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

    //guardar valores en variables
    this.tituloFecha = `${nombreDia}, ${dia} de ${nombreMes} de ${anio}`;
    this.dia = dia;
    this.mes = nombreMes;
    this.anio = anio;

    this.mostrarModal = true;

    this.fechaEvento = `${anio}-${mes.toString().padStart(2,'0')}-${dia.toString().padStart(2,'0')}`;
    
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.nombreEvento = '';
    this.descripcionEvento = '';
    this.fechaEvento='';
    this.horaEvento='';
    this.horaRecordatorio = '';
    this.fechaInicio = '';
    this.fechaFin = '';
    this.horaInicio= '';
    this.horaFin='';
    this.diasSeleccionados = [];
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

  ResetearOpciones() {
    this.nombreEvento = '';
    this.descripcionEvento = '';

  }

  OpcionEvento() {
    this.OpcionSelecEvento = true;
    this.OpcionSelecRecordatorio = false;
    this.OpcionSelecRutina = false;
    this.ResetearOpciones();
    console.log("Abrir opciones de evento");
  }

  OpcionRecordatorio() {
    this.OpcionSelecRecordatorio = true;
    this.OpcionSelecEvento = false;
    this.OpcionSelecRutina = false;
    this.ResetearOpciones();
    console.log("Abrir opciones de recordatorio");
  }

  OpcionRutina() {
    this.OpcionSelecRutina = true;
    this.OpcionSelecEvento = false;
    this.OpcionSelecRecordatorio = false;
    this.ResetearOpciones();
    console.log("Abrir opciones de rutina");
  }

  ObtenerFechaString(): string{
    const fecha = this.calendarioService.getSelectedDate();
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // Los meses en JavaScript son base 0
    const anio = fecha.getFullYear();

    return `${mes}/${dia}/${anio}`
  }

  //Logica para guardar evento en el calendario (En desarrollo - se necesita backend)
  GuardarEvento() {
    console.log("Evento guardado");
    this.cerrarModal();
  }

  seleccionarDias(diaId: number){
    if(this.diasSeleccionados.includes(diaId)){
      this.diasSeleccionados = this.diasSeleccionados.filter(d => d !== diaId);
    } 
    else {
      this.diasSeleccionados.push(diaId)
    }
    console.log("Días seleccionados:", this.diasSeleccionados);
  }

  

}
