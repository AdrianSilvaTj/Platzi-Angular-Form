import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Category } from '../core/models/categories.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  getAllCategories(){
    return this.http.get<Category[]>(`${environment.url_api}/categories`);
  }

  createCategoy(data: Partial<Category>){
    return this.http.post<Category>(`${environment.url_api}/categories`, data);
  }
  updateCategoy(id: string, data: Partial<Category>){
    return this.http.put<Category>(`${environment.url_api}/categories/${id}`, data);
  }

  checkNameCategory(name: string){
    return this.http.post(`${environment.url_api}/categories/availability`, {name});
  }

}
