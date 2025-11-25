import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Interfaces para tipado
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
  Id: number;
  UserName: string;
  Email?: string;
  // otros campos que tenga tu usuario
}

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {
  // Fecha seleccionada
  private selectedDateSource = new BehaviorSubject<Date>(new Date());
  selectedDate$ = this.selectedDateSource.asObservable();

  // Usuario actual
  private userSource = new BehaviorSubject<User | null>(this.getUserFromLocalStorage());
  user$ = this.userSource.asObservable();

  // Calendarios del usuario
  private calendarsSource = new BehaviorSubject<Calendar[]>(this.getCalendarsFromLocalStorage());
  calendars$ = this.calendarsSource.asObservable();

  constructor() {
    // Al inicializar, cargamos los datos del localStorage
    this.loadUserData();
  }

  // ===== FECHA SELECCIONADA =====
  setSelectedDate(date: Date) {
    this.selectedDateSource.next(date);
  }

  getSelectedDate(): Date {
    return this.selectedDateSource.getValue();
  }

  // ===== USUARIO =====

  /**
   * Obtiene el usuario del localStorage
   * Se espera que esté guardado en una clave llamada 'user'
   * Formato esperado: { Id: number, UserName: string, Email: string }
   */
  private getUserFromLocalStorage(): User | null {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (e) {
        console.error('Error al parsear usuario del localStorage:', e);
        return null;
      }
    }
    return null;
  }

  /**
   * Obtiene el usuario actual
   */
  getUser(): User | null {
    return this.userSource.getValue();
  }

  /**
   * Actualiza el usuario en el servicio (también en localStorage)
   */
  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSource.next(user);
  }

  // ===== CALENDARIOS =====

  /**
   * Obtiene los calendarios del localStorage
   * Se espera que estén guardados en una clave llamada 'calendars'
   * Formato: Array<Calendar>
   */
  private getCalendarsFromLocalStorage(): Calendar[] {
    const calendarsJson = localStorage.getItem('calendars');
    if (calendarsJson) {
      try {
        return JSON.parse(calendarsJson);
      } catch (e) {
        console.error('Error al parsear calendarios del localStorage:', e);
        return [];
      }
    }
    return [];
  }

  /**
   * Obtiene los calendarios del usuario actual
   */
  getCalendars(): Calendar[] {
    return this.calendarsSource.getValue();
  }

  /**
   * Obtiene un observable de los calendarios (para suscribirse a cambios)
   */
  getCalendars$(): Observable<Calendar[]> {
    return this.calendars$;
  }

  /**
   * Actualiza los calendarios en el servicio (también en localStorage)
   */
  setCalendars(calendars: Calendar[]) {
    localStorage.setItem('calendars', JSON.stringify(calendars));
    this.calendarsSource.next(calendars);
  }

  /**
   * Carga todos los datos del usuario (llamado al inicializar)
   */
  private loadUserData() {
    const user = this.getUserFromLocalStorage();
    const calendars = this.getCalendarsFromLocalStorage();
    
    if (user) {
      this.userSource.next(user);
    }
    if (calendars.length > 0) {
      this.calendarsSource.next(calendars);
    }
  }
}
