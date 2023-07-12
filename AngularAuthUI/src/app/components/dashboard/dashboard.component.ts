import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  public users:any=[];
  public fullName:string="";
  public role!:string;
constructor(private auth:AuthService,private api:ApiService,private userStore:UserStoreService){

}
  ngOnInit(): void {
    this.api.getUsers().subscribe(res=>{
      this.users=res;
      console.log(res);
    });
    this.userStore.getfullNameFromStore().subscribe(val=>{
      let fullNameFromToken=this.auth.getfullNameFromToken();
      this.fullName=val || fullNameFromToken
    });
    this.userStore.getRoleFromStore().subscribe(val=>{
      const roleFromToken = this.auth.getRoleFromToken();
      this.role =val || roleFromToken;
    })
  }
  logOut()
  {
    this.auth.signOut();
  }
}
