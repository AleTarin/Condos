import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../shared/interfaces/user';
import { environment } from '../../../environments/environment';


@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(environment.endpointAPI + 'users');
    }

    getById(id: number) {
        return this.http.get(environment.endpointAPI + 'users/' + id);
    }

    create(user: User) {
        return this.http.post(environment.endpointAPI + 'users', user);
    }

    update(user: User) {
        return this.http.put(environment.endpointAPI + 'users/' + user.id, user);
    }

    delete(id: number) {
        return this.http.delete(environment.endpointAPI + 'users/' + id);
    }
}
