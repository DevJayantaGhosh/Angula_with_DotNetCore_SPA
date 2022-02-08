import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private accountServce: AccountService, private router: Router, private captureReturnURL: ActivatedRoute) { }

  ngOnInit(): void {
    //this.accountServce.publicGetterMethod
    this.loginStatus$ = this.accountServce.IsLoggedIn;
    this.UserName$ = this.accountServce.CurrentUserName;
    this.Role$ = this.accountServce.CurrentUserRoleName;
  }

  loginStatus$: Observable<boolean>;
  UserName$: Observable<string>;
  Role$: Observable<string>;
  logout() {
    let flag: boolean;
    this.loginStatus$.subscribe(x => {
      flag = x;
    });
    alert(flag);
    if (flag) {
      this.accountServce.logout();
    } else {
      alert("you are not Login");
    }
  }

}
