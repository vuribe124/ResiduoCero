import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'; 
import { BarriosService } from '../../../services/barrios.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  barrios: any[] = [];
  constructor(private authService: AuthService,
    private barriosService: BarriosService,
    private router: Router
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
            // Suponiendo que tu API envía un mensaje específico en caso de éxito
            if (response.message === "User successfully registered.") {
              // SweetAlert para confirmar el registro
              Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                text: 'Usuario creado correctamente.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
              }).then((result) => {
                if (result.value) {
                  // Redirige a la página de inicio de sesión
                  this.router.navigate(['/auth/login']);
                }
              });
            } else {
              // Si el mensaje de éxito no coincide, maneja como error (opcional)
              throw new Error('Unexpected response message');
            }
          },
          error: (error) => {
            // SweetAlert para mostrar el error
            Swal.fire({
              icon: 'error',
              title: 'Error de registro',
              text: 'Hubo un error al crear el usuario.',
              confirmButtonColor: '#d33',
              confirmButtonText: 'Aceptar'
            });
            console.error('Registration failed', error);
          }
        });
    }
  }
  
}