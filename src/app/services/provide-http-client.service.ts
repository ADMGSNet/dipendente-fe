import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionService } from '../session.service';

@Injectable({
  providedIn: 'root',
})
export class ProvideHttpClientService {
  private apiUrl = 'http://3.78.61.196:4100'; // Percorso dell'API tramite proxy

  constructor(private http: HttpClient) {}

  // getData(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}`);
  // }

  postData(payload: any, accessToken: string, refreshToken: string): Observable<any> {
    console.log(`${this.apiUrl}/api`, payload)
    let headers: any = new HttpHeaders({
      'Content-Type': 'application/json',
      'accesstoken': accessToken,
      'refreshtoken': refreshToken
    })

    return this.http.post(`${this.apiUrl}/api`, payload, {headers});
  }

  login(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, payload);
  }
}
