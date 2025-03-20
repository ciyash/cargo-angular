import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './USER/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './USER/login/login.component';
import { ParcelbookingComponent } from './Branch/parcelbooking/parcelbooking.component';
import { ParcelloadingComponent } from './Branch/parcelloading/parcelloading.component';
import { HeaderComponent } from './USER/header/header.component';
import { ProfileComponent } from './USER/profile/profile.component';
import { BookingReportComponent } from './Branch/booking-report/booking-report.component';
import { TableModule } from 'primeng/table';
import { FooterComponent } from './USER/footer/footer.component';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { PrintGrnNumberComponent } from './Branch/print-grn-number/print-grn-number.component';
import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QRCodeModule } from 'angularx-qrcode';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SearchGrnNumberComponent } from './Branch/Widgets/search-grn-number/search-grn-number.component';
import { ParcelOnloadingComponent } from './Branch/parcel-onloading/parcel-onloading.component';
import { ParcelLoadingDataComponent } from './Branch/parcel-loading-data/parcel-loading-data.component';
import { ParcelOnLoadingDataComponent } from './Branch/parcel-on-loading-data/parcel-on-loading-data.component';
import { CreateBranchComponent } from './pages/Admin/create-branch/create-branch.component';
import { CreateEmployeeComponent } from './pages/Admin/create-employee/create-employee.component';
import { AdminProfileComponent } from './pages/Admin/admin-profile/admin-profile.component';
import { ParcelBranchComponent } from './Branch/parcel-branch/parcel-branch.component';
import { CreateVehicleComponent } from './pages/Admin/create-vehicle/create-vehicle.component';
import { CreateCitynameComponent } from './pages/Admin/create-cityname/create-cityname.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    ParcelbookingComponent,
    ParcelloadingComponent,
    HeaderComponent,
    ProfileComponent,
    BookingReportComponent,
    FooterComponent,
    PrintGrnNumberComponent,
    SearchGrnNumberComponent,
    ParcelOnloadingComponent,
    ParcelLoadingDataComponent,
    ParcelOnLoadingDataComponent,
    CreateBranchComponent,
    CreateEmployeeComponent,
    AdminProfileComponent,
    ParcelBranchComponent,
    CreateVehicleComponent,
    CreateCitynameComponent
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule, FormsModule,
    HttpClientModule, TableModule, MessagesModule, DialogModule, BrowserAnimationsModule, QRCodeModule, ToastModule, ButtonModule, RippleModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
