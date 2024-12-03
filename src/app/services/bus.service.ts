import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Сервис доступен везде в приложении
})
export class BusService {
  private apiUrl = 'https://localhost:5001/api/buses'; // URL бэкенда

  constructor(private http: HttpClient) {}

  getBusSchedule(): Observable<any[]> {  // Указываем тип возвращаемых данных
    return this.http.get<any[]>(`${this.apiUrl}/schedule`);
  }
}
