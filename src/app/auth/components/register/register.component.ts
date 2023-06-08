import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './../../../core/services/auth.service';
import {MyValidators} from './../../../utils/validators'
import { ErrorStateMatcher } from '@angular/material/core';

// Error when invalid control is dirty, touched, or submitted.
// Manejador errores entre campos, esta función se ejecuta cuando un control o el form es invalido
// Esta retorna true, para indicar que existe un error en alguno de los validators y false para indicar que no.
// En este caso se acondicionó para que solo mostrara error cuan el confirm password haya sido tocado(touched) y,
// este vacio (required) o no coincida con el password(no_match_pass)
export class CrossFieldStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    if (control.touched || form.submitted) {
      if (form.hasError('no_match_password') || control.hasError('required')) {
        return true;
      }
    }
    return false;
  }
}

// esto va antes del @Component

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup | any;
  crossMatcher = new CrossFieldStateMatcher;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.buildForm();
  }

  ngOnInit() {}

  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }
  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  register(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      console.log('Registrado con exito!!!');
      const value = this.form.value;
      this.authService.createUser(value.email, value.password).then(() => {
        this.router.navigate(['/auth/login']);
      });
    }else{
      this.form.markAllAsTouched();
      console.log("Errors has ocurrs!!!!");
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6), MyValidators.validPassword]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: MyValidators.matchPasswords
    });
  }
}
