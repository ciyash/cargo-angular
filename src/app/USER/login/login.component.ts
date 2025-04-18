// import { Component } from '@angular/core';
// import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AdminService } from 'src/app/service/admin.service';
// import { AuthService } from 'src/app/service/auth.service';
// import { BranchService } from 'src/app/service/branch.service';
// import { TokenService } from 'src/app/service/token.service';


// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss'],
// })
// export class LoginComponent {
//   form!: FormGroup;
//   form1:FormGroup;
//   form2:FormGroup;
//   otpFormVisible = false; 
//   errorMessage: string = '';
//   isLoggedIn: boolean = false;
 
//   constructor(private fb: FormBuilder, private authService: AuthService, private token:TokenService, private router :Router, private api:AdminService) {
//     this.form1=this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//     });
//     this.form2=this.fb.group({
//       email: ['', Validators.required],
//       otp:['', Validators.required],
//       newPassword:['', Validators.required],
//     });
//   }

//   ngOnInit(){
//     this.form = this.fb.group({
//       identifier: ['', Validators.required], // Set default value as empty string
//       password: ['', Validators.required]
//     });
//   }
 
//   onSubmit(): void {
//     if (this.form.invalid) {
//       this.errorMessage = 'Please fill in all required fields';
//       return;
//     }
  
//     const { identifier, password } = this.form.value;

//     this.authService.login(identifier, password).subscribe({
//       next: (response: any) => {
//         // ✅ Save token
//         this.token.saveToken(response.token);
  
//         // ✅ Save role as user object
//         const user = {
//           role: response.role, // Save role properly
//           location: response.location || null, // Optional fields
//           branchName: response.branchName || null, // Optional fields
//           branchLocation: response.branchLocation || null, // Optional fields
//         };
//         this.token.saveUser(user);
  
//         // ✅ Get the role and navigate
//         const role = this.token.getRole();
//         console.log('Role:', role);
  
//         switch (role) {
//           case 'admin':
//             this.router.navigate(['/createbranch']);
//             break;
//           case 'subadmin':
//             this.router.navigate(['/subdashboard']);
//             break;
//           case 'employee':
//             this.router.navigate(['/booking']);
//             break;
//           default:
//             this.router.navigate(['/login']);
//             break;
//         }
//       },
//       error: (error) => {
//         this.errorMessage = error.error.message || 'Login failed';
//       },
//     });
//   }
  

//   forgotpassword() {
//     const payload = { email: this.form1.value.email };
//     console.log('Final Payload:', payload);

//     this.api.Forgotemailentry(payload).subscribe({
//       next: (response: any) => {
//         console.log('OTP Mail sent successfully:', response);
//         alert('OTP Mail sent Successfully!');

//         // Set email value in form2 and show OTP form
//         this.form2.patchValue({ email: this.form1.value.email });
//         this.otpFormVisible = true;
//       },
//       error: (error: any) => {
//         console.error('Incorrect Mail failed:', error);
//         alert('Incorrect Mail. Please try again.');
//       },
//     });
//   }

//   resetpassword() {
//     const payload = {
//       email: this.form2.value.email,
//       otp: this.form2.value.otp,
//       newPassword: this.form2.value.newPassword
//     };

//     console.log('Final Payload:', payload);

//     this.api.resetPassword(payload).subscribe({
//       next: (response: any) => {
//         console.log('Reset Password successfully:', response);
//         alert('Reset Password Successfully!');

//         // Close modal after reset
//         const modal = document.getElementById('forgotPasswordModal');
//         if (modal) {
//           (modal as any).classList.remove('show');
//           (modal as any).setAttribute('aria-hidden', 'true');
//           document.body.classList.remove('modal-open');
//           document.querySelector('.modal-backdrop')?.remove();
//         }

//         // Reset form and switch back to email form
//         this.otpFormVisible = false;
//         this.form1.reset();
//         this.form2.reset();
//       },
//       error: (error: any) => {
//         console.error('Reset Password failed:', error);
//         alert('Reset Password failed. Please try again.');
//       },
//     });
//   }
  
  
// }
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/service/admin.service';
import { AuthService } from 'src/app/service/auth.service';
import { TokenService } from 'src/app/service/token.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form!: FormGroup;
  form1: FormGroup;
  form2: FormGroup;
  otpFormVisible = false;
  errorMessage: string = '';
  isLoggedIn: boolean = false;
  isLoading: boolean = false; // Loading spinner flag

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private token: TokenService,
    private router: Router,
    private api: AdminService,
    private toast:ToastrService,
  ) {
    // Initialize forms
    this.form1 = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.form2 = this.fb.group({
      email: ['', Validators.required],
      otp: ['', Validators.required],
      newPassword: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Main login form initialization
    this.form = this.fb.group({
      identifier: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    const { identifier, password } = this.form.value;

    // Add a loading spinner
    this.isLoading = true;

    this.authService.login(identifier, password).subscribe({
      next: (response: any) => {
        this.token.saveToken(response.token);

        // Save user details
        const user = {
          role: response.role,
          location: response.location || null,
          branchName: response.branchName || null,
          branchLocation: response.branchLocation || null,
        };
        this.token.saveUser(user);

        // Resolve TypeScript error using default value
        const role = response.role ?? 'guest'; // Handle null value safely
        this.router.navigate([this.getNavigationPath(role)]);
      },
      error: (error) => {
        const message = error.error.message || 'Login failed';
    this.toast.error("please ENTER Validate PassWord")
        this.errorMessage = message;
      },
      
      complete: () => {
        // Hide loading spinner
        this.isLoading = false;
      },
    });
  }

  private getNavigationPath(role: string): string {
    switch (role) {
      case 'admin':
        return '/createbranch';
      case 'subadmin':
        return '/subdashboard';
      case 'employee':
        return '/booking';
      default:
        return '/login';
    }
  }

  forgotpassword() {
    const payload = { email: this.form1.value.email };
    this.api.Forgotemailentry(payload).subscribe({
      next: (response: any) => {
        alert('OTP Mail sent successfully!');
        this.form2.patchValue({ email: this.form1.value.email });
        this.otpFormVisible = true;
      },
      error: (error: any) => {
        alert('Incorrect Mail. Please try again.');
      },
    });
  }

  resetpassword() {
    const payload = {
      email: this.form2.value.email,
      otp: this.form2.value.otp,
      newPassword: this.form2.value.newPassword,
    };

    this.api.resetPassword(payload).subscribe({
      next: (response: any) => {
        alert('Password Reset Successfully!');
        this.closeModal();
        this.otpFormVisible = false;
        this.form1.reset();
        this.form2.reset();
      },
      error: (error: any) => {
        alert('Password Reset Failed. Please try again.');
      },
    });
  }

  private closeModal() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
      (modal as any).classList.remove('show');
      (modal as any).setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      document.querySelector('.modal-backdrop')?.remove();
    }
  }
}
