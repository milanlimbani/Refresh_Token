import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  getFullNameFromStore(): string {
    throw new Error('Method not implemented.');
  }
private fullName$ = new BehaviorSubject<string>("");
private role$ = new BehaviorSubject<string>("");
  constructor() { }
  public getRoleFromStore(){
    return this.role$.asObservable();
  }
  public setRoleStore(role:string){
    this.role$.next(role);
  }
  public getfullNameFromStore(){
  return this.fullName$.asObservable();
  }
  public setFullNameFromStore(unique_name:string){
    this.fullName$.next(unique_name);
  }
  
}
