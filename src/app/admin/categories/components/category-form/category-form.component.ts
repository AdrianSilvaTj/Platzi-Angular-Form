import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CategoriesService } from 'src/app/services/categories.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { MyValidators } from 'src/app/utils/validators';
import { Category } from 'src/app/core/models/categories.model';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {

  form!: FormGroup;
  catId : string;

  constructor(
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService,
    private router: Router,
    private angularFireStorage: AngularFireStorage,
    private activatedRoute: ActivatedRoute,

  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.catId = params.get('id');
      if (this.catId){
        this.getCategorySel();
      }
    })
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)], MyValidators.validateCategAll(this.categoriesService)],
      image: ['', Validators.required],
    });
  }

  get nameField() {
    return this.form.get('name');
  }

  get imageField() {
    return this.form.get('image');
  }

  save() {
    if (this.form.valid) {
      if (this.catId){
        this.updateCategorySel();
      }else{
        this.createCategory();
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  private createCategory() {
    const data = this.form.value;
    this.categoriesService.createCategory(data)
    .subscribe(rta => {
      console.log(rta);
      this.router.navigate(['/admin/categories']);
    });
  }

  /* Esta función se llama cuando se detecta un id en la url, y utiliza la función .categoriesService.getCategory(this.catId), para obtener los datos de la categoria,
  cuyo Id se ha enviado desde la url, luego con patchValue, asigna los valores obtenidos a los campos del formulario
   */
  private getCategorySel(){
    this.categoriesService.getCategory(this.catId)
    .subscribe((category: Category) =>{
      this.form.patchValue(category);
      this.nameField.clearAsyncValidators();
      this.nameField.updateValueAndValidity();
    });
  }

  private updateCategorySel() {
    const data = this.form.value;
    this.categoriesService.updateCategory(this.catId,data)
    .subscribe(rta => {
      console.log(rta);
      this.router.navigate(['/admin/categories']);
    });
  }

  uploadFile(event: any){
    // imagen seleccionada
    const image = event.target.files[0];
    // nombre con el que se va aguardar la imagen
    const name = `category-${Math.round(Math.random()*100)}.png`;
    console.log(name);

    // referencia
    const ref = this.angularFireStorage.ref(name);
    // tarea
    const task = this.angularFireStorage.upload(name, image);

    task.snapshotChanges()
    .pipe(
      finalize(() => {
        // una vez finalizada la carga obtenemos la url de la imagen que nos devuelve firebase y
        // la guardamos en el campo image del form
        const urlImage$ = ref.getDownloadURL();
        urlImage$.subscribe(url => {
          console.log(url);
          this.imageField.setValue(url);
        })
      })
    )
    .subscribe();
  }
}
