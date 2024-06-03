import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';


@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css']
})
export class NewCustomerComponent implements OnInit {

  constructor(private dataServie:DataService) { }

  ngOnInit(): void {
  }

  @ViewChild('addNew') addNew: any;
  addNewCustomer(customerDetails){

    this.dataServie.senCustomerData(customerDetails).subscribe(
      res =>{
      this.showSuccess('Customer Added Successfully')
        console.log('data sent');
        console.log('result',res);
      },
      err=>{
        this.showError('Error in adding customer')
        console.log("error",err)
      }
        
       )

      console.log(customerDetails);

    
     this.resetForm()

      // this.toastr.success('Customer added successfully!', 'Success'); 
      
  }

  
  resetForm() {
    this.addNew.reset();

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