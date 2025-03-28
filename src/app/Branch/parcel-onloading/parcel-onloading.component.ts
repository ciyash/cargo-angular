import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BranchService } from 'src/app/service/branch.service';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-parcel-onloading',
  templateUrl: './parcel-onloading.component.html',
  styleUrls: ['./parcel-onloading.component.scss']
})
export class ParcelOnloadingComponent {

   adminData: any;
    form!: FormGroup;
    form1:FormGroup;
    cities:any;
    vehicle: any = {}; 
    branchdata:any;
    data:any;
    searchTerm: string = '';       // For binding with input field
    idselectmsg: string = '';
    errorMessage: string = '';
    data2:any;
    data1:any;
    LoadSuccess: boolean = false;
    allSelected: boolean = false;
    tbcdata:any;
    constructor(private api: BranchService, private fb: FormBuilder, private messageService:MessageService, private router:Router, private activeroute:ActivatedRoute) {
        this.form = this.fb.group({
          fromDate: ['', Validators.required],
          toDate: ['', Validators.required],
          fromCity: this.fb.array([], Validators.required),
          toCity: ['', Validators.required],
          vehicalNumber: ['', Validators.required],
          branch: ['', Validators.required],
        });
  
        this.form1 = this.fb.group({
          fromBookingDate: ['', Validators.required],
          toBookingDate: ['', Validators.required],
          fromCity: this.fb.array([], Validators.required),
          toCity: ['', Validators.required],
          branch: ['', Validators.required],
          vehicleNo: ['', Validators.required],
          grnNo: this.fb.array([], Validators.required), // ✅ FormArray for GRN numbers
          bookingType: ['Topay'],
        });
        
        
      
    }
    ngOnInit() {
      this.searchTerm = this.activeroute.snapshot.params['grnNumber'];
      this.getCities();
      this. getvehicleData();
      this.branchData();
      this.branchData();
    }
  
    
    getCities() {
      this.api.GetCities().subscribe({
        next: (response: any) => {
          console.log('Cities data:', response);
          this.cities = response; 
        },
        error: (error: any) => {
          console.error('Error fetching cities:', error);
          alert('Failed to fetch cities data.');
        },
      });
    
    }
  
    get fromCityArray() {
      return this.form.get('fromCity') as FormArray;
    }
  
    onToCityChange(event: any, cityName: string) {
      if (event.target.checked) {
        // ✅ Push value to FormArray if checked
        this.fromCityArray.push(this.fb.control(cityName));
      } else {
        // ✅ Remove value from FormArray if unchecked
        const index = this.fromCityArray.controls.findIndex(control => control.value === cityName);
        if (index >= 0) {
          this.fromCityArray.removeAt(index);
        }
      }
      console.log('Selected To Cities:', this.fromCityArray.value);
    }




   
    onLoad() {
      const formValues = this.form.value;
      const payload = {
        fromDate: formValues.fromDate,
        toDate: formValues.toDate,
        fromCity: formValues.fromCity,
        toCity: formValues.toCity,
        vehicalNumber: formValues.vehicalNumber,
        branch: Array.isArray(formValues.branch) ? formValues.branch : [formValues.branch], // Ensure it's an array
      };
    
      console.log('Final Booking Data:', payload);
    
      this.api.FilterParcelUnLoading(payload).subscribe({
        next: (response: any) => {
          console.log('Booking successful:', response);
      this.data = Object.values(response);

          // Ensure response is an array
          this.data = Array.isArray(response) ? response : [response];
      
          console.log(this.data, "Processed booking data");
          this.LoadSuccess = true;
        },
        error: (error: any) => {
          console.error('Booking failed:', error);
          alert('Booking Failed. Please try again.');
        },
      });
      // hsdbhdbs.
    }
    
    setFormArray(controlName: string, values: any[]) {
      const formArray = this.form1.get(controlName) as FormArray;
      formArray.clear(); // ✅ Clear previous values
    
      values.flat().forEach(value => { // ✅ Flatten the array and push values
        formArray.push(this.fb.control(value));
      });
    }
    
    onGrnNoChange(event: any, grnNo: string) {
      const formArray = this.form1.get('grnNo') as FormArray;
    
      if (event.target.checked) {
        // Add if not already selected
        if (!formArray.value.includes(grnNo)) {
          formArray.push(this.fb.control(grnNo));
        }
      } else {
        // Remove if unchecked
        const index = formArray.value.indexOf(grnNo);
        if (index > -1) {
          formArray.removeAt(index);
        }
      }
    
      // ✅ Update "Select All" status based on selected values
      this.allSelected = this.data.length === formArray.value.length;
      console.log('Selected GRN Numbers:', formArray.value);
    }
    
    // ✅ Handle "Select All" checkbox
    onSelectAllChange(event: any) {
      const formArray = this.form1.get('grnNo') as FormArray;
    
      if (event.target.checked) {
        // ✅ Select all if checked
        this.data.forEach((row:any) => {
          if (!formArray.value.includes(row.grnNo)) {
            formArray.push(this.fb.control(row.grnNo));
          }
        });
      } else {
        // ✅ Deselect all if unchecked
        formArray.clear();
      }
    
      // ✅ Update "Select All" status
      this.allSelected = event.target.checked;
      console.log('All GRN Numbers Selected:', formArray.value);
    }

    onTocitySelect(event: any) {
      const cityName = event.target.value;
      if (cityName) {
        this.api.GetBranchbyCity(cityName).subscribe(
          (res: any) => {
            console.log('Branches for selected city:', res);
            this.tbcdata = res;
          },
          (error: any) => {
            console.error('Error fetching branches:', error);
          }
        );
      } else {
        this.tbcdata = [];
      }
    }
    
  
    ParcelLoad() {
      const payload = {
        fromBookingDate: this.form1.value.fromBookingDate,
        toBookingDate: this.form1.value.toBookingDate,
        fromCity: this.form1.value.fromCity,
        toCity: this.form1.value.toCity,
        branch: this.data[0]?.branch || this.form.value.branch,
        vehicleNo: this.form1.value.vehicleNo,
        grnNo: this.form1.value.grnNo, // ✅ Only selected GRN numbers
        bookingType: this.form1.value.bookingType,
      };
    
      console.log('Final Payload:', payload);
    
      this.api.ParcelUnLoading(payload).subscribe({
        next: (response: any) => {
          console.log('Parcel loaded successfully:', response);
          setTimeout(() => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/parcelunloading']);
            });
          }, 1000);
        },
        error: (error: any) => {
          console.error('Parcel loading failed:', error);
          alert('Parcel Loading Failed. Please try again.');
        },
      });
    }
    
    
    
  
  
    getvehicleData() {
      this.api.VehicleData().subscribe({
        next: (response: any) => {
          console.log('Vehicle:', response);
          this.vehicle = response; 
        },
        error: (error: any) => {
          console.error('Error fetching vehicle data:', error);
        }
      });
    }
  
    branchData() {
      this.api.getData('branch').subscribe({
        next: (response: any) => {
          console.log('Branch Data:', response);
          this.branchdata = response; // Ensure response contains an array of branches
        },
        error: (error: any) => {
          console.error('Error fetching branch data:', error);
        }
      });
    }

}
