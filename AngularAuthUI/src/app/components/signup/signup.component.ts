import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup,Validators,FormControl} from '@angular/forms';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  signUpForm!:FormGroup;
  constructor(private fb:FormBuilder,private toast:NgToastService,private AuthService:AuthService,private router:Router) {}
  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstname:['',Validators.required],
      lastname:['',Validators.required],
      email:['',Validators.required],
      username:['',Validators.required],
      password:['',Validators.required]

    });
  }
  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }
  onSignup(){
    if(this.signUpForm.valid)
    {
      //perform logic for signup
      this.AuthService.signUp(this.signUpForm.value).subscribe({
        next:(res=>{
         // alert(res.message);
          this.signUpForm.reset();
          this.toast.success({detail:"SUCCESS",summary:res.message,duration:5000})
          this.router.navigate(['login']);
        }),
        error:(err=>{
          this.toast.error({detail:"ERROR",summary:"Something when wrong!",duration: 5000})

          // alert(err?.error.message)
        })
      });
      console.log(this.signUpForm.value);
    }else{
       //logic throwing error
      ValidateForm.validateAllFormFields(this.signUpForm);
    }
  }

}
