import { AccountService } from './../account.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private accountServce: AccountService, private router: Router, private captureReturnURL: ActivatedRoute) { }

  MyUserName: string = "";
  MyPassword: string = "";
  returnUrl: string;
  ErrorMsg: string;
  invalidLogin: boolean;
  ngOnInit(): void {


    this.returnUrl = this.captureReturnURL.snapshot.queryParams['returnUrl'] || '/';
  }


  onSubmit() {
    alert(this.MyUserName);
    alert(this.MyPassword);
    alert(this.returnUrl);
    this.accountServce.login(this.MyUserName, this.MyPassword).subscribe(res => {
      let token = res.token;
      alert(JSON.stringify(res));
      this.invalidLogin = false;
      this.router.navigateByUrl(this.returnUrl);
    }
      ,
      err => {

        this.invalidLogin = true;
        this.ErrorMsg = "Invalid UserName/Password";
        this.router.navigateByUrl(this.returnUrl);
      });
  }
}
