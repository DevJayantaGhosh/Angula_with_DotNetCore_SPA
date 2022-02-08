import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../account.service';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorInterceptor implements HttpInterceptor {

  constructor(private acc: AccountService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //add authorization Header
    alert("Interceptor start");
    let currentUser = this.acc.CurrentUserName;
    let token = localStorage.getItem("TOKEN");
    if (currentUser && token != undefined) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`

        }
      })
      alert("Interceptor add Token");
    }
    alert("Interceptor end");
    return next.handle(request);
  }
}


