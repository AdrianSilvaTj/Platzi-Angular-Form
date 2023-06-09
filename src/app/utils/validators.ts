import { map } from 'rxjs/operators';
import { AbstractControl } from '@angular/forms';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../core/models/categories.model';

export class MyValidators {

  static isPriceValid(control: AbstractControl) {
    const value = control.value;
    console.log(value);
    if (value > 10000) {
      return {price_invalid: true};
    }
    return null;
  }
  static validPassword(control: AbstractControl) {
    const value = control.value;
    if (!containsNumber(value)) {
      return {invalid_password: true};
    }
    return null;
  }

  static matchPasswords(control: AbstractControl) {
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmPassword').value;
    if (password !== confirmPassword) {
      return {no_match_password: true};
    }
    return null;
  }

  /* Esta funcion validara si el nombre de la categoria que queremos registrar esta disponible en la API,
    - Recibe el CategoriesService como parámetro, mas no se inyecta en la función, es solo para tipar
    - Retorna una función que es la que va a realizar la validación
    - La cual envia el nombre a traves de la funcion checkNameCategory del service
    - Luego verifica la respuesta con el map, la cual llega de la siguiente forma:
      {isAvailable: true or false}
  */
  static validateCategory(service: CategoriesService){
    return (control: AbstractControl) => {
      const value = control.value;
      return service.checkNameCategory(value).pipe(
        map((response:any) => {
          const isAvailable = response.isAvailable;
          if (!isAvailable){
            return {not_available: true};
          }
          return null;
        })
      )
    }
  }

  static validateCategAll(service: CategoriesService){
    return (control: AbstractControl) => {
      const value = control.value;
      return service.getAllCategories().pipe(
        map((response:Category[]) => {
          const notAvailable = response.find(cat => cat.name === value);
          if (notAvailable){
            return {not_available: true};
          }
          return null;
        })
      )
    }
  }

}

function containsNumber(value: string){
  return value.split('').find(v => isNumber(v)) !== undefined;
}


function isNumber(value: string){
  return !isNaN(parseInt(value, 10));
}
