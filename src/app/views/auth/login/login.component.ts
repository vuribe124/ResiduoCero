import { Component,OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'
import { Router } from '@angular/router';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit  {
  loginForm: FormGroup;
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
          console.error('Login failed', error);
        }
      });
    }
  }
}

