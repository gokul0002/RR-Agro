import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private https:HttpClient,private authService:AuthServiceService){}

  tokenId;

  //------------------------------CUSTOMER DATA SENDING AND RECEIVING SECTION -------------------------//
  senCustomerData(customerDeails){

    localStorage.getItem('token-id')

    this.authService.UserSub.subscribe(
      user =>{
        console.log(user);
        this.tokenId = localStorage.getItem('token-id')
      })

      return this.https.post('https://rr-agro-5154f-default-rtdb.firebaseio.com/CustomerDetails.json',customerDeails,
      {
       params: {auth: this.tokenId}
      })
  }

  getCustomerData(){
    this.authService.UserSub.subscribe(
      user =>{
        console.log(user);
        this.tokenId = localStorage.getItem('token-id')
      })

      return this.https.get('https://rr-agro-5154f-default-rtdb.firebaseio.com/CustomerDetails.json',
      {
       params: {auth: this.tokenId}
      })
  }



  // tokenId;
  receiveData(){

    this.authService.UserSub.subscribe(
      user =>{
        console.log(user);
        this.tokenId = localStorage.getItem('token-id')
      })

    console.log('clicked');

   return this.https.get('https://rr-agro-5154f-default-rtdb.firebaseio.com/data.json',
    {
      params: {auth: this.tokenId}
     }
    )
    

    
  }



  //--------------------------------PRODUCT DETAILS SENDING AND RECEIVING SECTION---------------------//

  sendProductDetails(productDetails){
    console.log(productDetails);
    

    this.authService.UserSub.subscribe(
      user =>{
        console.log(user);
        this.tokenId = localStorage.getItem('token-id')
      })

      return this.https.post('https://rr-agro-5154f-default-rtdb.firebaseio.com/ProductDetails.json',productDetails,
      {
       params: {auth: this.tokenId}
      })

  }

  
  getProductDetails(){

    this.authService.UserSub.subscribe(
      user =>{
        console.log(user);
        this.tokenId = localStorage.getItem('token-id')
      })

      return this.https.get('https://rr-agro-5154f-default-rtdb.firebaseio.com/ProductDetails.json',
      {
       params: {auth: this.tokenId}
      })

  }




                 //--------------------- BILL NO SECTION -----------------------------------------//
                 
 
 
  getBillno(){

   
    this.authService.UserSub.subscribe(
      user =>{
        console.log(user);
        this.tokenId = localStorage.getItem('token-id')
      })


   return this.https.get('https://rr-agro-5154f-default-rtdb.firebaseio.com/Billno.json',
    {
      params: {auth: this.tokenId}
     }
    )

  }

  updateBillno(updatedNumber,Uid){

     
    this.authService.UserSub.subscribe(
      user =>{
        console.log(user);
        this.tokenId = localStorage.getItem('token-id')
      })

    console.log( 'getting bill no');
    console.log('transferre uid',Uid);
  return this.https.put('https://rr-agro-5154f-default-rtdb.firebaseio.com/Billno/'+ Uid +  '.json',{
    updatedNumber
  },
    {
      params: {auth: this.tokenId}
     }
    )
  }

// sendbillno(invoicenumber){

//  let  BillNumber = {
//         Bill_number:  100
//   }

//   this.authService.UserSub.subscribe(
//     user =>{
//       console.log(user);
//       this.tokenId = localStorage.getItem('token-id')
//     })

//     return this.https.post('https://rr-agro-5154f-default-rtdb.firebaseio.com/Billno.json',BillNumber,
//     {
//      params: {auth: this.tokenId}
//     })

// }
  billNO(){

    this.authService.UserSub.subscribe(
      user =>{
        console.log(user);
        this.tokenId = localStorage.getItem('token-id')
      })


   return this.https.get('https://rr-agro-5154f-default-rtdb.firebaseio.com/billno.json',
    {
      params: {auth: this.tokenId}
     }
    )

  }

  updatebillNo(newBillno){
   
    console.log(newBillno++);
    let updatednumber = {Bill_number : newBillno++}
    console.log(updatednumber);
    
    
  this.authService.UserSub.subscribe(
    user =>{
      // console.log(user);
      this.tokenId = localStorage.getItem('token-id')
    })

    return this.https.put('https://rr-agro-5154f-default-rtdb.firebaseio.com/billno/' + '-NvzWg4wtMt7Mpuhnk00' + '.json', updatednumber,
    {
      params: {auth: this.tokenId}
     })
    

  }

  resetBillno(newBillno){
   
    // console.log(newBillno++);
    let updatednumber = {Bill_number : newBillno}
    console.log(updatednumber);
    
    
  this.authService.UserSub.subscribe(
    user =>{
      // console.log(user);
      this.tokenId = localStorage.getItem('token-id')
    })

    return this.https.put('https://rr-agro-5154f-default-rtdb.firebaseio.com/billno/' + '-NvzWg4wtMt7Mpuhnk00' + '.json', updatednumber,
    {
      params: {auth: this.tokenId}
     })
    

  }


  // sendBillNO(){

  //   let billNO={billno : 100};

  //   this.authService.UserSub.subscribe(
  //     user =>{
  //       console.log(user);
  //       this.tokenId = localStorage.getItem('token-id')
  //     })

  //     return this.https.post('https://rr-agro-5154f-default-rtdb.firebaseio.com/billno/.json',billNO,
  //     {
  //      params: {auth: this.tokenId}
  //     })

  // }


}


  

 

