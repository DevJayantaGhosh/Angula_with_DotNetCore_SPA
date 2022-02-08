import { DecodedToken } from './../decoded-token';
import { MyJwtDecodeService } from './../my-jwt-decode.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private jwtService: MyJwtDecodeService) { }

  ngOnInit(): void {
  }

  res: DecodedToken;
  decoder() {
    this.res = this.jwtService.decodeTokenFromLocalStorage()


  }

}
