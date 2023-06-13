import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, map } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchField = new FormControl();
  result: any[]=[];

  constructor(private httpClient: HttpClient){}

  ngOnInit(){
    this.searchField.valueChanges
    // retrasa la ejecusión en 300 ms
    .pipe(debounceTime(300))
    .subscribe(value => {
      this.getData(value);
    })
  }

  private getData(query: string){
    const APIKey = 'deSprKt6DnNEAT3T1voKC7YbjXqM3N2C';
    this.httpClient.get(`http://api.giphy.com/v1/gifs/search?q=${query}&api_key=${APIKey}&limit=12`)
    .pipe(
      map((response: any) =>{
        return response.data.map((item: { images: { downsized: any; }; }) => item.images.downsized);
      })
    )
    .subscribe(data =>{
      this.result = data
    });
  }
}
