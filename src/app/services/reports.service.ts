import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:8080/reports';

  addReport(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/addReport`, formData);
  }
  fetchReportById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getReports(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateReportStatus(id: number, newStatus: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status: newStatus });
  }
}
