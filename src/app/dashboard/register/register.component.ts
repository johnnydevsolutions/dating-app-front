import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ContaService } from 'src/app/services/conta.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  @Output() cancelRegister = new EventEmitter();

  model: any = {};

  constructor(private contaService: ContaService,
              private toastr: ToastrService) { }

  ngOnInit(): void {

  }

  register() {
    this.contaService.register(this.model).subscribe({
      next: () => {
        this.cancel();
      },
      error: error =>{
      this.toastr.error(error.error),
      console.log(error);
      }
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

}
