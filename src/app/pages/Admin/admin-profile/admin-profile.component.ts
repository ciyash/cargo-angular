import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AdminService } from 'src/app/service/admin.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent {
  id:any;
  data:any;
  form:FormGroup;
  msg: string = '';
  errorsMessage: string = '';
  msg1: string = '';
  errorMessage1: string = '';
  form1:FormGroup;
  visible: boolean = false;
  showDialog() {
      this.visible = true;
  }
  constructor(private api:AdminService, private activeroute:ActivatedRoute, private fb:FormBuilder, private messageService:MessageService, private router:Router){
    this.form = this.fb.group({
      companyName: ['', ], 
      name: ['', ], 
      username: ['', ], 
      location: ['', ], 
      address: ['', ], 
      email: ['', ], 
      phone: ['', ], 
    });
    this.form1 = this.fb.group({
      oldPassword: ['', Validators.required], 
      newPassword: ['', Validators.required],  
    });
  }

  ngOnInit(){
    this.id = this.activeroute.snapshot.params['id'];
    this.api.GetProfileData().subscribe((res: any) => {
      console.log(res);
      this.data = res;
      // this.form.patchValue({
      //   password: this.data.password
      // });
    });
  }

  changePassword(){
    console.log(this.form1.value);
    if (this.form1.valid) {
      const val = {
        oldPassword: this.form1.value.oldPassword,
        newPassword:this.form1.value.newPassword,
      };
      this.api.ChangePassword(val).subscribe(
        a => {
          if (a) {
            console.log(a);
               this.form1.reset();
          } else {
            console.log(a);
            // this.errorMessage = a.msg.message;
            this.msg1 = 'Password Successfully Updated !!!';
          }
        },
        (err: any) => {
          this.errorMessage1 = err.error.message;
        },
      );
    }
  }

  edit() {
    console.log(this.form.value);
    if (this.form.valid) {
      const val = {
        companyName: this.form.value.companyName,
        name: this.form.value.name,
        username: this.form.value.username,
        location: this.form.value.location,
        address: this.form.value.address,
        phone: this.form.value.phone,
        email: this.form.value.email,
      };
      this.api.UpdateAdminProfile(val).subscribe(
        (a: any) => {
          if (a?.data) {
            console.log(a);
            this.messageService.add({ severity: 'success', summary: 'success', detail: 'Profile Update Successfully' });
            setTimeout(() => {
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/adminprofile']);
              });
              }, 500);
          } else {
            console.log(a);
            // this.errorMessage = a.msg.message;
            this.msg = 'Profile Successfully Updated !!!';
          }
        },
        (err: any) => {
          this.messageService.add({ severity: 'error', summary: 'error', detail: 'Profile not added' });
          this.errorsMessage = err.error.message;
        },
      );
    }

    return false;
  }

}
