import { RegisterResponse } from './../ModelDTO/RegisterResponseModel';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private accountServce: AccountService, private router: Router, private captureReturnURL: ActivatedRoute) { }

  MyUserName: string = "";
  MyPassword: string = "";
  MyEmail: string = "";
  returnUrl: string;
  ErrorMsg: string;

  ngOnInit(): void {
  }

errorArray : Array<any>=[];
  Register() {

    this.accountServce.register(this.MyUserName, this.MyPassword, this.MyEmail)
      .subscribe(res => {
        alert("Congratulation!!");
        this.router.navigateByUrl("/login");
      },
        err => {
          alert(JSON.stringify(err));

          this.errorArray=[];
          for(var i =0;i<err.error.value.length;i++){
            this.errorArray.push(err.error.value[i]);
          }
        });
  }
}
