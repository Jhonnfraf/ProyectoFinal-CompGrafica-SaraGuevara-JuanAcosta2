import { Component } from '@angular/core';
import { Toast } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-toast',
  imports: [Toast, ButtonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  standalone: true,

})
export class ToastComponent {}
