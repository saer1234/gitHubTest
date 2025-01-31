
import { Injectable } from '@angular/core';
import { LOCATION } from '../staticContent';
import { HttpClient, HttpHandler, HttpXhrBackend } from '@angular/common/http';
import { Router } from '@angular/router';
export interface loginUser{
  username:string;
  password:string;
}
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private static readonly Tokens:string="login";
  https: HttpClient= new HttpClient(new HttpXhrBackend({build:()=> new XMLHttpRequest()}));
  constructor() { 

  }
  checkLogin(data:loginUser){
        return this.https.get(LOCATION[0].Logincheck+"/"+data.username+"/"+data.password);
  }
  static Token():string{
    return this.Tokens;
  }
  checkToken():boolean{
    if(localStorage.getItem(LoginService.Tokens)){
      return true;
    }else{
      return false;
    }
  }
  logoutFn(){
    localStorage.clear();
    let routes = new Router();
    if(!this.checkToken())
      routes.navigate(["/"]);
  }
}
