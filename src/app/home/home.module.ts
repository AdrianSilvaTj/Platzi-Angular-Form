import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerComponent } from './components/banner/banner.component';
import { HomeComponent } from './components/home/home.component';
import { ReactiveFormsModule } from '@angular/forms';

import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from './../shared/shared.module';
import { SearchComponent } from './components/search/search.component';


@NgModule({
  declarations: [
    BannerComponent,
    HomeComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    ReactiveFormsModule
  ]
})
export class HomeModule {

}
