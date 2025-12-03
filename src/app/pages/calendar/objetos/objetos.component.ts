import { Component, Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { CalendarioService } from '../../../services/calendario.service';
import { CommonModule } from '@angular/common';
import { LabelComponent } from '../../../components/label/label.component';
import { DateComponent } from '../../../components/date/date.component';
import { MessageService } from 'primeng/api';
import { ToastComponent } from '../../../components/toast/toast.component';


@Component({
  selector: 'app-objetos',
  imports: [CommonModule, LabelComponent, DateComponent, ToastComponent],
  standalone: true,
  templateUrl: './objetos.component.html',
  styleUrl: './objetos.component.css'
})
export class ObjetosComponent implements OnInit {

  @Input() username: string | null = null;
  @Input() userId: number | null = null;
  @Input() calendarId: number | null = null;

  hoy: Date = new Date();

  eventos: any[] = [];

  constructor(private calendarioService: CalendarioService,
              private messageService : MessageService) {}

  ngOnInit(): void {
    if (!this.userId) {
        console.error("No hay userId en localStorage En Objetos.");
        return;
      }

      this.calendarioService.getCalendarsByUserId(this.userId).subscribe({
        next: (calendars) => {
          if (calendars.length > 0) {
            const cal = calendars[0];
            this.calendarId = cal.calendarId;

            // opcional: guardarlo en localStorage
            localStorage.setItem("calendarId Para Objetos", String(this.calendarId));

            console.log("Calendario cargado en Header:", this.calendarId);

            this.ObtenerEventos();
          } else {
            console.error("El usuario no tiene calendarios.");
          }
        },
        error: (err) => {
          console.error("Error obteniendo calendario:", err);
        }
      });
  }

  ObtenerEventos() {
    if (this.calendarId) {
      this.calendarioService.getEvents(this.calendarId).subscribe({
        next: (events) => {
          this.eventos = events.map(e => ({
            ...e,
            startDate: new Date(e.startDate)   // 👈 convertir aquí
          }));

          console.log("Eventos obtenidos:", this.eventos);
        },
        error: (err) => {
          console.error("Error obteniendo eventos:", err);
        }
      });
    }
  }

  eventoSeleccionadoId: number | null = null;

  eventoEditado: any = {
    title: '',
    description: '',
    startDate: ''
  }

  EliminarEvento() {
    if (this.calendarId && this.eventoSeleccionadoId !== null) {
      this.calendarioService.deleteEvent(this.eventoSeleccionadoId , this.calendarId)
        .subscribe({
          next: () => {
            console.log(`Evento ${this.eventoSeleccionadoId} eliminado correctamente.`);
            this.eventos = this.eventos.filter(e => e.eventId !== this.eventoSeleccionadoId);
            this.ObtenerEventos();
            this.cerrarModalBorrarEvento();
            
          },
          error: (err) => {
            console.error(`Error eliminando evento:`, err);
          }
        });
    }
  }

  EditarEvento(){

      if (
        !this.eventoEditado.title ||
        !this.eventoEditado.description ||
        !this.eventoEditado.startDate
      ) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Por favor, llene todos los campos'
        });
        return; 
      }
      const fecha = this.eventoEditado.startDate;
      const fechaString = fecha instanceof Date
        ? fecha.toISOString()
        : fecha;
      
      if (!this.eventoSeleccionadoId || !this.calendarId) return;

      const payload = {
          title: this.eventoEditado.title,
          description: this.eventoEditado.description,
          startDate: fechaString
      };

      this.calendarioService.updateEvent(
        this.eventoSeleccionadoId,
        this.calendarId,
        payload
      ).subscribe({
        next: () => {
          console.log("Evento actualizado: ", payload);

          this.eventos = this.eventos.map(e =>
            e.eventId === this.eventoSeleccionadoId ? { ...e, ...payload } : e
          );

          this.cerrarModalEditarEvento();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Evento actualizado correctamente'
          });
          
        },
        error: err => console.error("Error actualizando evento:", err)
      })
      
      
  }

  
  abrirModalDelete = false;
  abrirModalBorrarEvento(eventId: number) {
    // Lógica para abrir el modal de confirmación de borrado
    console.log("Evento a eliminar:", eventId);
    this.eventoSeleccionadoId = eventId;
    this.abrirModalDelete = true;
  }
  cerrarModalBorrarEvento() {
    // Lógica para cerrar el modal de confirmación de borrado
    this.abrirModalDelete = false;
  }

  abrirModalEditar = false;
  abrirModalEditarEvento(eventId: number) {
    // Lógica para abrir el modal de edición
    console.log("Evento a editar:", eventId);
    this.eventoSeleccionadoId = eventId;

    const evento = this.eventos.find(e => e.eventId === eventId);
    if (!evento) return;

    this.eventoEditado = {
      title: evento.title,
      description: evento.description,
      startDate: evento.startDate ? new Date(evento.startDate) : null
    }

    console.log("Datos del evento a editar:", this.eventoEditado);

    this.abrirModalEditar = true;
    // Aquí iría la lógica para abrir el modal de edición
  }
  cerrarModalEditarEvento() {
    // Lógica para cerrar el modal de edición
    this.abrirModalEditar = false;
  }
}
