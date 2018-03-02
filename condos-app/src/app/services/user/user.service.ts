import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../../shared/interfaces/user';
import { environment } from '../../../environments/environment';


@Injectable()
export class UserService {
    headers: HttpHeaders;

    constructor(private http: HttpClient) {
        this.headers = new HttpHeaders().append('Content-Type', 'application/x-www-form-urlencoded');
     }

    getAll() {
        return this.http.get<User[]>(environment.endpointAPI + 'usuarios', {headers: this.headers});
    }

    getById(id: number) {
        return this.http.get(environment.endpointAPI + 'usuarios/' + id , {headers: this.headers});
    }

    create(user: User) {
        return this.http.post(environment.endpointAPI + 'usuarios', user , {headers: this.headers}) ;
    }

    update(user: User) {
        return this.http.put(environment.endpointAPI + 'usuarios/' + user.id, user , {headers: this.headers});
    }

    delete(id: number) {
        return this.http.delete(environment.endpointAPI + 'users/' + id);
    }
}
