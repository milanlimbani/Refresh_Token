import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResetPassword } from 'src/app/models/reset-password.model';
import { ConfirmPasswordValidator } from 'src/app/helpers/confirm-password-validator';
import { ActivatedRoute, Router } from '@angular/router';
import ValidateForm from 'src/app/helpers/validateform';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  emailToReset!:string;
  emailToken!:string;
  resetPasswordObj=new ResetPassword();
constructor(private fb:FormBuilder,private router:Router,private toast:NgToastService,private activatedRoute:ActivatedRoute,private resetServices:ResetPasswordService){}
ngOnInit(): void {
  this.resetPasswordForm=this.fb.group({
    password:[null,Validators.required],
    confirmPassword:[null,Validators.required]
  },{
    validator:ConfirmPasswordValidator("password","confirmPassword")
  });
  this.activatedRoute.queryParams.subscribe(val=>{
    this.emailToReset=val['email'];
    let uriToken = val['code'];
    this.emailToken=uriToken.replace(/ /g,'+');
    //this.emailToken=val['code'];
    console.log(this.emailToken);
    console.log(this.emailToReset);
  })
}
reset() {
  if (this.resetPasswordForm.valid) {
    this.resetPasswordObj.email = this.emailToReset;
    this.resetPasswordObj.newPassword = this.resetPasswordForm.value.password;
    this.resetPasswordObj.confirmPassword = this.resetPasswordForm.value.confirmPassword;
    this.resetPasswordObj.emailToken = this.emailToken;
    this.resetServices.resetPassword(this.resetPasswordObj).subscribe({
      next: (res) => {
        this.toast.success({ detail: "SUCCESS", summary: "Password Reset Successfully", duration: 3000 });
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.toast.error({ detail: "ERROR", summary: "Oops! Something went wrong.", duration: 3000 });
        console.error(err); // Log the error to the console for debugging
      }
    });
  } else {
    ValidateForm.validateAllFormFields(this.resetPasswordForm);
  }
}

}
