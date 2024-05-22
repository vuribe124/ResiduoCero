import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-auth-navbar",
  templateUrl: "./auth-navbar.component.html",
})
export class AuthNavbarComponent implements OnInit {
  navbarOpen = false;
  isAuthenticated = false;
  userName = '';

  constructor() {}

  ngOnInit(): void {
    this.checkAuthentication();
  }

  setNavbarOpen() {
    this.navbarOpen = !this.navbarOpen;
  }

  checkAuthentication() {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      this.isAuthenticated = true;
      this.userName = JSON.parse(userInfo).username; // Asumiendo que el objeto userInfo tiene una propiedad 'username'
    }
  }
}
