import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { NewCustomerComponent } from './new-customer/new-customer.component';
// import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { OrderdetailsComponent } from './orderdetails/orderdetails.component';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


const appRoute : Routes =[
  {path: 'main', component: MainComponent},
  {path:'newcustomer', component: NewCustomerComponent},
  {path:'home',component:HomeComponent},
  {path:'orderDetails',component:OrderdetailsComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    RegistrationComponent,
    NewCustomerComponent,
    HomeComponent,
    OrderdetailsComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoute),


    // FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
