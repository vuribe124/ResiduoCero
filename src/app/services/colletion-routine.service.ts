import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { iColletionRoutine } from '../models/colletion-routine';

@Injectable({
  providedIn: 'root'
})
export class ColletionRoutineService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:8080/colletion-routine/';

  list(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }
  
  save(paramenter:iColletionRoutine): Observable<any> {
    return this.http.post(`${this.apiUrl}add`,paramenter);
  }
  
  update(paramenter:iColletionRoutine): Observable<any> {
    return this.http.post(`${this.apiUrl}update/${paramenter.id}`,paramenter);
  }
  
  delete(id:any): Observable<any> {
    return this.http.delete(`${this.apiUrl}delete/${id}`);
  }
}
