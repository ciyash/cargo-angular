import { Component,OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core'
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
import { TokenService } from 'src/app/service/token.service';
import { HeaderComponent } from "../../USER/header/header.component";
import { AdminService } from 'src/app/service/admin.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
declare const SlimSelect: any; 
import {  ElementRef, ViewChild, AfterViewInit } from '@angular/core';



@Component({
  selector: 'app-parcelbooking',
  templateUrl: './parcelbooking.component.html',
  styleUrls: ['./parcelbooking.component.scss'],
})
export class ParcelbookingComponent {
  adminData: any;
  form!:FormGroup;
  showTable: boolean = false;
  id:any;
  citydata:any;
  branchdata:any;
  bdata: any[] = [];
  totalPrice:any;
  total1:any;
  pfdata:any;
  bookingSuccess: boolean = false;
  gdata:any;
  packdata:any;
  fbcdata:any;
  tbcdata:any;
  pdata:any;
  form1:FormGroup;
  sdata: number = 0;
  searchTerm: string = '';       // For binding with input field
  searchResult: any[] = [];
  idselectmsg: string = '';
  regname: any[] = [];
  errorMessage: string = '';
  userList: any[] = [];
  showDropdown:boolean=true;
  dptype:any;
  @ViewChild('selectElem') selectElem!: ElementRef;
  cdata: any;
  grnNo: any;
  grnnumber: any;

  // @ViewChild('demoSelect') demoSelect!: ElementRef;
  // ngAfterViewInit(): void {
  //   new SlimSelect({
  //     select: this.demoSelect.nativeElement
  //   });

  //   setTimeout(() => {
  //     $(this.selectElem.nativeElement).select2(); 
  //   }, 0);
  //   setTimeout(() => {
  //     $(this.selectElem2.nativeElement).select2(); 
  //   }, 0);
  //   setTimeout(() => {
  //     $(this.bookingtype.nativeElement).select2(); 
  //   }, 0);
  //   setTimeout(() => {
  //     $(this.droupbranch.nativeElement).select2(); 
  //   }, 0);
  //   setTimeout(() => {
  //     $(this.pickupbranch.nativeElement).select2(); 
  //   }, 0);
  //   setTimeout(() => {
  //     $(this.dispatchtype.nativeElement).select2(); 
  //   }, 0);
  
  // }



  constructor(private fb: FormBuilder, private api: BranchService, private token:TokenService,
     private cdr: ChangeDetectorRef,  private route: ActivatedRoute,private toastr:ToastrService, 
     private router:Router, private admin:AdminService) {
    this.form = this.fb.group({
      fromCity: [''],
      toCity: ['', Validators.required],
      pickUpBranch: ['', Validators.required],
      dropBranch: ['', Validators.required],
      dispatchType: ['', Validators.required],
      bookingType: ['', Validators.required],
      senderName: ['', Validators.required],
      senderMobile: ['', Validators.required],
      senderAddress: ['', Validators.required],
      senderGST: [''],
      receiverName: [''],
      receiverMobile: [''],
      receiverAddress: [''],
      receiverGst: [''],
      serviceCharges: [0],  // ₹10 per item
      hamaliCharges: [0],
      doorDeliveryCharges: [0],
      doorPickupCharges: [0],
      valueOfGoods: [0],
      grandTotal: [0],
      packages: this.fb.array([]),
        });
     
        this.form1 = this.fb.group({
          fromCity: [''],
          toCity: ['', Validators.required],
            });

   }

  ngOnInit() {
    // const id = this.activate.snapshot.paramMap.get('id');
    this.api.GetCities().subscribe((res:any)=>{
      console.log('citys',res);
      this.citydata=res;
      console.log(this.citydata,"ldjknzjdfnsdnfsidfnsidjf")
    });
    //get branches
    this.api.GetBranch().subscribe((res:any)=>{
      console.log(res);
      this.branchdata=res;
      
    });
    //get Packages
    this.api.GetPAckagesType().subscribe((res:any)=>{
      console.log(res);
      this.packdata=res;
    });

    this.admin.GetDispatchtypeData().subscribe((res:any)=>{
      console.log(res);
      this.dptype=res;
    });

    this.getProfileData();
    this.addOrderItem()

  }

  
  ngAfterViewInit(): void {
    setTimeout(() => {
      $(this.selectElem.nativeElement).select2();

      $(this.selectElem.nativeElement).on('select2:select', (event: any) => {
        const selectedCity = event.params.data.id;  // Gets selected value
        console.log('Selected City:', selectedCity);

        this.form.patchValue({ fromCity: selectedCity });  // ✅ Manually update the form
        console.log('Updated form value:', this.form.value);

        this.onFromcitySelect({ target: { value: selectedCity } });  // Trigger API call
      });
    }, 0);
  }
 
  
    
getProfileData(){
  this.api.GetProfileData().subscribe((res:any)=>{
    console.log('profile',res);
    this.pfdata=res.branchId;
    console.log(this.pfdata,"branchid")
  });
}

fetchServiceCharges() {
  const fromCity = this.form.get('fromCity')?.value;
  const toCity = this.form.get('toCity')?.value;

  if (fromCity && toCity) {
    this.api.FilterBookingServiceCharges({ fromCity, toCity }).subscribe(
      (res: any) => {
        console.log('Service Charges:', res);

        if (res && res.length > 0) {
          const chargeData = res[0]; // First item in the array
          this.sdata = chargeData.serviceCharge || 0;

          // Update form with service charges and recalculate total
          this.form.patchValue({ serviceCharges: this.sdata });
          this.calculateGrandTotal();
        } else {
          console.warn('No service charge found for the given cities.');
          this.form.patchValue({ serviceCharges: 0 });
          this.calculateGrandTotal();
        }
      },
      (error: any) => {
        console.error('Error fetching service charges:', error);
      }
    );
  } else {
    console.warn('Both fromCity and toCity must be selected.');
  }
}



onFromcitySelect(event: any) {
  const cityName = event.target.value;
  if (cityName) {
    this.api.GetBranchbyCity(cityName).subscribe(
      (res: any) => {
        console.log('Branches for selected city:', res);
        this.pdata = res;
        this.fetchServiceCharges();
      },
      (error: any) => {
        console.error('Error fetching branches:', error);
      }
    );
  } else {
    this.pdata = [];
  }
}


onTocitySelect(event: any) {
  console.log('Event triggered:', event);
  console.log('Selected City:', event.target.value);
  const cityName = event.target.value;
  if (cityName) {
    this.api.GetBranchbyCity(cityName).subscribe(
      (res: any) => {
        console.log('Branches for selected city:', res);

        this.tbcdata = res;
        this.fetchServiceCharges(); // Fetch service charges
       
      },
      (error: any) => {
        console.error('Error fetching branches:', error);
      }
    );
  } else {
    this.tbcdata = [];
  }
  
}



  get packages(): FormArray {
    return this.form.get('packages') as FormArray;
  }

  addOrderItem() {
    this.packages.push(
      this.fb.group({
        quantity: [1, Validators.required],
        packageType: ['', Validators.required],
        contains: ['', Validators.required],
        weight: [0, Validators.required],
        unitPrice: [0, Validators.required],
        totalPrice: [0],
      })
    );
    this.calculateGrandTotal();
  }

  removeBarcodeData(index: number) {
    this.packages.removeAt(index);
    this.calculateGrandTotal();
  }

  calculateTotal(index: number) {
    const packageArray = this.form.get('packages') as FormArray;
    const packageForm = packageArray.at(index);
  
    const quantity = packageForm.get('quantity')?.value || 0;
    const unitPrice = packageForm.get('unitPrice')?.value || 0;
    
    const totalPrice = quantity * unitPrice;
    packageForm.get('totalPrice')?.setValue(totalPrice);
  
    this.calculateGrandTotal();
  }

  calculateGrandTotal() {
    const packageArray = this.form.get('packages') as FormArray;
    
    // Calculate total price from all packages
    let totalValue = 0;
    packageArray.controls.forEach((pkg) => {
      totalValue += pkg.get('totalPrice')?.value || 0;
    });
  
    // Get charges from form inputs
    const serviceCharges = this.form.get('serviceCharges')?.value || 0;
    const hamaliCharges = this.form.get('hamaliCharges')?.value || 0;
    const doorDeliveryCharges = this.form.get('doorDeliveryCharges')?.value || 0;
    const doorPickupCharges = this.form.get('doorPickupCharges')?.value || 0;
    // const valueOfGoods = this.form.get('valueOfGoods')?.value || 0;
  
    // Calculate Grand Total
    const grandTotal = totalValue + serviceCharges + hamaliCharges + doorDeliveryCharges + doorPickupCharges ;
  
    // Update Grand Total without triggering another event
    this.form.get('grandTotal')?.setValue(grandTotal, { emitEvent: false });
  }

  
  add() {
    console.log("Form Data Before Submission:", this.form.value);
    if (this.form.valid) {
      const orderDataToSend = this.packages.value.map((item: any) => ({
        quantity: item.quantity,
        packageType: item.packageType,
        contains: item.contains,
        weight: item.weight,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice
      }));

      const val: any = {
        fromCity: this.form.value.fromCity,
        toCity: this.form.value.toCity,
        pickUpBranch: this.form.value.pickUpBranch,
        dropBranch: this.form.value.dropBranch,
        dispatchType: this.form.value.dispatchType,
        bookingType: this.form.value.bookingType,
        senderName: this.form.value.senderName,
        senderMobile: this.form.value.senderMobile,
        senderAddress: this.form.value.senderAddress,
        senderGst: this.form.value.senderGST,
        receiverName: this.form.value.receiverName,
        receiverMobile: this.form.value.receiverMobile,
        receiverAddress: this.form.value.receiverAddress,
        receiverGst: this.form.value.receiverGST,
        packages: orderDataToSend,
        serviceCharges: this.form.value.serviceCharges,
        hamaliCharges: this.form.value.hamaliCharges,
        doorDeliveryCharges: this.form.value.doorDeliveryCharges,
        doorPickupCharges: this.form.value.doorPickupCharges,
        valueOfGoods: this.form.value.valueOfGoods,
        grandTotal: this.form.value.grandTotal
      };
  
      console.log("Final Data to Submit:", val);
      // ✅ Call API to save data
      this.api.createBooking(val).subscribe(
        (response: any) => {
          console.log("Parcel saved successfully:", response);
      
          if (response && response.data && response.data.grnNo) { 
            this.gdata = response.data;
            console.log("grnNumber:", this.gdata.grnNo);
            this.toastr.success("Parcel Booked Successfully", "Success");
            this.router.navigateByUrl(`/printgrn/${this.gdata.grnNo}`); 
          } else {
            console.error("❌ Error: grnNo not found in response.");
            this.toastr.error("Booking successful, but grnNo is missing.", "Warning");
          }
        },
        (error) => {
          console.error("❌ Error saving order:", error);
          this.toastr.error("Failed to book the parcel. Please try again.", "Error");
        }
      );
      
      }
  }
  
  searchUser(): void {
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      this.api.searchUser(this.searchTerm.trim()).subscribe(
        (res: any) => {
          console.log('API Response:', res);
          
          // Check if data is available
          if (res && res && Array.isArray(res) && res.length > 0) {
            this.userList = res;  // Store the list of users for dropdown
            this.showDropdown = true; // Show dropdown suggestions
            this.errorMessage = '';
          } else {
            this.userList = [];
            this.showDropdown = false;
            this.errorMessage = 'No results found for the given search term.';
          }
        },
        (err: any) => {
          this.userList = [];
          this.showDropdown = false;
          this.errorMessage = err.error?.message || 'An error occurred while searching.';
        }
      );
    } else {
      this.userList = [];
      this.showDropdown = false;
      this.errorMessage = 'Please enter a valid search term.';
    }
  }

  selectUser(user: any): void {
    this.searchTerm = user.name; // Set selected name in input
    this.form.patchValue({
      senderMobile: user.phone,
      senderAddress: user.address,
      senderGST: user.gst
    });
    this.showDropdown = false; // Hide dropdown after selection
  }
  
  hideDropdown(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200); // Delay to allow click event on dropdown items
  }
  
  
  toggleSameAsSender(event: any) {
    if (event.target.checked) {
      this.form.patchValue({
        receiverName: this.form.value.senderName,
        receiverMobile: this.form.value.senderMobile,
        receiverAddress: this.form.value.senderAddress,
        receiverGST: this.form.value.senderGST,
      });
    } else {
      this.form.patchValue({
        receiverName: '',
        receiverMobile: '',
        receiverAddress: '',
        receiverGST: '',
      });
    }
  }



}