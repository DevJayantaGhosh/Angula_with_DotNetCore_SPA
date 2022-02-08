import { StateManagementComponent } from './state-management/state-management.component';
import { AccessDeniedComponent } from './error/access-denied/access-denied.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'a-d', component: AccessDeniedComponent },
  { path: 'state', component: StateManagementComponent },
  { path: 'product', loadChildren: () => import('./product/product.module').then(m => m.ProductModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
