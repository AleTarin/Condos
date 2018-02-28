import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthService {

headers: HttpHeaders;
content: string;

  constructor(private http: HttpClient) {
      this.headers = new HttpHeaders().append('Content-Type', 'application/x-www-form-urlencoded');
  }

  login(username: string, password: string) {
      this.content = JSON.stringify({
          username: username,
          password: password
         }
      );
      return this.http.post<any>(environment.endpointAPI + 'validar_login', this.content, {headers: this.headers})
          .map(user => {
              // login successful if there's a jwt token in the response
              if (user) {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  localStorage.setItem('currentUser', JSON.stringify(user));
              }

              return user;
          });
  }

  prueba() {
      return this.http.post<any>(environment.endpointAPI + 'validar_login', {});
  }

  logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('currentUser');
  }

}
