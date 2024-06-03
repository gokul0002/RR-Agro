import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import * as jsPDF from 'jspdf';
import { DataService } from '../data.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import * as numWords from 'num-words';


// import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { trigger } from '@angular/animations';
import html2canvas from 'html2canvas';

interface BillNoResponse {
  billno: string;
}

// interface DataReport{
//   billno:string,
//   Date:string,
//   ToAddress:string
// }

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  @ViewChild('new', { static: false }) el!: ElementRef;
  @ViewChild('myForm') myForm!: NgForm;
  @ViewChild('newForm') newForm: NgForm
  @ViewChild('DriverDetailss') DriverDetailss: NgForm

  isMobile: boolean;


  newArrayForCustomerDetails: any[]
  //Binded with form inputs
  model = {

    Particular: '',
    Rate_per_kg: '',
    Quantity: '',
    Amount: '',
    Driver_Cell_No: '',
    DL_no: '',
    lorry_no: '',
    date: ''

  };

  //to show in the bill, which will be in loop
  Table_values: any = []
  Total_amount;
  Total_qty;
  Date;

  CurrentDate

  DataReport: any[] = []


  //Updated Datas

  productDetails = {
    particular: '',
    hsn: '',
    weightPerBag: '',
    quantity: '',
    amount: [],
    unitPrice: '',
    sgst: '',
    cgst: '',
    date: ''
  };
  Amount: number
  subTotal: number

  AmountArray: any[] = []
  subTotalArray: any[] = []

  DriverDetails = {
    DriveName: '',
    DriverMobile: '',
    LicenceNumber: ''
  };
  LorryDetails = {
    BrokerName: '',
    BrokerMobile: '',
    LorryNumber: ''
  };

  serialNumber: number = 1;

  DBproductDetails: any = {}

  constructor(private dataService: DataService, private renderer: Renderer2, private https: HttpClient,
    private sanitizer: DomSanitizer, private router: Router, private authService: AuthServiceService) {
    this.checkScreenWidth();

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenWidth();

  }

  //Checking screen width 
  private checkScreenWidth(): void {
    const screenWidth = window.innerWidth;
    // Set a threshold to determine if it's a mobile device
    this.isMobile = screenWidth < 400; // Adjust the threshold as needed
  }

  emailBody: SafeHtml;
  tokenId;

  Bill_no: number;
  Uid = '-Nofd8CSkegKrfYjElC5'
  currentDate: any
  unauthorised = false

  ngOnInit(): void {

    this.checkScreenWidth()
    let date = new Date();
    let formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    this.currentDate = formattedDate

    this.dataService.billNO().subscribe(
      res => {
        this.Bill_no = parseInt(res['-NvzWg4wtMt7Mpuhnk00'].Bill_number)
      },
      err=>{
        this.unauthorised = true
        this.showError('UnAuthorised! Login Again')
      }
    )

  


  }

  // @ViewChild('content', { static: false }) el!: ElementRef;
  
 //FOR GENERATING PDF
  generatePDF() {


    let Adjust_scale = 0;
    const pdf = new jsPDF.default();
    const contentHeight = this.el.nativeElement.offsetHeight;
    const contentWidth = this.el.nativeElement.offsetWidth;
    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;

    console.log(contentHeight);
    console.log(contentWidth);
    console.log(pageHeight);
    console.log(pageWidth);

    const scale = Math.min(pageWidth / contentWidth, pageHeight / contentHeight);
    Adjust_scale = scale;
    // Your condition to determine the scale value
    if (this.isMobile) {
      Adjust_scale = 0.5; // Set the scale value if the condition is true
    } else {
      Adjust_scale = 0.2; // Set the default scale value if the condition is false
    }


    const element = this.el.nativeElement;
    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;
      let position = 0;

      if (heightLeft <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, pageHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, pageHeight);
          heightLeft -= pageHeight;
        }
      }

      pdf.save('document.pdf');
    });

    //to increase bill number after, every download.
    this.dataService.updatebillNo(this.Bill_no).subscribe()

    const pdfData = pdf.output('datauristring');

    //storing data in db, to fetch that in order detail.
    this.DBproductDetails.Date = this.currentDate
    this.DBproductDetails.GrandTotal = this.grandTotal
    this.DBproductDetails.GrandTotalInWords = this.amountInwords
    this.DBproductDetails.invoiceNumber = this.Bill_no

    this.dataService.sendProductDetails(this.DBproductDetails).subscribe(
      res => {
        // console.log(res);

      },
      err=>{      
        this.showError('Download Failed! Login Again')
      }
    )

  }


  routeTonewCustomer() {
    this.router.navigate(['/newcustomer'])
  }


  //------------------------GETTING CUSTOMER DETAILS------------------------------//
  customerDetails: any[]
  FilteredCustomerDetails: any[]
  customerName: ''
  CUSTOMERDETAILSARRAY = []

  //getting customer details according to the user input field name, filtering with that name.
  getCutomerDetails() {

    this.dataService.getCustomerData().pipe(
      map(
        res => {
          const CustomerDetails = []
          for (const key in res) {
            if (res.hasOwnProperty(key)) {
              CustomerDetails.push({ ...res[key], id: key })
            }

            this.customerDetails = CustomerDetails

            //filteration process with name from input field and data from DB, if it matches, it will new array of filtered data
            const filteredCustomers = this.customerDetails.filter(customer => {
              let inputcustomerName = this.customerName.toLowerCase();
              let DBcustomerName = customer.CustomerName.toLowerCase();

              return DBcustomerName === inputcustomerName;
            });

            this.newArrayForCustomerDetails = filteredCustomers
            this.CUSTOMERDETAILSARRAY = filteredCustomers


          }
          console.log('filtered array', this.newArrayForCustomerDetails);
        }
      )
    ).subscribe( 
      res =>{
              this.showSuccess('Customer Details Added')
      },
      err=>{
        this.showError('Request Failed! Login Again')
      }
     )

  }


 

  //------------------------ PRODUCT DETAILS SECTION ------------------------------//
  PRODUCTARRAY: any = []
  DRIVERANDLORRYDETAILS = []
  grandTotal: number
  previousAmt = []
  productDetailsArray = []
  amountInwords: any
  SubmitProductDetails(productValues) {
    console.log(productValues!='');
    console.log(productValues);
    console.log(this.myForm);
    
    

   if(productValues!=''){
     //serial number should be increased after every click
     let sNO = this.serialNumber++
     productValues.serialNumber = sNO
 
     //subtotal and amount calculation
     let qty = parseInt(productValues.quantity)
     let unitPrice = parseInt(productValues.unitPrice)
     let Amount = qty * unitPrice
 
     //assigning that value to the product detail object, which will be useful to be sent to the DB
     productValues.amt = Amount
 
     //creating a separate array for previous amount, from which we can calculate the grand total easily
     this.previousAmt.push(Amount)
 
     //calculation for grand total
     let sum = this.previousAmt.reduce((total, num) => total + num, 0);
     this.grandTotal = sum
 
     //grand total in words
    //  const numWords = require('num-words')
    //  const amountInWords = numWords(sum)
    //  this.amountInwords = amountInWords
 
     //pushing the product details object to the product array, which will be shown in the table
     this.PRODUCTARRAY.push(productValues)
 
     //this is for DB 
     this.productDetailsArray.push(productValues)
     this.DBproductDetails.productDetails = this.PRODUCTARRAY;
 
     //notification
     this.showSuccess('Products added')
 
     //for resetting
    //  this.resetForm()
 
 
   } else{
    this.showError('Fill Product Details')
   }
  }

  SubmitLorryAndDriverDetails(Details) {

    //pushing to array which will be shown in table
    this.DRIVERANDLORRYDETAILS.push(Details)

    //for DB
    this.DBproductDetails.DriverDetails = Details

    //notification
    this.showSuccess('Driver Details Added')

    //to reset
    this.resetDriverAndLorryForm()


  }

  resetDriverAndLorryForm() {
    this.DriverDetailss.reset()
  }

  resetForm() {
    this.myForm.reset();

  }

  //to delete a row if the data is entered wrongly
  rownumber
  deleteRow() {

    //removing the product data with the index, getting rownumber from the input field
    this.PRODUCTARRAY.splice(this.rownumber - 1, 1)


    //for serial number calculation
    this.PRODUCTARRAY.forEach(
      (res) => {
      res.serialNumber = res.serialNumber - 1
        if (res.serialNumber == 0) {
          res.serialNumber = 1
        }
      }
    )

    //for amount calculation, if the row is removed, total amount should be decreased according to that, this is the calculation for that
    this.previousAmt.splice(this.rownumber - 1, 1)

    let sum = this.previousAmt.reduce((total, num) => total + num, 0);
    this.grandTotal = sum


    //grand total in words
    // const numWords = require('num-words')
    // const amountInWords = numWords(sum)
    // console.log(amountInWords);
    // this.amountInwords = amountInWords

    //notification message
    this.showError(this.rownumber + "nd row has been deleted")

  }


  //for resetting the invoice number a
  invoiceNumber : number
  resetInvoicenumber(){

    this.dataService.resetBillno(this.invoiceNumber).subscribe(
      (res)=>{
        console.log('new number',res);

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
