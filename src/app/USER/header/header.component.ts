import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { BranchService } from 'src/app/service/branch.service';
import { TokenService } from 'src/app/service/token.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  model: any[] = [];
  id: any;
  data: any;

  constructor(
    private token: TokenService,
    private api: BranchService,
    private activeroute: ActivatedRoute
  ) {}

  logout() {
    this.token.signOut();
  }

  ngOnInit() {
    this.model = [];

    if (this.token.isAdmin()) {
      this.model = [
        {
          label: 'Dashboard',
          icon: 'pi pi-fw pi-home',
          routerLink: ['/createbranch'],
        },
        {
          label: 'Create Data',
          icon: 'pi pi-user',
          items: [
            {
              label: 'Add Branch',
              icon: 'pi pi-user-edit',
              routerLink: ['/createbranch'],
            },
            {
              label: 'Add Employee',
              icon: 'pi pi-fw pi-user-edit',
              routerLink: ['/createemployee'],
            },
            {
              label: 'Add Vehicle',
              icon: 'pi pi-fw pi-user-edit',
              routerLink: ['/createvehicle'],
            },
          ],
        },
        {
          label: 'Setting',
          icon: 'pi pi-fw pi-database',
          items: [
            { label: 'Profile', routerLink: ['/adminprofile'] },
            { label: 'Add City', icon: 'pi pi-fw pi-user-edit', routerLink: ['/createcity'] },
            { label: 'Add Dispatch Type', icon: 'pi pi-fw pi-user-edit', routerLink: ['/adddispatchtype']},
            { label: 'Add Charges', icon: 'pi pi-fw pi-user-edit', routerLink: ['/addextracharges'] },
          ],
        },
      ];
    }

    if (this.token.isSubAdmin()) {
      this.model = [
        {
          label: 'Dashboard',
          icon: 'pi pi-fw pi-home',
          routerLink: ['/adashboard'],
        },
        {
          label: 'Profile',
          icon: 'pi pi-fw pi-user-edit',
          routerLink: ['/aprofile'],
        },
      ];
    }

    if (this.token.isEmployee()) {
      this.model = [
        {
          label: 'Dashboard',
          icon: 'pi pi-database',
          routerLink: ['/booking'],
        },
        {
          label: 'Bookings',
          icon: 'pi pi-fw pi-database',
          items: [
            { label: 'Parcel Booking', routerLink: ['/booking'] },
            { label: 'Offline Loading', routerLink: ['/parcelloading'] },
            { label: 'Parcel Unloading', routerLink: ['/parcelunloading'] },
            { label: 'Branch to Branch Loading', routerLink: ['/parcel-branch'] },
            { label: 'Booking Report', routerLink: ['/bookingreport'] },
            { label: 'Branch to Branch Unloading', routerLink: ['/barnchtobranchunloading'] },
            { label: 'Vouchers List Offline', routerLink: ['/voucherslistoffline'] },
          ],
        },
        {
          label: 'Parcel Agent',
          icon: 'pi pi-fw pi-file',
          routerLink: ['/booking'],
        },
        {
          label: 'Parcel Report',
          icon: 'pi pi-fw pi-file',
          routerLink: ['/booking'],
        },
        { label: 'Others', icon: 'pi pi-fw pi-file', routerLink: ['/booking'] },
      ];
    }

    if (this.token.isAccountant()) {
      this.model = [
        {
          label: 'Reports',
          icon: 'pi pi-fw pi-file',
          routerLink: ['/reports'],
        },
      ];
    }

    if (this.token.isSuperviser()) {
      this.model = [
        {
          label: 'Tasks',
          icon: 'pi pi-fw pi-briefcase',
          routerLink: ['/tasks'],
        },
      ];
    }

    if (this.token.isDriver()) {
      this.model = [
        {
          label: 'Delivery',
          icon: 'pi pi-fw pi-truck',
          routerLink: ['/delivery'],
        },
      ];
    }
    // profile data
    this.id = this.activeroute.snapshot.params['id'];
    this.api.GetProfileData().subscribe((res: any) => {
      console.log(res);
      this.data = res;
      console.log(this.data, 'Profiledat');
    });
  }

  onKeydown(event: KeyboardEvent) {
    const nodeElement = event.target as HTMLDivElement;
    if (event.code === 'Enter' || event.code === 'Space') {
      nodeElement.click();
      event.preventDefault();
    }
  }
}
