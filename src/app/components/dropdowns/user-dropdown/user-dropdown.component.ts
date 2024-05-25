import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { createPopper } from "@popperjs/core";
import { Router } from '@angular/router';  // Importa Router desde @angular/router

@Component({
  selector: "app-user-dropdown",
  templateUrl: "./user-dropdown.component.html",
})
export class UserDropdownComponent implements AfterViewInit {
  dropdownPopoverShow = false;
  @ViewChild("btnDropdownRef", { static: false }) btnDropdownRef: ElementRef;
  @ViewChild("popoverDropdownRef", { static: false })
  popoverDropdownRef: ElementRef;

  constructor(private router: Router) {}  // Inyecta Router en el constructor

  ngAfterViewInit() {
    createPopper(
      this.btnDropdownRef.nativeElement,
      this.popoverDropdownRef.nativeElement,
      {
        placement: "bottom-start",
      }
    );
  }

  toggleDropdown(event) {
    event.preventDefault();
    this.dropdownPopoverShow = !this.dropdownPopoverShow; // Simplificado toggle de dropdown
  }

  logout() {
    // Remover los items del localStorage
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('jwtToken');

    // Redirigir al usuario a la página de inicio de sesión o la página principal
    this.router.navigate(['/auth/login']); // Asegúrate de que la ruta es correcta
  }
}
