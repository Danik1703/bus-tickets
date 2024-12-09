import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BusService {
  private apiBaseUrl = 'https://localhost:5001/api/buses'; // Адрес API

  constructor(private http: HttpClient) {}

  // Получить все направления
  getDestinations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/destinations`);
  }

  // Получить популярные направления
  getPopularDestinations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/popular-destinations`);
  }

  // Получить расписания автобусов
  getBusSchedule(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/schedule`);
  }

  // Забронировать билет
  bookTicket(route: string, passengerCount: number): Observable<any> {
    const payload = { route, passengerCount };
    return this.http.post<any>(`${this.apiBaseUrl}/book`, payload);
  }

  // Поиск автобусов с фильтрами
  searchBuses(filters: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiBaseUrl}/search`, filters);
  }
}