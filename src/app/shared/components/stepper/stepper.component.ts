import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StepperComponent),
    multi: true
  }]
})
export class StepperComponent {
  currentValue = 0;
  // Funciones vacias, es decir mantendra el mismo funcionamiento que por defecto le da Angular
  onChange = (_:any) => {};
  onTouch = () => {};
  isDisabled: boolean;

  add(){
    this.currentValue += 1;
    this.onTouch();
    this.onChange(this.currentValue);
  }

  remove(){
    this.currentValue -= 1;
    this.onTouch();
    this.onChange(this.currentValue);
  }

  writeValue(value: number): void {
    // metodo para asignar un valor en la declaración del form control que contendra,
    // nuestro componente
    if(value){
      this.currentValue = value;
    }
  }

  registerOnChange(fn: any): void{
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void{
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void{
    this.isDisabled = isDisabled
  }

}
