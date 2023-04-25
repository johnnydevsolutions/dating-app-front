import { Component, Input, Self } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-password',
  templateUrl: './text-password.component.html',
  styleUrls: ['./text-password.component.scss']
})
export class TextPasswordComponent {
  @Input() label = '';
  @Input() type = 'text';

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {

  }

  registerOnChange(fn: any): void {

  }

  registerOnTouched(fn: any): void {

  }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }
}
