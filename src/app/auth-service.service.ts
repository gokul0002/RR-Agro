import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, retry, tap } from 'rxjs';
import { User } from './user';


interface AuthResponse{
  idToken:string,
  email:string,
  refreshToken:string,
  expiresIn:string,
  localId:string,
  registered?:boolean
}


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  
   UserSub = new BehaviorSubject(null);

  constructor(private https:HttpClient) { }

  singup(email,password){
   return  this.https.post <AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key= AIzaSyDBZU6vStwNlVbQ_ys5Asq6tt0I8kMibNc',{email,password, returnSecureToken:true}).pipe(tap(
    res=>{
      const expiresDate = new Date( new Date().getTime() + +res.expiresIn)
      const user = new User(res.email,res.localId,res.idToken,expiresDate)
    })
   )
  
  }

login(email,password){
   return  this.https.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDBZU6vStwNlVbQ_ys5Asq6tt0I8kMibNc',{email,password, returnSecureToken:true}).pipe(tap(
    res=>{
      const expiresDate = new Date( new Date().getTime() + +res.expiresIn)
      const user = new User(res.email,res.localId,res.idToken,expiresDate)
      localStorage.setItem('token-id',user.Token)
      // console.log(localStorage.getItem('token-id'));
      
   
     this.UserSub.next(user)
    })
   )
  

    // this.https.post('https://rr-agro-5154f-default-rtdb.firebaseio.com/')
  }


}

