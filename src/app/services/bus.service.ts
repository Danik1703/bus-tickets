import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusService {

  private apiUrl = 'https://localhost:5001/api/buses/schedule';  

  constructor(private http: HttpClient) { }

  getBusSchedule(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
