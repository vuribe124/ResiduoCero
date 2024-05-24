import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { colletionRoutine } from '../models/colletion-routine';

@Injectable({
  providedIn: 'root'
})
export class ColletionRoutineService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:8080/colletion-routine/';

  list(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }
  
  save(paramenter:colletionRoutine): Observable<any> {
    return this.http.post(`${this.apiUrl}add`,paramenter);
  }
}
