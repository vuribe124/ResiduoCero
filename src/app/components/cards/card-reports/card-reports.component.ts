import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ReportsService } from '../../../services/reports.service';
import Swal from 'sweetalert2';
import { BarriosService } from 'src/app/services/barrios.service';
import { debounceTime, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-card-reports',
  templateUrl: './card-reports.component.html',
  styleUrls: ['./card-reports.component.css']
})
export class CardReportsComponent implements OnInit {
  reportForm: FormGroup;
  files: Set<File> = new Set();
  barrios: any[] = [];
  filterText = '';
  showBarrios = false;
  filteredBarrios = [...this.barrios];
  searchControl: FormControl = new FormControl();
  constructor(private fb: FormBuilder, private reportService: ReportsService, private barriosService: BarriosService, ) { 
    this.reportForm = this.fb.group({
      description: ['', Validators.required], 
      wasteType: ['', Validators.required],   
      photos: [null, Validators.required],
      neighborhood: ['', Validators.required],  
      address: ['', Validators.required],        
      directionNotes: ['']  
    });
  }

  ngOnInit(): void {
    this.barriosService.getBarrios().subscribe(data => {
      this.barrios = data.barrios;
      this.filteredBarrios=data.barrios
    });
   
    console.log("AA", this.filteredBarrios)
    this.searchControl.valueChanges
    .pipe(
      debounceTime(300), // Agrega un retardo de 300ms al filtro para mejorar el rendimiento
      startWith('')
    )
    .subscribe(value => {
      this.filterBarrios(value);
    });
  }

  onFileChange(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.files.add(event.target.files[i]);
    }
  }

  onSubmit() {
    let errorMessage = '';
    const controls = this.reportForm.controls;
  
    if (controls['description'].invalid) {
      errorMessage += 'La descripción es requerida. ';
    }
    if (controls['wasteType'].invalid) {
      errorMessage += 'El tipo de basura es requerido. ';
    }
    if (controls['photos'].invalid) {
      errorMessage += 'Al menos una foto es requerida. ';
    }
    if (controls['neighborhood'].invalid) {
      errorMessage += 'El barrio es requerido. ';
    }
  
    // Verificar si hay un mensaje de error para mostrar
    if (errorMessage.length > 0) {
      Swal.fire({
        title: 'Información Incompleta',
        text: errorMessage,
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Entendido'
      });
      return; // Detiene la ejecución del método si hay errores
    }
  
    // Si no hay errores, procede con la lógica de envío
    const formData = new FormData();
    this.files.forEach(file => formData.append('photos', file, file.name));
    formData.append('description', controls['description'].value);
    formData.append('wasteType', controls['wasteType'].value);
    formData.append('neighborhood', controls['neighborhood'].value);
    formData.append('address', controls['address'].value);
    formData.append('directionNotes', controls['directionNotes'].value);
  
    this.reportService.addReport(formData).subscribe(
      (response) => {
        console.log(response);
        this.reportForm.reset();
        this.searchControl.reset();
        Swal.fire({
          title: 'Reporte Enviado!',
          text: `Puedes consultar el estado de tu reporte con el número de radicado: ${response.id}`,
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
      },
      (error) => {
        console.error(error);
        Swal.fire({
          title: 'Error',
          text: 'Ha ocurrido un error al enviar tu reporte.',
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Cerrar'
        });
      }
    );
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

  selectBarrio(barrio) {
    this.reportForm.get('neighborhood').setValue(barrio.value, { emitEvent: true });
    this.searchControl.setValue(barrio.name, { emitEvent: false }); // Evita que el filtro se dispare
    this.filteredBarrios = [];
    this.showBarrios = false;
    this.reportForm.get('neighborhood').markAsTouched();  // Marca el control como 'tocado'
    this.reportForm.get('neighborhood').updateValueAndValidity(); // Actualiza la validación
  }
  hideBarrios() {
    setTimeout(() => {
      this.showBarrios = false;
    }, 100);
  }

}
