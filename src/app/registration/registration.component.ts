import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';

interface AuthResponse{
  idToke:string,
  email:string,
  refreshToken:string,
  expiresIn:string,
  localId:string
}
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent  {

  // AIzaSyDBZU6vStwNlVbQ_ys5Asq6tt0I8kMibNc
  title = 'bill_app';

  constructor(private https:HttpClient,private dataService:DataService,private authService:AuthServiceService,private router: Router){}

  username: string = '';
  password: string = '';



  IsLoggedIn=true;
  IsSignedUp=false;

  signup(formValue) {

    this.authService.singup(formValue.username,formValue.password).subscribe(
      res=>{
        console.log( 'res', res);
        
      },
      err=>{
        console.log(err);


        
      }
    )
    this.IsLoggedIn = false;
     this.IsSignedUp= true;


  }

  login(formValue) {  

    console.log('logged in  successfully')
    console.log(formValue);

    this.authService.login(formValue.username,formValue.password).subscribe(
      res=>{
        console.log( 'res', res);
        this.showSuccess('logged in successfully')
        this.router.navigate(['/home'])     
      },
      err=>{
        console.log(err);
        this.showError('Invalid credentials')
        
      }
    )

 

    }


     //NOTIFICATION SECTION
  isVisible: boolean = false;
  message: string
  isSucess: boolean
  showSuccess(message: string) {
    this.isVisible = true
    this.isSucess = true

    this.message = message
    setTimeout(() => {
      this.isVisible = false
    }, 3000);

  }

  showError(message: string) {
    this.isVisible = true
    this.isSucess = false

    this.message = message
    setTimeout(() => {
      this.isVisible = false
    }, 3000);
  }
}
