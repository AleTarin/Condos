import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from '../../shared/interfaces/user';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class UserService {
    usuariosSubject: Subject<User>;
    headers: HttpHeaders;

    constructor(private http: HttpClient) {
        const initialUser = JSON.parse(localStorage.getItem('currentUser') || null);
        this.usuariosSubject = new Subject();
    }

    getAllAdmin(username: string, nombre_condo: string) {
        const b = {'admin_name': username, 'nombre_condo': nombre_condo};
        const body = new HttpParams().set('admin_username', username).set('nombre_condo', nombre_condo);

        return this.http.post<User[]>(environment.endpointAPI + 'lista_manejar_usuarios', b, {headers: this.headers})
            .map(user => {
                return user['data']['admins'];
            });
    }

    getByUsername(username: string) {
        return this.http.get<User>(environment.endpointAPI + 'usuarios/' + username , {headers: this.headers});
    }

    // ────────────────────────────────────────────────────────── CREA UN USUARIO ─────
    // params (json ejemplo):
    // {
    // 	"username" : correo, es la llave primaria
    // 	"password" : "admin",
    // 	"nombre" : "Usuario",
    // 	"paterno" : apellido paterno
    // 	"materno" : apellido materno
    // 	"rfc" : "XAX010101000",
    // 	"aniversario" : fecha de nacimiento
    // 	"tipo_persona" : persona fisica o moral
    // 	"tel_movil" : "8181818181",
    // 	"tel_directo" : "83838383",
    // 	"calle" : "calle_usuario",
    // 	"num_exterior" : "numext_usuario",
    // 	"num_interior" : "numint_usuario",
    // 	"colonia" : "colonia_usuario",
    // 	"ciudad" : "ciudad_usuario",
    // 	"localidad" : normalmente es lo mismo que ciudad
    // 	"codigo_postal" : "66666",
    // 	"estado" : "Nuevo Leon",
    // 	"pais" : "Mexico",
    // 	"metodo_pago" : "",
    // 	"uso_cfdi" : "",
    // 	"num_cuenta" : "",
    // 	"clabe_cuenta" : "",
    // 	"nombre_banco_cuenta" : "",
    // 	"nombre_sat_cuenta" : "",
    // 	"estatus" : activo, no_activo o bloquedao
    // 	admin: nombre del condo que administra o false
    // 	propietario: nombre del condo que administra o false
    // 	inquilino: false o el siguiente json {
    // 		nombre_condo:nombre del condo donde vive,
    // 		propiedad: identificador de la propiedad donde vive
    // 	}
    // }
    // ──────────────────────────────────────────────────────────────────────────────
    create ( usuario: User) {
        return this.http.post<string>(environment.endpointAPI + 'usuarios', usuario)
        .map(res => {
            return res;
        });
    }

    update(user: User) {
        return this.http.put(environment.endpointAPI + 'usuarios/' + user.username, user , {headers: this.headers});
    }

    patch(user: User) {
        return this.http.patch(environment.endpointAPI + 'usuarios', user , {headers: this.headers});
    }

    delete(username: string) {
        return this.http.delete(environment.endpointAPI + 'usuarios/' + username);
    }
}
