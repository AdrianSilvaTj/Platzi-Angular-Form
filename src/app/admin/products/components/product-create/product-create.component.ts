import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { finalize } from 'rxjs/operators';

import { MyValidators } from './../../../../utils/validators';
import { ProductsService } from './../../../../core/services/products/products.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { Category } from 'src/app/core/models/categories.model';


import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss'],
})
export class ProductCreateComponent implements OnInit {
  form: FormGroup | any;
  categories: Category[];

  constructor(
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private router: Router,
    private storage: AngularFireStorage,
    private categoriesService: CategoriesService
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.getCategories();
  }

  saveProduct(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      const product = this.form.value;
      console.log(product);

      this.productsService.createProduct(product).subscribe((newProduct) => {
        console.log(newProduct);
        this.router.navigate(['./admin/products']);
      });
    }
  }

  uploadFile(event: any){
    // imagen seleccionada
    const image = event.target.files[0];
    // nombre con el que se va aguardar la imagen
    const name = `product-${Math.round(Math.random()*100)}.png`;
    console.log(name);

    // referencia
    const ref = this.storage.ref(name);
    // tarea
    const task = this.storage.upload(name, image);

    task.snapshotChanges()
    .pipe(
      finalize(() => {
        // una vez finalizada la carga obtenemos la url de la imagen que nos devuelve firebase y
        // la guardamos en el campo image del form
        const urlImage$ = ref.getDownloadURL();
        urlImage$.subscribe(url => {
          console.log(url);
          this.imagesField.setValue([url]);
        })
      })
    )
    .subscribe();
  }

  private getCategories(){
    this.categoriesService.getAllCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required,Validators.minLength(2)]],
      price: ['', [Validators.required, MyValidators.isPriceValid]],
      images: [[''],[Validators.required]],
      categoryId: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  get titleField() {
    return this.form.get('title');
  }
  get priceField() {
    return this.form.get('price');
  }
  get imagesField() {
    return this.form.get('images');
  }
  get categoryIdField() {
    return this.form.get('categoryId');
  }
  get descriptionField() {
    return this.form.get('description');
  }
}
