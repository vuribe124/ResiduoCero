import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
})
export class ProfileComponent implements OnInit {
  public userInfo: any;
  constructor() {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo() {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      this.userInfo = JSON.parse(userInfoString);
    }
  }
}
