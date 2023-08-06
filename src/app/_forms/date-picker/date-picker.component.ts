import { Component, Input, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() maxDate?: Date | undefined;
  bsConfig: Partial<BsDatepickerConfig> | undefined
  @ViewChild('dp') datepicker: any;

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
    this.bsConfig = {
      containerClass: 'theme-red',
      dateInputFormat: 'MMMM DD, YYYY',
      showWeekNumbers: false // Desativa a exibição dos números das semanas
    }
  }

  toggleDatePicker() {
    this.datepicker.toggle();
}

  writeValue(obj: any): void {

  }
  registerOnChange(fn: any): void {

  }
  registerOnTouched(fn: any): void {

  }
  setDisabledState?(isDisabled: boolean): void {

  }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }
}
