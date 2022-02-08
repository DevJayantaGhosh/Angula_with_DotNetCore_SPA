import { ProductComponent } from './product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyAuthGuard } from '../AuthService/my-auth.guard';

const routes: Routes = [
  { path: '', component: ProductComponent, canActivate: [MyAuthGuard] },
  { path: 'list', component: ProductListComponent, canActivate: [MyAuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
