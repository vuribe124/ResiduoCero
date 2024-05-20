import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BarriosService {

  constructor(private http: HttpClient) { }

  getBarrios(): Observable<any> {
    return this.http.get('/assets/json/barrios.json');
    
  }
}