import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'https://localhost:7172/api/Users/login'

  constructor(private http: HttpClient) { }

  login(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
