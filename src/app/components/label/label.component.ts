import { Component, Input, Output,EventEmitter } from '@angular/core';
import { FloatLabelModule } from "primeng/floatlabel"
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-label',
  imports: [FloatLabelModule, InputTextModule, FormsModule],
  templateUrl: './label.component.html',
  styleUrl: './label.component.css',
  standalone: true
})
export class LabelComponent {
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() model: any;

  @Output() modelChange = new EventEmitter<any>();

  onInputChange(value: any) {
    this.model = value;
    this.modelChange.emit(value);
  }
}
