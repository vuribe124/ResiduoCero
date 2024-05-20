import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'; 
import { BarriosService } from '../../../services/barrios.service';

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  barrios: any[] = [];
  constructor(private authService: AuthService,
    private barriosService: BarriosService
  ) {}

  ngOnInit() {
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      neighborhood: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
      address: new FormControl('', [Validators.required]),
      role: new FormControl(0, [Validators.required])
    });

    this.barriosService.getBarrios().subscribe(data => {
      this.barrios = data.barrios;
    });
  }

onSubmit() {
  if (this.registerForm.valid) {
    this.authService.register(this.registerForm.value)
      .subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          // Aquí puedes manejar acciones post-registro como redirecciones o mensajes de éxito
        },
        error: (error) => {
          console.error('Registration failed', error);
          // Aquí puedes manejar los errores
        }
      });
  }
}
}