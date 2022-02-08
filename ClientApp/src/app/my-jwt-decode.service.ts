import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";
import { DecodedToken } from './decoded-token';

@Injectable({
  providedIn: 'root'
})
export class MyJwtDecodeService {

  constructor() { }

  decodeTokenFromLocalStorage(): DecodedToken {

    var token: string = localStorage.getItem("TOKEN");
    alert(token);
    if (token != undefined) {

      var decoded: DecodedToken
      const token = localStorage.getItem('TOKEN');
      decoded = jwt_decode(token);
      // Check if the cookie is valid

      // Get Current Date Time
      const date = new Date(0);

      // Convert EXp Time to UTC
      let tokenExpDate = date.setUTCSeconds(decoded.exp);

      // If Value of Token time greter than 
      // if (tokenExpDate.valueOf() > new Date().valueOf()) {
      //return true;
      //}

      alert("Decoded" + JSON.stringify(decoded));
      alert(tokenExpDate.valueOf());
      console.log("NEW DATE " + new Date().valueOf());
      console.log("Token DATE " + tokenExpDate.valueOf());

      return decoded;

    } else {
      return null;
    }
  }
}
