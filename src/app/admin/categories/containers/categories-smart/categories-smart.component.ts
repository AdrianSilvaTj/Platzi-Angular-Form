import { Component } from '@angular/core';
import { Category } from 'src/app/core/models/categories.model';
import { CategoriesService } from 'src/app/services/categories.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-categories-smart',
  templateUrl: './categories-smart.component.html',
  styleUrls: ['./categories-smart.component.scss']
})
export class CategoriesSmartComponent {

  category: Category;
  catId : string;

  constructor(
    private categoriesService: CategoriesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ){}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const catId = params.get('id');
      if (catId){
        this.getCategorySel(catId);
      }
    })
  }

  createCategory(data: Partial<Category>) {
    this.categoriesService.createCategory(data)
    .subscribe(rta => {
      console.log(rta);
      this.router.navigate(['/admin/categories']);
    });
  }

  updateCategorySel(data: Partial<Category>) {
    this.categoriesService.updateCategory(this.category.id,data)
    .subscribe(rta => {
      console.log(rta);
      this.router.navigate(['/admin/categories']);
    });
  }

  /* Esta función se llama cuando se detecta un id en la url, y utiliza la función .categoriesService.getCategory(this.catId), para obtener los datos de la categoria,
  cuyo Id se ha enviado desde la url, luego con patchValue, asigna los valores obtenidos a los campos del formulario
   */
  private getCategorySel(catId:string){
    this.categoriesService.getCategory(catId)
    .subscribe((category: Category) =>{
      this.category = category;
      // this.form.patchValue(category);
      // this.nameField.clearAsyncValidators();
      // this.nameField.updateValueAndValidity();
    });
  }


}
