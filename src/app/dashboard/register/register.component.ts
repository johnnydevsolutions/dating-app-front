import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ContaService } from 'src/app/services/conta.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  @Output() cancelRegister = new EventEmitter();

  // model: any = {};
  registerForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date;
  validationErrors: string[] | undefined;

  constructor(private contaService: ContaService,
              private toastr: ToastrService,
              private fb: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/^[^\s]+$/)]], // Update the pattern to disallow spaces
      gender: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', this.customDateValidator()],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8),Validators.pattern(/^(?=.*[!@#$%^&*])(?=.*[A-Z]).+$/)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => {
        this.registerForm.controls['confirmPassword'].updateValueAndValidity();
      }
    })
}

 customDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const selectedDate = control.value;

    // Implement your validation logic here.
    // You can check if the selectedDate is a valid date or any other condition you require.
    // For example, to validate that the date is not empty, you can use:
    return selectedDate ? null : { 'emptyDate': true };
  };
}

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {notMatching: true};
  }
}

  /* passwordValidator(control: AbstractControl): {[key: string]: boolean} | null {
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z]).{8,}$/; // Password regex pattern
    const valid = passwordRegex.test(control.value); // Test the password value against the regex pattern
    return valid ? null : { invalidPassword: true };
  } */


  register() {
    const dob = this.getDateOnly(this.registerForm.get('dateOfBirth')?.value);
    const values = {...this.registerForm.value, dateOfBirth: dob}
    this.contaService.register(values).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
      },
      error: error =>{
        this.validationErrors = error;
      }
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

  //Metodo para remover o timezone do datepicker
  private getDateOnly(dob: string | undefined) {
    if (!dob) return;
    let theDob = new Date(dob)
    return new Date(theDob.setMinutes(theDob.getMinutes() - theDob.getTimezoneOffset()))
    .toISOString().slice(0, 10);
  }

}
