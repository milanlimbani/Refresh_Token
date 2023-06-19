import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Route, Router } from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt'
import { TokenApiModel } from '../models/token-api.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
private baseUrl:string="https://localhost:44386/api/User/"
private userPayload:any;
  constructor(private http:HttpClient,private router:Router) {
    this.userPayload=this.decodedToken();
   }
  signUp(userObj:any){
     return this.http.post<any>(`${this.baseUrl}register`,userObj)
  }
  login(loginObj:any){
    return this.http.post<any>(`${this.baseUrl}authenticate`,loginObj)
  }
  storeToken(tokenValue:string){
    localStorage.setItem('token',tokenValue)
  }
  getToken(){
   return localStorage.getItem('token')
  }
  isLoggedIn():boolean{
    return !!localStorage.getItem('token')
  }
  signOut(){
    localStorage.clear();
    // localStorage.removeItem('token')
    this.router.navigate(['login'])
  }
  decodedToken(){
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    console.log(jwtHelper.decodeToken(token));  
    return jwtHelper.decodeToken(token);
  }
  getfullNameFromToken(){
    if(this.userPayload)
    return this.userPayload.unique_name;

  }
  getRoleFromToken(){
    if(this.userPayload)
    return this.userPayload.role;
  }
  storeRefreshToken(tokenValue:string){
    localStorage.setItem('refreshToken',tokenValue)
  }
  getRefreshToken(){
    return localStorage.getItem('refreshToken');
  }
  renewToken(tokenApi:TokenApiModel){
    return  this.http.post<any>(`${this.baseUrl}refresh`,tokenApi)
  }
}
