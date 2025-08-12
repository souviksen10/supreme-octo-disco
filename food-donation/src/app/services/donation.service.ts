import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export type DonationStatus = 'available' | 'reserved' | 'collected';

export interface Donation {
  id: string;
  donorName: string;
  contact: string;
  foodType: string;
  quantity: number;
  unit: string;
  expiryDate: string; // ISO date string
  location: string;
  notes?: string;
  status: DonationStatus;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class DonationService {
  private readonly baseUrl = `${environment.apiUrl}/donations`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Donation[]> {
    return this.http.get<ApiResponse<Donation[]>>(this.baseUrl)
      .pipe(map(response => response.data));
  }

  getById(id: string): Observable<Donation> {
    return this.http.get<ApiResponse<Donation>>(`${this.baseUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  add(input: Omit<Donation, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Observable<Donation> {
    return this.http.post<ApiResponse<Donation>>(this.baseUrl, input)
      .pipe(map(response => response.data));
  }

  update(id: string, patch: Partial<Omit<Donation, 'id' | 'createdAt'>>): Observable<Donation> {
    return this.http.put<ApiResponse<Donation>>(`${this.baseUrl}/${id}`, patch)
      .pipe(map(response => response.data));
  }

  updateStatus(id: string, status: DonationStatus): Observable<Donation> {
    return this.http.patch<ApiResponse<Donation>>(`${this.baseUrl}/${id}/status`, { status })
      .pipe(map(response => response.data));
  }

  remove(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`)
      .pipe(map(() => void 0));
  }

  getStats(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/stats/summary`)
      .pipe(map(response => response.data));
  }
} 