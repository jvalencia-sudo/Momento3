import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private apiUrl = 'http://tuapi.com/auth';
  private apiUrl = 'assets/data/data.json';

  constructor(private http: HttpClient, private router: Router) {}

  // login(email: string, password: string): Observable<any> {
  //   return this.http.post(this.apiUrl + '/login', { email, password });
  // }
  login(email: any, password: any): Observable<any> {
    return this.http.get<{usuarios: any[]}>(this.apiUrl).pipe(
      map(response => {
        const user = response.usuarios.find(u => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem('user', JSON.stringify({ email: user.email }));
          // save localstorage with datetime now
          localStorage.setItem('loginTime', JSON.stringify({ loginTime: new Date().getTime() }));
          // save ip address


          return { success: true, message: 'Login exitoso' };
        } else {
          throw new Error('Credenciales inválidas');
        }
      }),
      catchError(error => of({ success: false, message: error.message }))
    );
  }
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');

    this.router.navigate(['/login']);
  }
  isLoggedIn(): boolean {
    // Obtener el tiempo de inicio de sesión desde localStorage y convertirlo a entero
    let loginTime = localStorage.getItem('loginTime');
    let loginData = loginTime ? JSON.parse(loginTime) : '';

    console.log(loginData.loginTime);
    //get current time
    let currentTime = new Date().getTime();
    //get time difference in seconds
    let timeDiff = currentTime - loginData.loginTime;
    //get time difference in minutes
    let timeDiffMinutes = timeDiff / 60000;
    console.log(timeDiffMinutes);
    // if time difference is greater than 30 minutes, logout
    if (timeDiffMinutes > 2) {
      this.logout();
    }

    return !!localStorage.getItem('user');
  }
}
