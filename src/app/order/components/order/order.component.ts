import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Product } from './../../../core/models/product.model';
import { CartService } from './../../../core/services/cart.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  products$: Observable<Product[]>;
  form!: FormGroup;

  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder
  ) {
    this.products$ = this.cartService.cart$;
    this.buildForm();
  }

  ngOnInit() {
  }

  private buildForm(){
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      // agregamos un campo como un array vacio
      address: this.formBuilder.array([])
    });
  }

  addAddressField(){
    this.addressField.push(this.createAddressField());
  }

  // este metodo agregara, al array de campos dinamicos, un formGroup con dos campos
  private createAddressField(){
    return this.formBuilder.group({
      zip: ['', Validators.required],
      text: ['', Validators.required]
    });
  }

  get addressField(){
   return this.form.get('address') as FormArray;
  }

  save(){
    console.log(this.form.value);

  }

}
