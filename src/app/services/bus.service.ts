import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BusService {
  private apiBaseUrl = 'https://localhost:5286/api/buses'; 

  constructor(private http: HttpClient) {}

  getDestinations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/destinations`);
  }

  getPopularDestinations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/popular-destinations`);
  }

  getBusSchedule(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/schedule`);
  }

  bookTicket(route: string, passengerCount: number): Observable<any> {
    const payload = { route, passengerCount };
    return this.http.post<any>(`${this.apiBaseUrl}/book`, payload);
  }

  getSearchSuggestions(query: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiBaseUrl}/search-suggestions?query=${query}`);
  }

  searchBuses(filters: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiBaseUrl}/search`, filters);
  }
}