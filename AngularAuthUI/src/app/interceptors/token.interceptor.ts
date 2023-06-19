import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { animate } from '@angular/animations';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { TokenApiModel } from '../models/token-api.model';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth:AuthService,private toast:NgToastService,private router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken = this.auth.getToken();
    if(myToken !== null && myToken !== undefined){
      request = request.clone({
        setHeaders:{Authorization:`Bearer ${myToken}`} //"Bearer"+mytoken
      }) 
    }
    
    return next.handle(request).pipe(
      catchError((err:any)=>{
        if(err instanceof HttpErrorResponse){
          if(err.status === 401){
            // this.toast.warning({detail:"Warning",summary:"Token is Expired, Login again"});
            // this.router.navigate(['login'])
            //handle 
          return this.handleUnAuthorisedError(request,next);
          }
        }
        return throwError(()=> new Error("Some other error occured"))
      })
    );
  }
  handleUnAuthorisedError(req:HttpRequest<any>,next:HttpHandler){
    let tokenApiModel =new TokenApiModel();
    tokenApiModel.accessToken = this.auth.getToken()!;
    tokenApiModel.refreshToken=this.auth.getRefreshToken()!;
    return this.auth.renewToken(tokenApiModel).pipe(switchMap((data:TokenApiModel)=>{
      this.auth.storeRefreshToken(data.refreshToken);
      this.auth.storeToken(data.accessToken);
      req = req.clone({
        setHeaders:{Authorization:`Bearer ${data.accessToken}`} //"Bearer"+mytoken
      }) 
      return next.handle(req);
    }),
    catchError((err)=>{
      return throwError(()=>{
        this.toast.warning({detail:"Warning",summary:"Token is Expired, Login again"});
        this.router.navigate(['login'])
      })
    })
    )
  }
}
 