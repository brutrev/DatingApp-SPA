import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public decodedToken: any;
  baseUrl = 'http://localhost:5000/api/auth/';
  jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  login(userForLogin: any) {
    return this.http.post(this.baseUrl + 'login', userForLogin).pipe(
      map((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.decodedToken = this.jwtHelper.decodeToken(response.token);
          console.log(this.decodedToken);
        }
      })
    );
  }

  register(userForRegister: any) {
    return this.http.post(this.baseUrl + 'register', userForRegister);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
}
