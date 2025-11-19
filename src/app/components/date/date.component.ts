import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-date',
  standalone: true,
  imports: [FormsModule, DatePickerModule],
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent {

  @Input() id: string = '';
  @Input() model: any; // Puede ser Date o string según tu uso

  @Output() modelChange = new EventEmitter<any>();

  onInputChange(value: any) {
    this.modelChange.emit(value);
  }

}
