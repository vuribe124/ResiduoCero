import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string;
  id: number;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.checkPasswords });
   }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.id = params['id'];
      if (!this.token) {
        Swal.fire('Error', 'Token de restablecimiento no proporcionado o inválido.', 'error');
        this.router.navigate(['/auth/login']);
        this.resetPasswordForm.reset()
      }
    });
  }

  onResetPasswordSubmit() {
    if (this.resetPasswordForm.invalid || this.resetPasswordForm.value.newPassword !== this.resetPasswordForm.value.confirmPassword) {
      Swal.fire('Error', 'Formulario inválido. Asegúrate de que las contraseñas coincidan.', 'error');
      return;
    }
  
    this.authService.changeUserPassword( this.id, this.resetPasswordForm.value.newPassword).subscribe(
      () => {
        Swal.fire('Éxito', 'Contraseña cambiada con éxito.', 'success').then(() => {
          this.router.navigate(['/auth/login']);
        });
      },
      error => {
        Swal.fire('Error', 'Error al cambiar la contraseña: ' + error.message, 'error');
      }
    );
  }  

  checkPasswords(group: FormGroup) {
    let pass = group.get('newPassword').value;
    let confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notSame: true };
  }

}
