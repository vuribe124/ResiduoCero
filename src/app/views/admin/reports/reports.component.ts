import { Component, OnInit } from '@angular/core';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reportList = [];
  color = 'light'; 
  showModal = false;
  currentReport: any = {}; 
  private apiUrl = 'http://localhost:8080/reports/imagen/';

  constructor(private reportService: ReportsService) { }

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.reportService.getReports().subscribe({
      next: (data:any) => {
        this.reportList = data.map((itemPhoto: any) =>{
        return {...itemPhoto, photoUrls: itemPhoto.photoUrls.split(',').map(item => this.apiUrl+item.replace('\"uploads\\\\','').replace("\"",'').replace(']','').replace('[',''))};  
        })
      },
      error: (error) => {
        console.error('Error retrieving reports:', error);
      }
    });
  }

  viewReportDetails(report: any): void {
    this.currentReport = report;  // Establece los datos del reporte seleccionado
    console.log("a", this.currentReport)
    this.toggleModal();           // Abre el modal
  }

  toggleModal(): void {
    this.showModal = !this.showModal;
  }

  updateReportStatus(id: number, newStatus: string): void {
    this.reportService.updateReportStatus(id, newStatus).subscribe({
      next: (response) => {
        console.log('Estado actualizado con éxito');
        // Opcional: actualizar la vista o manejar la respuesta
      },
      error: (error) => {
        console.error('Error actualizando el estado del reporte', error);
      }
    });
  }

}
