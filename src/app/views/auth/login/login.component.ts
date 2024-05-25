import { Component,OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit  {
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  showForgotPasswordForm: boolean = false;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false] 
    });
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  
    // Check if user data is saved in localStorage
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      this.loginForm.patchValue({
        email: savedEmail,
        rememberMe: true
      });
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          if (this.loginForm.get('rememberMe').value) {
            localStorage.setItem('jwtToken', response.token);
            localStorage.setItem('userEmail', this.loginForm.get('email').value); // Storing email
          } else {
            sessionStorage.setItem('jwtToken', response.token);
            sessionStorage.setItem('userEmail', this.loginForm.get('email').value); // Optionally store email in session
          }
          this.router.navigate(['/admin/dashboard']); // Navega a la página principal o dashboard
        },
        error: (error) => {
          Swal.fire('Error', 'Error al iniciar sesión verifique el usuario o la contraseña.', 'error');
          console.error('Login failed', error);
        }
      });
    }
  }

  onForgotPasswordSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe({
        next: (response) => {
          Swal.fire('Éxito', 'Se ha enviado un enlace para restablecer su contraseña a su correo electrónico.', 'success');
          this.showForgotPasswordForm = false;
          this.forgotPasswordForm.reset()
        },
        error: (error) => {
          console.error('Error al solicitar restablecimiento de contraseña', error);
          Swal.fire('Error', 'Error al solicitar restablecimiento de contraseña: ' + error.error.message, 'error');
        }
      });
    } else {
      Swal.fire('Validación', 'Por favor, introduzca un correo electrónico válido.', 'info');
    } 
  }

  
}

