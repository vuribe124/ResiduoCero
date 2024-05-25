import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service'
import Swal from 'sweetalert2';

@Component({
  selector: "app-card-settings",
  templateUrl: "./card-settings.component.html",
})
export class CardSettingsComponent implements OnInit {
  userForm: FormGroup;
  constructor(private fb: FormBuilder, private http: HttpClient,private authService: AuthService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUserInfo();
  }

  loadUserInfo() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.userForm.patchValue(userInfo); // Automatically patches all values
  }

  initForm() {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      neighborhood: [''],
      phone: ['', Validators.required],
      address: [''],
    });
  }


  onSubmit() {
    const userId = this.userForm.value.id || JSON.parse(localStorage.getItem('userInfo')).id;
    this.authService.updateUser(userId, this.userForm.value).subscribe({
      next: (updatedUser) => {
        Swal.fire({
          text: 'Usuario actualizado correctamente',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      },
      error: (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'Error al actualizar el usuario: ' + error.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }
}
