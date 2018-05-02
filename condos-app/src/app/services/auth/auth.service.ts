import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/shareReplay';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from '../../shared/interfaces/user';
import { LocalstorageService } from '../localstorage.service';

@Injectable()
export class AuthService {

headers: HttpHeaders;
loggedIn$: Observable<boolean>;
private userSubject: BehaviorSubject<User>;
user$: Observable<User>;


  constructor(private http: HttpClient, private storage: LocalstorageService) {
      this.headers = new HttpHeaders().append('Content-Type', 'application/x-www-form-urlencoded');
      const initialUser = JSON.parse(localStorage.getItem('currentUser') || null);
      this.userSubject = new BehaviorSubject(initialUser);
      this.user$ = this.userSubject.asObservable().do(user => {
        if (user) {
          this.storage.saveToLocalStorage(`currentUser`, user);
        }
      });
      this.loggedIn$ = this.user$.map(user => user !== null).shareReplay(1);
  }


  login(username: string, password: string) {
    const body = new HttpParams().set('username', username).set('password', password);

    return this.http.post<any>(environment.endpointAPI + 'validar_login', body, {headers: this.headers})
        .map(user => {
            // login successful if there's a jwt token in the response
            if (user['status'] === 'ok') {
                console.log(user);
                const usuario = user['data'];
                this.userSubject.next(usuario);

                // store user details and jwt token in local storage to keep user logged in between page refreshes
                this.storage.saveToLocalStorage('currentUser', usuario);
                if (usuario['admin'][0]) {
                    return 'admin';
                } else if (usuario['propietario'][0]) {
                    return 'propietario';
                } else if (usuario['inquilino'][0]) {
                    return 'inquilino';
                }
            }
        });
  }

  cambiarPassword(username: string, password_actual: string, password_nueva: string) {
    const body = new HttpParams()
    .set('username', username)
    .set('password_actual', password_actual)
    .set('password_nueva', password_nueva);

    return this.http.post<any>(environment.endpointAPI + 'cambiar_password', body, {headers: this.headers})
        .map(res => {
            return res['data'];
        });
  }

  correoOlvidePassword(username: string) {
    const body = new HttpParams().set('username', username);

    return this.http.post<any>(environment.endpointAPI + 'correo_olvide_password', body, {headers: this.headers})
    .map(res => {
        return res['data'];
    });
  }

  logout() {
      // remove user from local storage to log user out
      this.userSubject.next(null);
      localStorage.removeItem('currentUser');
  }

}
