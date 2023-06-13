import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { MyValidators } from './../../../../utils/validators';
import { ProductsService } from './../../../../core/services/products/products.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { Category } from 'src/app/core/models/categories.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {

  form: FormGroup | any;
  id: string | any;
  categories: Category[];

  constructor(
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storage: AngularFireStorage,
    private categoriesService: CategoriesService
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.getCategories();
    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
      this.productsService.getProduct(this.id)
      .subscribe(product => {
        // Seteamos los valores del formulario con los del producto obtenido
        // la categoria la seteamos con el id de la categoria obtenida, ya que category es un objeto
        this.form.patchValue(product);
        this.categoryField.setValue(product.category.id);
      });
    });

  }

  saveProduct(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      const product = this.form.value;
      console.log('*****',product);

      this.productsService.updateProduct(this.id, product)
      .subscribe((newProduct) => {
        console.log(newProduct);
        this.router.navigate(['./admin/products']);
      });
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: ['', [Validators.required]],
      title: ['', [Validators.required]],
      price: ['', [Validators.required, MyValidators.isPriceValid]],
      images: [[''],[Validators.required]],
      category: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  private getCategories(){
    this.categoriesService.getAllCategories().subscribe(categories => {
      this.categories = categories;
    });
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

  get titleField() {
    return this.form.get('title');
  }
  get priceField() {
    return this.form.get('price');
  }
  get imagesField() {
    return this.form.get('images');
  }
  get categoryField() {
    return this.form.get('category');
  }
  get descriptionField() {
    return this.form.get('description');
  }

}
