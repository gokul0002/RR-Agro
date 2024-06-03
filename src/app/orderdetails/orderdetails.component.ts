import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { map } from 'rxjs';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-orderdetails',
  templateUrl: './orderdetails.component.html',
  styleUrls: ['./orderdetails.component.css']
})
export class OrderdetailsComponent implements OnInit {

  orderDetails:any
  Inputdate : any
  currentDate : any
  DBorderDetails : any
  isMobile: boolean;
  @ViewChild('new', { static: false }) el!: ElementRef;

  constructor(private datasharingService:DataService) { }

  ngOnInit(): void {

    this.checkScreenWidth()

    this.datasharingService.getProductDetails().pipe(
      map(
        res=>{
             const orderDetails = []
             for(const key in res){
              if(res.hasOwnProperty(key)){
                orderDetails.push({...res[key],id:key})
              }

       this.orderDetails = orderDetails;



  
            }
            console.log(this.orderDetails);
        }
       
      )
    ).subscribe()

 

    
    
  }

  private checkScreenWidth(): void {
    const screenWidth = window.innerWidth;
    // Set a threshold to determine if it's a mobile device
    this.isMobile = screenWidth < 400; // Adjust the threshold as needed
  }


  productDetailsArray = []
  fetchDataByDate(date) {
    console.log('user date',date);
    this.Inputdate = date;
    // console.log(this.orderDetails);
    
    const filteredDetails = this.orderDetails.filter(
      filter =>{
        console.log(filter.Date);
        
     return filter.Date === this.Inputdate
    
      }
    
     )

     this.DBorderDetails = filteredDetails
     console.log(this.DBorderDetails['productDetails']);

     

this.DBorderDetails.forEach(
  ele =>{
  //  console.log( ele.productDetails);
  console.log(ele.productDetails);
  
  this.productDetailsArray = ele.productDetails
  console.log(this.productDetailsArray);
  
   
  }
)
     
 
     console.log(this.DBorderDetails);
    
    // const result = this.orderDetails.filter(item => item.date === date);
    // console.log('filtered result',result);
    // return result;
  }

  detailsToBePrinted  = []
  generatePDF(orderDetails){
    // console.log(orderDetails);
    this.detailsToBePrinted = []
    this.detailsToBePrinted.push(orderDetails)

    console.log(this.detailsToBePrinted);
    
    
    let Adjust_scale = 0;
    const pdf = new jsPDF();
    const contentHeight = this.el.nativeElement.offsetHeight;
    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;
    const contentWidth = this.el.nativeElement.offsetWidth;
    // const contentHeight = this.el.nativeElement.offsetHeight;
    const scale = Math.min(pageWidth / contentWidth, pageHeight / contentHeight);
    Adjust_scale = scale;
            // Your condition to determine the scale value
            if (this.isMobile) {
              Adjust_scale = 0.45; // Set the scale value if the condition is true
            } else {
              Adjust_scale = scale; // Set the default scale value if the condition is false
            }
      

    pdf.html(this.el.nativeElement, {
      callback: (pdf) => {


      // Save PDF if it contains non-empty pages
              pdf.save(this.currentDate);
       
      },
      margin: [5, 5],
      x: 7,
      y: 5,
      html2canvas: {
        scale: Adjust_scale, // Adjust scale as needed
        letterRendering: true,
      },
    })
    console.log(Adjust_scale);

  }
    
}
