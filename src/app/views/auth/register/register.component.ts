import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'; 
import { BarriosService } from '../../../services/barrios.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { debounceTime, startWith } from 'rxjs/operators';

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  barrios: any[] = [];
  showBarrios = false;
  filteredBarrios = [...this.barrios];
  searchControl: FormControl = new FormControl();
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

    this.searchControl.valueChanges
    .pipe(
      debounceTime(300), // Agrega un retardo de 300ms al filtro para mejorar el rendimiento
      startWith('')
    )
    .subscribe(value => {
      this.filterBarrios(value);
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

  filterBarrios(value: string) {
    if (!value) {
      this.filteredBarrios = this.barrios;
    } else {
      this.filteredBarrios = this.barrios.filter(barrio =>
        barrio.name.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  selectBarrio(barrio: any) {
    // Actualiza el valor del formulario con el identificador del barrio seleccionado.
    this.registerForm.get('neighborhood').setValue(barrio.value, { emitEvent: true });
  
    // Actualiza el input visible con el nombre del barrio seleccionado.
    this.searchControl.setValue(barrio.name, { emitEvent: false });
  
    // Cierra la lista de barrios filtrados y oculta el dropdown.
    this.filteredBarrios = [];
    this.showBarrios = false;
  
    // Esto es opcional: forzar el refresco de la vista si enfrentas problemas de actualización en la UI.
    this.registerForm.get('neighborhood').updateValueAndValidity();
  }
  
  hideBarrios() {
    setTimeout(() => {
      this.showBarrios = false;
    }, 100);
  }
}