import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Calendar {
  CalendarId: number;
  UserId: number;
  CalendarName: string;
  CreatedAt?: Date;
  Events?: any[];
  Reminders?: any[];
  Routines?: any[];
}

export interface User {
  UserId: number;
  UserName: string;
  Email?: string;
}

// DTO para crear calendario
export interface CreateCalendarDto {
  userId: number;
  calendarName: string;
}

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {

  private apiUrl = 'https://localhost:7172/api'; // Cambia según tu backend

  private selectedDateSource = new BehaviorSubject<Date>(new Date());
  selectedDate$ = this.selectedDateSource.asObservable();

  private userSource = new BehaviorSubject<User | null>(this.getUserFromLocalStorage());
  user$ = this.userSource.asObservable();

  private calendarsSource = new BehaviorSubject<Calendar[]>(this.getCalendarsFromLocalStorage());
  calendars$ = this.calendarsSource.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserData();
  }

  // ===== FECHA =====
  setSelectedDate(date: Date) {
    this.selectedDateSource.next(date);
  }

  getSelectedDate(): Date {
    return this.selectedDateSource.getValue();
  }

  // ===== USUARIO =====
  private getUserFromLocalStorage(): User | null {
    const json = localStorage.getItem('user');
    if (!json) return null;

    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  getUser(): User | null {
    return this.userSource.getValue();
  }

  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSource.next(user);
  }

  // ===== CALENDARIOS =====

  private getCalendarsFromLocalStorage(): Calendar[] {
    const json = localStorage.getItem('calendars');
    if (!json) return [];

    try {
      return JSON.parse(json);
    } catch {
      return [];
    }
  }

  getCalendars(): Calendar[] {
    return this.calendarsSource.getValue();
  }

  getCalendars$(): Observable<Calendar[]> {
    return this.calendars$;
  }

  setCalendars(calendars: Calendar[]) {
    localStorage.setItem('calendars', JSON.stringify(calendars));
    this.calendarsSource.next(calendars);
  }

  private loadUserData() {
    const user = this.getUserFromLocalStorage();
    const calendars = this.getCalendarsFromLocalStorage();

    if (user) this.userSource.next(user);
    if (calendars.length > 0) this.calendarsSource.next(calendars);
  }

  // =============================
  // === 🔥 MÉTODOS QUE FALTABAN ===
  // =============================

  /** GET: Obtener calendarios desde el backend */
  getCalendarsByUserId(userId: number): Observable<Calendar[]> {
    return this.http.get<Calendar[]>(`${this.apiUrl}/Calendars/user/${userId}`);
  }

  /** POST: Crear un nuevo calendario */
  createCalendar(dto: CreateCalendarDto): Observable<Calendar> {
    return new Observable(observer => {
      this.http.post<Calendar>(`${this.apiUrl}/Calendars`, dto).subscribe({
        next: created => {
          // Actualizamos localStorage y BehaviorSubject
          const updatedList = [...this.getCalendars(), created];
          this.setCalendars(updatedList);

          observer.next(created);
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }
}