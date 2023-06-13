import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  isNew = true;

  // se ejecuta justo en el momento exacto en el que la variable @Input es recibida
  @Input()
  set category (data:Category){
    if (data){
      this.isNew = false
      this.form.patchValue(data);
    }
  }
  @Output() create= new EventEmitter();
  @Output() update= new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private angularFireStorage: AngularFireStorage,
    private categoriesService: CategoriesService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
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
      if (!this.isNew){
       this.update.emit(this.form.value);
      }else{
        this.create.emit(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
    }
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
