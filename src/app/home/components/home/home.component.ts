import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import Swiper from 'swiper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  mySwiper: Swiper | any;

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.mySwiper = new Swiper('.swiper-container');
  }

}
