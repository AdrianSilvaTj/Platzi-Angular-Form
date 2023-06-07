import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-basic-form',
  templateUrl: './basic-form.component.html',
  styleUrls: ['./basic-form.component.scss']
})
export class BasicFormComponent implements OnInit {

  // form = new FormGroup({
  //   name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
  //   email : new FormControl('', [Validators.required, Validators.email]),
  //   phone: new FormControl(''),
  //   color : new FormControl('#000000'),
  //   date : new FormControl(''),
  //   age : new FormControl(12),
  //   category : new FormControl(),
  //   tag : new FormControl(),
  //   agree : new FormControl(false),
  //   gender : new FormControl(false),
  //   zone : new FormControl(false),
  // });

  form!: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(
    private formBuilder : FormBuilder
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.nameField.valueChanges
    .subscribe(value => {
      console.log(value);
    });
  }

  private buildForm(){
    this.form = this.formBuilder.group({
      fullName: this.formBuilder.group({
        name:['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[a-zA-Z ]+$/)]],
        last:['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[a-zA-Z ]+$/)]]
      }),
      email : ['', [Validators.required, Validators.email]],
      phone: [''],
      color : ['#000000'],
      date : ['', [Validators.required]],
      age : [''],
      category : [''],
      tag : [''],
      agree : ['false', [Validators.requiredTrue]],
      gender : [''],
      zone : [''],
    });
  }

  getNameValue() {
    //console.log(this.nameField!.value);
  }

  // getter para obtener el valor de un campo de un formgroup
  get nameField(){
    return this.form.get('fullName.name');
  }
  get lastField(){
    return this.form.get('fullName.last');
  }
  get emailField() {
    return this.form.get('email');
  }
  get phoneField() {
    return this.form.get('phone');
  }
  get colorField() {
    return this.form.get('color');
  }
  get dateField() {
    return this.form.get('date');
  }
  get ageField() {
    return this.form.get('age');
  }
  get categoryField() {
    return this.form.get('category');
  }
  get tagField() {
    return this.form.get('tag');
  }
  get agreeField() {
    return this.form.get('agree');
  }
  get genderField() {
    return this.form.get('gender');
  }
  get zoneField() {
    return this.form.get('zone');
  }

  // getters para verificar validaciones
  get isNameFieldValid(){
    return this.nameField.touched && this.nameField.valid;
  }
  get isNameFieldInvalid(){
    return this.nameField.touched && this.nameField.invalid;
  }
  get isLastFieldValid(){
    return this.lastField.touched && this.lastField.valid;
  }
  get isLastFieldInvalid(){
    return this.lastField.touched && this.lastField.invalid;
  }
  get isEmailFieldValid(){
    return this.emailField.touched && this.emailField.valid;
  }
  get isEmailFieldInvalid(){
    return this.emailField.touched && this.emailField.invalid;
  }
  get isAgreeFieldValid(){
    return this.agreeField.touched && this.agreeField.valid;
  }
  get isAgreeFieldInvalid(){
    return this.agreeField.touched && this.agreeField.invalid;
  }
  get isDateFieldInvalid(){
    return this.dateField.touched && this.dateField.invalid;
  }

  saveForm(event: any){
    if(this.form.valid){
      console.log(this.form.value);
    }else{
      // marca todos los campos como touched a fin de mostrar los posibles errores
      this.form.markAllAsTouched();
      console.log("Errors has ocurrs!!!!");
    }
  }

}
