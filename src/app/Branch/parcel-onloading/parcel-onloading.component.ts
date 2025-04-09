import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BranchService } from 'src/app/service/branch.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
declare const SlimSelect: any;
import { ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-parcel-onloading',
  templateUrl: './parcel-onloading.component.html',
  styleUrls: ['./parcel-onloading.component.scss'],
})
export class ParcelOnloadingComponent {
  adminData: any;
  form!: FormGroup;
  form1: FormGroup;
  cities: any;
  vehicle: any = {};
  branchdata: any;
  data: any;
  searchTerm: string = ''; // For binding with input field
  idselectmsg: string = '';
  errorMessage: string = '';
  data2: any;
  data1: any;
  LoadSuccess: boolean = false;
  allSelected: boolean = false;
  tbcdata: any;
  @ViewChild('selectElem') selectElem!: ElementRef;
  @ViewChild('branch') branch!: ElementRef;
  @ViewChild('selectvehicle') selectvehicle!: ElementRef;
  // @ViewChild('droupbranch') droupbranch!: ElementRef;
  @ViewChild('demoSelect') demoSelect!: ElementRef;
  selectedbranch: any;
  onVehicleSelect: any;
  apiResponse: any;
  bookings: any;
  constructor(
    private api: BranchService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private activeroute: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      fromCity: this.fb.array([],),
      toCity: ['', Validators.required],
      vehicalNumber: ['',],
      branch: [''] // ✅

    });
    this.form1 = this.fb.group({
      fromBookingDate: ['', Validators.required],
      toBookingDate: ['', Validators.required],
      fromCity: this.fb.array([], Validators.required),
      toCity: ['', Validators.required], // ✅ Ensure toCity is a FormControl, NOT a FormArray
      branch: ['', Validators.required],
      vehicalNumber: ['', Validators.required],
      grnNo: this.fb.array([], Validators.required),
      bookingType: ['Topay'],
    });
  }
  ngOnInit() {
    this.searchTerm = this.activeroute.snapshot.params['grnNumber'];
    this.getCities();
    this.getvehicleData();
  }
  ngAfterViewInit(): void {
    new SlimSelect({
      select: this.demoSelect.nativeElement,
    });

    setTimeout(() => {
      // $(this.selectElem.nativeElement).select2();
      // $(this.selectElem.nativeElement).on('select2:select', (event: any) => {
      //   const selectedCity = event.params.data.id;
      //   const fromCityArray = this.form.get('fromCity') as FormArray;
      //   fromCityArray.clear();
      //   fromCityArray.push(new FormControl(selectedCity));
      //   console.log('Updated From City:', this.form.get('fromCity')?.value);
      //   this.onTocitySelect({ target: { value: selectedCity } });
      // });
      $(this.selectElem.nativeElement).select2();

      // Bind select2 change event
      $(this.selectElem.nativeElement).on('select2:select', (event: any) => {
        const selectedCity = event.params.data.id;
        this.form.get('toCity')?.setValue(selectedCity);
        this.onTocitySelect({ target: { value: selectedCity } });
        console.log('Updated To City:', this.form.get('toCity')?.value);
      });

      // --- BRANCH ---
      $(this.branch.nativeElement).select2();
      $(this.branch.nativeElement).on('select2:select', (event: any) => {
        const selectedBranch = event.params.data.id;
        this.form.get('branch')?.setValue(selectedBranch);
        console.log('Updated Branch:', this.form.get('branch')?.value);
      });

      // --- VEHICLE ---
      $(this.selectvehicle.nativeElement).select2();
      $(this.selectvehicle.nativeElement).on('select2:select', (event: any) => {
        const selectedVehicle = event.params.data.id;
        this.form.get('vehicalNumber')?.setValue(selectedVehicle);
        console.log(
          'Updated Vehicle Number:',
          this.form.get('vehicalNumber')?.value
        );
      });
    }, 0);
  }
  // onLoad() {
  //   const formValues = this.form.value;
  //   const payload = {
  //     fromDate: formValues.fromDate,
  //     toDate: formValues.toDate,
  //     fromCity: formValues.fromCity.length ? formValues.fromCity : [],
  //     toCity: formValues.toCity || '',
  //     vehicalNumber: formValues.vehicalNumber,
  //     branch: formValues.branch,
  //   };
  //   console.log('Final Booking Data:', payload);
  //   this.api.FilterParcelUnLoading(payload).subscribe({
  //     next: (response: any) => {
  //       console.log('API Response:', response);
  //       this.apiResponse = response.data;
  //       this.bookings = response.data[0]?.bookings || [];
  //       this.toastr.success('Parcel unloaded Successfully', 'Success');
  //       this.LoadSuccess = true;
  //     },
  //     error: (error: any) => {
  //       console.error('Booking failed:', error);
  //       this.toastr.error('Parcel unloaded Failed ', 'Failed');
  //     },
  //   });
  // }
//   
  onLoad() {
    if (this.form.invalid) {
      this.toastr.error('Please fill all required fields', 'Validation Error');
      return;
    }
  
    const formValues = this.form.value;
  
    const payload = {
      fromDate: formValues.fromDate,
      toDate: formValues.toDate,
      fromCity: formValues.fromCity.length ? formValues.fromCity : [],
      toCity: formValues.toCity || '',
      vehicalNumber: formValues.vehicalNumber || '',
      branch: formValues.branch || '',
    };
  
    console.log('Final Booking Data:', payload);
  
    this.api.FilterParcelUnLoading(payload).subscribe({
      next: (response: any) => {
        console.log('API Response:', response);
  
        if (response?.data?.length) {
          this.apiResponse = response.data;
          this.bookings = response.data[0]?.bookings || [];
          this.LoadSuccess = true;
          this.toastr.success('Parcel unloaded Successfully', 'Success');
        } else {
          this.apiResponse = [];
          this.bookings = [];
          this.LoadSuccess = false;
          this.toastr.info('No customer bookings found.', 'Info');
        }
      },
      error: (error: any) => {
        console.error('Booking failed:', error);
        this.toastr.error('Parcel unloading Failed', 'Error');
      },
    });
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
        },
        (error: any) => {
          console.error('Error fetching branches:', error);
        }
      );
    } else {
      this.tbcdata = [];
    }
  }

  getCities() {
    this.api.GetCities().subscribe({
      next: (response: any) => {
        console.log('Cities data:', response);
        this.cities = response;
        console.log(this.cities, 'cites');
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

  onFromCityChange(event: any) {
    const selectedOptions = Array.from(event.target.selectedOptions).map(
      (option: any) => option.value
    );
    const fromCityArray = this.form.get('fromCity') as FormArray;
    fromCityArray.clear(); // Clear previous selections

    selectedOptions.forEach((city) => {
      fromCityArray.push(new FormControl(city));
    });
    console.log('Selected From Cities:', fromCityArray.value);
  }

  setFormArray(controlName: string, values: any[]) {
    const formArray = this.form1.get(controlName) as FormArray;
    formArray.clear(); // Clear existing
    values.flat().forEach((value) => {
      formArray.push(this.fb.control(value));
    });
  }

  onGrnNoChange(event: any, grnNo: string) {
    const formArray = this.form1.get('grnNo') as FormArray;

    if (event.target.checked) {
      if (!formArray.value.includes(grnNo)) {
        formArray.push(this.fb.control(grnNo));
      }
    } else {
      const index = formArray.value.indexOf(grnNo);
      if (index > -1) {
        formArray.removeAt(index);
      }
    }

    // ✅ Update select all checkbox
    const bookingsLength = this.bookings?.length || 0;
    this.allSelected =
      bookingsLength > 0 && formArray.value.length === bookingsLength;
    console.log('Selected GRNs:', formArray.value);
  }

  onSelectAllChange(event: any) {
    const formArray = this.form1.get('grnNo') as FormArray;
    formArray.clear();

    if (event.target.checked && this.bookings?.length > 0) {
      this.bookings.forEach((row: any) => {
        const grn = row?.grnNo;
        if (grn && !formArray.value.includes(grn)) {
          formArray.push(this.fb.control(grn));
        }
      });
    }

    this.allSelected = event.target.checked;
    console.log('All selected GRNs:', formArray.value);
  }

  getvehicleData() {
    this.api.VehicleData().subscribe({
      next: (response: any) => {
        console.log('Vehicle:', response);
        this.vehicle = response;
      },
      error: (error: any) => {
        console.error('Error fetching vehicle data:', error);
      },
    });
  }
  ParcelLoad() {
    const payload = {
      fromBookingDate: this.form1.value.fromBookingDate,
      toBookingDate: this.form1.value.toBookingDate,
      fromCity: this.form1.value.fromCity,
      toCity: this.form1.value.toCity,
      branch: this.form1.value.branch || this.bookings[0]?.branch,
      vehicalNumber: this.form1.value.vehicalNumber,
      grnNo: this.form1.value.grnNo, // ✅ This must be an array!
      bookingType: this.form1.value.bookingType,
    };

    console.log('Final Payload:', payload);
    this.api.ParcelUnLoading(payload).subscribe({
      next: (response: any) => {
        console.log('Parcel unloaded successfully:', response);
        setTimeout(() => {
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate(['/parcelunloading']);
            });
        }, 1000);
      },
      error: (error: any) => {
        console.error('Parcel unloading failed:', error);
        alert('Parcel Unloading Failed. Please try again.');
      },
    });
  }
}
