import { Component, OnInit,ViewChild, ElementRef  } from "@angular/core";
import { createPopper } from "@popperjs/core";
@Component({
  selector: "app-auth-navbar",
  templateUrl: "./auth-navbar.component.html",
})
export class AuthNavbarComponent implements OnInit {
  navbarOpen = false;
  isAuthenticated = false;
  userName = '';
  dropdownPopoverShow = false;
  @ViewChild("btnDropdownRef", { static: false }) btnDropdownRef: ElementRef;
  @ViewChild("popoverDropdownRef", { static: false })
  popoverDropdownRef: ElementRef;

  constructor() {}

  ngOnInit(): void {
    this.checkAuthentication();
  }

  setNavbarOpen() {
    this.navbarOpen = !this.navbarOpen;
  }

  checkAuthentication() {
    const userInfo = localStorage.getItem('userInfo');
    console.log("ajaj", userInfo)
    if (userInfo) {
      this.isAuthenticated = true;
      this.userName = JSON.parse(userInfo).username; // Asumiendo que el objeto userInfo tiene una propiedad 'username'
    }
  }
  toggleDropdown(event) {
    event.preventDefault();
    if (this.dropdownPopoverShow) {
      this.dropdownPopoverShow = false;
    } else {
      this.dropdownPopoverShow = true;
      this.createPoppper();
    }
  }
  createPoppper() {
    createPopper(
      this.btnDropdownRef.nativeElement,
      this.popoverDropdownRef.nativeElement,
      {
        placement: "bottom-start",
      }
    );
  }
}
