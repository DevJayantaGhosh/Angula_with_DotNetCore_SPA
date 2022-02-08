import { Product } from './product';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient, private router: Router) { }

  private products$: Observable<Product[]>;
  private productURL: string = "/api/product/productlist";

  getAllProduct(): Observable<Product[]> {
    if (!this.products$) {

      this.products$ = this.http.get<Product[]>(this.productURL).pipe(shareReplay());
    } else {
      return this.products$;
    }

  }



  clearProductCash() {
    this.products$ = null;
  }



}
