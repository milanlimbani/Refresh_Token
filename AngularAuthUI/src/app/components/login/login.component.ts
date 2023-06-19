import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup,Validators,FormControl} from '@angular/forms';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { UserStoreService } from '../../services/user-store.service';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  fullName: string | null = null;
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  loginform!:FormGroup;
  public resetPasswordEmail!:string;
  public isValidEmail!:boolean;
  constructor(private resetService:ResetPasswordService,private UserStore:UserStoreService,private fb:FormBuilder,private toast:NgToastService,private auth:AuthService,private router:Router) {
   
  }
  ngOnInit(): void {
    this.UserStore.getfullNameFromStore().subscribe((fullName) => {
      this.fullName = fullName;
    });
    this.loginform=this.fb.group({
      username:['',Validators.required],
      password:['',Validators.required]
    })
  }
  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }
  onLogin() {
    if (this.loginform.valid) {
      console.log(this.loginform.value);
      this.auth.login(this.loginform.value).subscribe({
        next: (res) => {
          this.loginform.reset();
          this.auth.storeToken(res.accessToken);
          this.auth.storeRefreshToken(res.refreshToken);
          const tokenPayload = this.auth.decodedToken();
          this.UserStore.setFullNameFromStore(tokenPayload.unique_name);
          this.UserStore.setRoleStore(tokenPayload.role);
          this.toast.success({detail:"SUCCESS",summary:res.message,duration:5000})
          this.router.navigate(['dashboard']);
        },
        error: (err) => {
          this.toast.error({detail:"ERROR",summary:"Something when wrong!",duration: 5000})

         // alert(err?.error.message);
        },
      });
    } else {
      ValidateForm.validateAllFormFields(this.loginform);
    }
  }
  checkValidationEmail(event:string){
    const value=event;
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isValidEmail=pattern.test(value);
    return this.isValidEmail;
  }
  ConfirmToSend(){
    if(this.checkValidationEmail(this.resetPasswordEmail)){
      console.log(this.resetPasswordEmail);
      //API call to be done
      this.resetService.sendResetPasswordLink(this.resetPasswordEmail).subscribe(
        {
          next:(res)=>{
            this.toast.success({
              detail:'Success',
              summary:'Reset Success!',
              duration:3000,
            });
            this.resetPasswordEmail="";
            const buttonRef = document.getElementById("closeBtn");
            buttonRef?.click();
          },
          error:(err)=>{
            this.toast.error({
              detail:'ERROR',
              summary:'Something went wrong!',
              duration:3000,
            });
          }
        }
      )
    }
  }
  
  // private validateAllFormFields(formgroup:FormGroup){
  //   Object.keys(formgroup.controls).forEach(field=>{
  //     const control = formgroup.get(field);
  //     if(control instanceof FormControl){
  //       control.markAsDirty({onlySelf:true})
  //     }else if(control instanceof FormGroup){
  //       this.validateAllFormFields(control)
  //     }
  //   })
  // }
}
