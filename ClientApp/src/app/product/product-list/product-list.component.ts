import { Observable } from 'rxjs';
import { AccountService } from './../../account.service';
import { ProductService } from './../../product.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  constructor(private prod: ProductService, private acc: AccountService) { }

  ngOnInit(): void {

    this.MyLoginStatus = this.acc.IsLoggedIn;
    this.MyUserName = this.acc.CurrentUserName;
    this.MyRole = this.acc.CurrentUserRoleName;

    alert(JSON.stringify(this.MyLoginStatus));
    alert(JSON.stringify(this.MyUserName));
    alert(JSON.stringify(this.MyRole));

    this.getAllProd();
  }


  prodList: Product[];

  MyLoginStatus: Observable<boolean>;
  MyUserName: Observable<string>;
  MyRole: Observable<string>;

  getAllProd() {
    this.prod.getAllProduct().subscribe(res => {
      alert(JSON.stringify(res));
      this.prodList = res;
    },
      err => {
        alert(JSON.stringify(err));
      })
  }

}
