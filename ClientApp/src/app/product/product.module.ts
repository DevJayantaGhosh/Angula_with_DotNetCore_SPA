import { AccountService } from './../account.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { MyAuthGuard } from '../AuthService/my-auth.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptorInterceptor } from '../MyInterceptor/jwt-interceptor.interceptor';


@NgModule({
  declarations: [ProductListComponent],
  imports: [
    CommonModule,
    ProductRoutingModule
  ],
  providers: [MyAuthGuard,
    AccountService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true }
  ]
})
export class ProductModule { }
