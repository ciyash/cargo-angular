import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AdminService } from 'src/app/service/admin.service';
import { BranchService } from 'src/app/service/branch.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-cityname',
  templateUrl: './create-cityname.component.html',
  styleUrls: ['./create-cityname.component.scss']
})
export class CreateCitynameComponent {
        bdata:any;
        form:FormGroup;
        loading:boolean=true;
        msg='';
        errorsMessage='';
        form1:FormGroup;
        visible: boolean = false;
        repd:any;
        showDialog(row:any) {
            this.visible = true;
            this.repd=row;
        }
        constructor(private fb:FormBuilder, private api:AdminService, private messageService:MessageService, private router:Router, private bapi:BranchService ,private toastr:ToastrService ){
            this.form = this.fb.group({
              cityName: ['', Validators.required],
              state: ['', Validators.required],
                });

                this.form1 = this.fb.group({
                  cityName: ['',],
                  state: ['', ],
                    });
        }
      
        ngOnInit(){
          this.bapi.GetCities().subscribe((res:any)=>{
            console.log('cities', res);
            this.bdata=res;
            this.loading=false;
          })
        }
      
        Add() {
          const payload = {
            cityName: this.form.value.cityName,
            state: this.form.value.state,
          };
        
          console.log('Final Payload:', payload);
          
          this.api.createCityname(payload).subscribe({
            next: (response: any) => {
              console.log('Parcel loaded successfully:', response);

              this.messageService.add({ severity: 'success', summary: 'success', detail: 'Create City successfully' });
              this.toastr.success('Create City successfully', 'Success');

              setTimeout(() => {
               this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                 this.router.navigate(['/createcity']);
               });
             }, 500);
            },
            error: (error: any) => {
              console.error('Create City failed:', error);
              // alert('Create City Failed. Please try again.');
              this.toastr.error('Create City Failed!', 'Error');

            },
          });
        }

        edit(id:any) {
          console.log(this.form1.value);
          if (this.form1.valid) {
            const val = {
              cityName: this.form1.value.cityName,
            state: this.form1.value.state,
            };
            this.api.UpdateCityname(id, val).subscribe(
              (a: any) => {
                if (a?.data) {
                  console.log(a);
                  this.messageService.add({ severity: 'success', summary: 'success', detail: 'Vehicle Update Successfully' });
                 
                } else {
                  console.log(a);
                  // this.errorMessage = a.msg.message;
                  this.msg = 'Vehicle Successfully Updated !!!';
                  // setTimeout(() => {
                  //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  //     this.router.navigate(['/createcity']);
                  //   });
                  //   }, 1000);
                  
              setTimeout(() => {
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.router.navigate(['/createcity']);
                });
              }, 500);
                }
              },
              (err: any) => {
                this.messageService.add({ severity: 'error', summary: 'error', detail: 'Vehicle not added' });
                this.errorsMessage = err.error.message;
              },
            );
          }
      
          return false;
        }

        Delete(id:any) {
          console.log("id:",id);
          
          this.api.DeleteCityname(id).subscribe(
            (a: any) => {
              if (a) {
                console.log('deletedid',a);
                this.messageService.add({ severity: 'success', summary: 'success', detail: 'Delete Cityname Type Successfully' });
                setTimeout(() => {
                  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                    this.router.navigate(['/createcity']);
                  });
                  }, 1000);
              } else {
                console.log(a);
                // this.errorMessage = a.msg.message;
                this.msg = 'Cityname Successfully Updated !!!';
              }
            },
            (err: any) => {
              this.messageService.add({ severity: 'error', summary: 'error', detail: 'Delete Cityname Type Somthing wrong' });
            },
          );
        return false;
      }
      selectRow(row: any) {
        this.repd = row;
        // optionally patch form values
        this.form1.patchValue({
          cityName: row.cityName,
          state: row.state
        });
      }
      

}
