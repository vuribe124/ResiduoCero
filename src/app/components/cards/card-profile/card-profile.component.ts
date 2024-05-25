import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'
import Swal from 'sweetalert2';
@Component({
  selector: "app-card-profile",
  templateUrl: "./card-profile.component.html",
})
export class CardProfileComponent implements OnInit {
  userInfo: any = {};
  changePasswordForm: FormGroup;
  showChangePasswordForm: boolean = false;
  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.initChangePasswordForm();
  }

  loadUserInfo(): void {
    const userInfoString = localStorage.getItem('userInfo'); // Obtiene la información como string JSON
    if (userInfoString) {
      this.userInfo = JSON.parse(userInfoString); // Parsea el string JSON a un objeto de JavaScript
    }
  }

  initChangePasswordForm(): void {
    // Inicializa el formulario con validación
    this.changePasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  changePassword(): void {
    if (this.changePasswordForm.valid) {
      const newPassword = this.changePasswordForm.get('newPassword')?.value;
      const userId = this.userInfo.id;
      this.authService.changeUserPassword(userId, newPassword).subscribe({
        next: (response) => {
          console.log("a", response)
          Swal.fire('Éxito', 'Contraseña actualizada con éxito.', 'success');
          this.showChangePasswordForm = false; // Oculta el formulario después de actualizar
        },
        error: (error) => {
          Swal.fire('Error', 'Error al actualizar la contraseña: ' + error.message, 'error');
        }
      });
    } else {
      Swal.fire('Validación', 'Por favor, introduzca una contraseña válida.', 'info');
    }
  }
}
