import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service'
@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
})
export class IndexComponent implements OnInit {
  contactForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      message: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.authService.sendContactMessage(this.contactForm.value).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Mensaje Enviado',
            text: 'Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo pronto.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar'
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al enviar tu mensaje. Por favor, intenta de nuevo más tarde.',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Aceptar'
          });
          console.error('Error al enviar el mensaje: ', error);
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Formulario Incompleto',
        text: 'Por favor completa todos los campos correctamente antes de enviar.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Reintentar'
      });
    }
  }
}
