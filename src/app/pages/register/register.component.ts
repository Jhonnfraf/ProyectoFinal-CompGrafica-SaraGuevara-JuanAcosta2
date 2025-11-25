import { Component } from '@angular/core';
import { LabelComponent } from '../../components/label/label.component';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router} from '@angular/router';
import { RegisterService } from '../../services/register.service';
import { ToastComponent } from '../../components/toast/toast.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  imports: [LabelComponent, FormsModule, RouterLink, ToastComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private registerService: RegisterService,
    private router: Router,
    private messageService : MessageService
  ) {}

  registrar() {

    //Validaciones desde Angular
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
     return this.messageService.add({
       severity: 'error',
       summary: 'Campos incompletos',
       detail: 'Debes llenar todos los campos.'
     });
    }

    if (!this.email.includes('@') || !this.email.includes('.')) {
     return this.messageService.add({
       severity: 'error',
       summary: 'Email inválido',
       detail: 'Ingresa un correo electrónico válido.'
     });
    }

    if (this.password.length < 6) {
     return this.messageService.add({
       severity: 'error',
       summary: 'Contraseña muy corta',
       detail: 'Debe tener al menos 6 caracteres.'
     });
    }

    if (this.password !== this.confirmPassword) {
     return this.messageService.add({
       severity: 'error',
       summary: 'Contraseñas no coinciden',
       detail: 'Debes repetir correctamente tu contraseña.'
     });
    }


    const data = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    console.log('Datos a registrar:', data);

    this.registerService.register(data).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        
        //Mostrar exito
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Tu cuenta ha sido creada correctamente.'
        });

        setTimeout(() => {
          this.router.navigate(['/login']);
        },2000);
      },
      error: (error) => {
        console.error('Error en el registro:', error);

        if (error.status === 409){
          this.messageService.add({
            severity: 'error',
            summary: 'Usuario o correo ya existen',
            detail: 'Intenta con otro usuario o correo.'
          });
        }
        else if (error.status === 400){
          this.messageService.add({
            severity: 'error',
            summary: 'Datos inválidos',
            detail: 'Revisa los datos ingresados.'
          });
        }
        else this.messageService.add({
          severity: 'error',
          summary: 'Error en el registro',
          detail: 'Ocurrió un error al registrar tu cuenta. Intenta nuevamente más tarde.'
        });
      }
    });

  }

}
