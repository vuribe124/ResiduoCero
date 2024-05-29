import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-card-search-report',
  templateUrl: './card-search-report.component.html',
  styleUrls: ['./card-search-report.component.css']
})
export class CardSearchReportComponent implements OnInit {
  radicadoForm: FormGroup;
  reportData: any = null;
  errorMessage: string = '';
  private apiUrl = 'http://localhost:8080/reports/imagen/';
  constructor(private fb: FormBuilder, private reportService: ReportsService) { 
    this.radicadoForm = this.fb.group({
      radicado: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  fetchReport() {
    if (this.radicadoForm.valid) {
      const radicado = this.radicadoForm.get('radicado').value;
      this.reportService.fetchReportById(radicado).subscribe(
        response => {
          this.reportData = {...response, photoUrls: response.photoUrls.split(',').map(item => this.apiUrl+item.replace('\"uploads\\\\','').replace("\"",'').replace(']','').replace('[',''))};
          this.errorMessage = '';
        },
        error => {
          this.errorMessage = 'No se encontró el reporte o ocurrió un error al buscarlo.';
          this.reportData = null;
        }
      );
    } else {
      this.errorMessage = 'El número de radicado es obligatorio.';
    }
  }

}
