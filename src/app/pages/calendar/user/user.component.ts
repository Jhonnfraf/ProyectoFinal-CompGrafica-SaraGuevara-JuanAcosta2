import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { CalendarioService, User, Calendar } from '../../../services/calendario.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  imports: [NgIf, NgForOf, CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit, OnDestroy {
  user: User | null = null;
  calendars: Calendar[] = [];
  private subscriptions = new Subscription();

  constructor(private calendarioService: CalendarioService) {}
  
  ngOnInit() {
    // Suscribirse al usuario
    this.subscriptions.add(
      this.calendarioService.user$.subscribe(user => {
        this.user = user;
        console.log('UserComponent loaded', user);
      })
    );

    // Suscribirse a los calendarios
    this.subscriptions.add(
      this.calendarioService.calendars$.subscribe(calendars => {
        this.calendars = calendars;
        console.log('Calendarios cargados:', calendars);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
