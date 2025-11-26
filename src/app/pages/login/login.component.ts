import { Component } from '@angular/core';
import { LabelComponent } from '../../components/label/label.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastComponent } from '../../components/toast/toast.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [LabelComponent, FormsModule, RouterLink, ToastComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService],
  standalone: true
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService
  ) {}


  login(){
    if(!this.username || !this.password){
      this.messageService.add({
        severity: 'error',
        summary: 'Campos incompletos',
        detail: 'Por favor, complete todos los campos.'
      });
      return;
    }

    const data = {
      username: this.username,
      password: this.password
    }

    this.loginService.login(data).subscribe({
      next: (response) => {

        const userId = response.userId;

        localStorage.setItem("userId", userId.toString());
        localStorage.setItem("username", response.username);

        // 1️⃣ — Ahora sí pedimos el usuario real
        this.loginService.getUserById(userId).subscribe({
          next: user => {
            localStorage.setItem("user", JSON.stringify(user));

            this.messageService.add({
              severity: 'success',
              summary: 'Inicio exitoso',
              detail: `Bienvenido ${user.username}`
            });

            setTimeout(() => {
              this.router.navigate(['/calendar']);
            }, 1000);
          }
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Usuario o contraseña incorrectos.'
        });
      }
    });
  }
}
