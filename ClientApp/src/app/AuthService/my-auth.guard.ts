import { AccountService } from './../account.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MyAuthGuard implements CanActivate {

  finalStatus: boolean = false;
  constructor(private acct: AccountService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    alert("authGardCalling---");
    this.acct.IsLoggedIn.subscribe(res => {
      alert("authGardCalling finalStatus---" + this.finalStatus);
      this.finalStatus = res;
    });
    return this.finalStatus;
    /*this.acct.IsLoggedIn.pipe(
      take(1),
      map((loginStatus: boolean) => {
        const destination: string = state.url;

        alert("Login status in AuthGuard-->" + loginStatus);
        //if user is not loggedin 
        // To check if user is not logged in
        if (!loginStatus) {
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });

          return false;
        }
        //if use is already loggedin check role
        switch (destination) {
          case '/':
          case '/product': {
            if (localStorage.getItem("ROLE") === "Customer" || localStorage.getItem("ROLE") === "Admin") {
              return true;
            }
          }
          case '/product/list': {
            if (localStorage.getItem("ROLE") === "Admin") {

              return true;
            } else {
              this.router.navigate(['/a-d']);
              return false;
            }
          }
          default:
            return false;
        }


        return false;
      })
    );*/

  }

}
