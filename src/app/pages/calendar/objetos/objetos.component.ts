import { Component, Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { CalendarioService } from '../../../services/calendario.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-objetos',
  imports: [CommonModule],
  templateUrl: './objetos.component.html',
  styleUrl: './objetos.component.css'
})
export class ObjetosComponent implements OnInit {

  @Input() username: string | null = null;
  @Input() userId: number | null = null;
  @Input() calendarId: number | null = null;

  eventos: any[] = [];

  constructor(private calendarioService: CalendarioService) {}

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
          this.eventos = events;
          console.log("Eventos obtenidos:", this.eventos);
        },
        error: (err) => {
          console.error("Error obteniendo eventos:", err);
        }
      });
    }
  }

  eventoSeleccionadoId: number | null = null;

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

}
