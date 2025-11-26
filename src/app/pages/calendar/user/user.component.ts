import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { CalendarioService, Calendar } from '../../../services/calendario.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  imports: [NgIf, CommonModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit, OnDestroy {

  @Input() username: string | null = null;
  @Input() userId: number | null = null;

  calendarId: number | null = null;
  calendarName: string = '';
  createdAt: Date | null = null;

  private subscriptions = new Subscription();

  //Modal
  showModal: boolean = false;
  newCalendarName: string = '';

  constructor(private calendarioService: CalendarioService) {}

  ngOnInit() {
    // 1️⃣ Asegurar que userId exista
    if (this.userId == null) {
      console.error("userId es NULL. No puedo cargar calendarios.");
      return;
    }

    const parsedId = Number(this.userId); 

    this.calendarioService.getCalendarsByUserId(parsedId).subscribe({
      next: (calendars) => {
        if(calendars.length > 0){
          const cal = calendars[0];
          this.calendarId = cal.calendarId;
          this.calendarName = cal.calendarName;
          this.createdAt = cal.createdAt ? new Date(cal.createdAt) : null;
          console.log("Calendario cargado:", cal , this.calendarId, this.calendarName, this.createdAt);

        }else{
          this.showModal = true;
        }
      },
      error: (err) => {
        console.error("Error al obtener calendarios:", err);
      }
    });
  }

  
  closeModal(){
    this.showModal = false;
  }
  
  createFirstCalendar(){
    if (!this.newCalendarName.trim()) return;
    const body = {
    userId: Number(this.userId),
    calendarName: this.newCalendarName
    };

    this.calendarioService.createCalendar(body)
    .subscribe({
      next: (cal) => {
        this.calendarId = cal.calendarId;
        this.calendarName = cal.calendarName;
        this.createdAt = cal.createdAt ? new Date(cal.createdAt) : null;
        this.showModal = false;
      },
      error: (err) => {
        console.error('Error al crear calendario:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  

}
