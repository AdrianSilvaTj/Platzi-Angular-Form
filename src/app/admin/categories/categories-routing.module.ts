import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';

import { CategoriesComponent } from './components/categories/categories.component';
import { CategoriesSmartComponent } from './containers/categories-smart/categories-smart.component';


const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent
  },
  {
    path: 'create',
    component: CategoriesSmartComponent
  },
  {
    path: 'edit/:id',
    component: CategoriesSmartComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule {
 }
