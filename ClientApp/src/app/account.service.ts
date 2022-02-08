import { DecodedToken } from './decoded-token';
import { RegisterResponse } from './ModelDTO/RegisterResponseModel';
import { Router, RouterModule } from '@angular/router';
import { LoginResponse } from './ModelDTO/LoginResponse';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient, private router: Router) { }

  private baseLoginURL: string = "/api/account/Userlogin";
  private baseRegisterURL: string = "/api/account/Register"
  // private LoginStatus: Observable<boolean>; this need subscription not emit
  private _LoginStatus = new BehaviorSubject<boolean>(this.checkLoginStatusBasedOnLocalStorage());
  private _UserName = new BehaviorSubject<string>(localStorage.getItem("USERNAME"));
  private _UserRole = new BehaviorSubject<string>(localStorage.getItem("ROLE"));


  public get IsLoggedIn() {
    return this._LoginStatus.asObservable();
  }
  public get CurrentUserName() {
    return this._UserName.asObservable();
  }

  public get CurrentUserRoleName() {
    return this._UserRole.asObservable();
  }


  login(username: string, password: string) {
    return this.http.post<LoginResponse>(this.baseLoginURL, { username, password }).pipe(
      //we can use fun1(),fun2(),fun3()
      //converting the single object into array with the k-v pair
      map(res => {
        if (res != null && res.token != null) {


          //validate store in localstorage
          localStorage.setItem("LOGINSTATUS", "1");
          localStorage.setItem("TOKEN", res.token)
          localStorage.setItem("USERNAME", res.username.toString())
          localStorage.setItem("ROLE", res.role)
          localStorage.setItem("EXPIRE", res.validTo.toString())
          //emit by privateBehavierSubject.next(currentValue)
          this._LoginStatus.next(true);
          this._UserName.next(localStorage.getItem("USERNAME"));
          this._UserRole.next(localStorage.getItem("ROLE"));
        }
        return res;
      })
    );
  }


  logout() {
    //remove  store from localstorage

    alert("Logout Callig")
    localStorage.removeItem("LOGINSTATUS");
    localStorage.removeItem("TOKEN")
    localStorage.removeItem("USERNAME")
    localStorage.removeItem("ROLE")
    localStorage.removeItem("EXPIRE")
    //next(recentValue) 
    this._LoginStatus.next(false);
    this._UserName.next("");
    this._UserRole.next("");

    this.router.navigate(['/logout']);
  }








  checkLoginStatusBasedOnLocalStorage(): boolean {
    alert("checkLoginStatusBasedOnLocalStorage Start");
    var loginCookie = localStorage.getItem("LOGINSTATUS");

    if (loginCookie == "1") {

      alert("Enter logCookie")
      if (localStorage.getItem('TOKEN') === null || localStorage.getItem('TOKEN') === undefined) {
        alert("calling logout as Token null in checkLoginStatusBasedOnLocalStorage method")
        this.logout();
        return false;
      }

      // Get and Decode the Token
      const token = localStorage.getItem('TOKEN');
      var decoded: DecodedToken
      decoded = jwt_decode(token);
      // Check if the cookie is valid

      if (decoded.exp === undefined) {
        alert("calling logout as date expire in checkLoginStatusBasedOnLocalStorage method")
        this.logout();
        return false;
      }

      // Get Current Date Time
      const date = new Date(0);

      // Convert EXp Time to UTC
      let tokenExpDate = date.setUTCSeconds(decoded.exp);

      // If Value of Token time greter than 

      if (tokenExpDate.valueOf() > new Date().valueOf()) {
        return true;
      }

      alert(tokenExpDate.valueOf() - new Date().valueOf());
      alert("checkLoginStatusBasedOnLocalStorage End");
      console.log("NEW DATE " + new Date().valueOf());
      console.log("Token DATE " + tokenExpDate.valueOf());

      return false;

    }
    return false;
  }











  register(username: string, password: string, email: string) {

    return this.http.post<RegisterResponse>(this.baseRegisterURL, { username, password, email })
      .pipe(
        map(res => {
          return res;
        })
      )
  }

}
