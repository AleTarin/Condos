import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Condo } from '../../shared/interfaces/condo';

@Injectable()
export class CondosService {
  headers: HttpHeaders;

  constructor(private http: HttpClient) {
  }

  getAll() {
      return this.http.get<Condo[]>(environment.endpointAPI + 'condominios', {headers: this.headers});
  }

  getByUser(username: string) {
      return this.http.get<Condo[]>(environment.endpointAPI + 'condominios/' + username , {headers: this.headers});
  }

  // ────────────────────────────────────────────────────────── CREA UN CONDO ─────
  //   actualiza la informacion de un condo (no se tienen que enviar todos los campos ni de condo ni de propiedad)
  // {
  // 	"nombre" : no se puede modificar el nombre del condo
  // 	"razon_social" : "SA de CV",
  // 	"tel_movil" : "8181818181",
  // 	"tel_directo" : "83838383",
  // 	"calle" : "calle_condo",
  // 	"num_exterior" : "numext",
  // 	"num_interior" : "numint",
  // 	"colonia" : "colonia_condo",
  // 	"ciudad" : "ciudad_condo",
  // 	"localidad" : normalmente es lo mismo que ciudad,
  // 	"codigo_postal" : "66666",
  // 	"estado"
  // 	"pais" : "Mexico",
  // 	"imagen" : path a la imagen
  // 	"estatus" : activo o no activo
  // 	propiedades: [
  // 		{
  // 			"identificador" : no se puede modificar identificador de la propiedad
  // 			"indiviso" : "",
  // 			"propietario" : "a00811931@gmail.com",
  // 			"responsable" : "a00811931@gmail.com",
  // 			"estatus" : ocupado, desocupado o no activo
  // 		}
  // 	]
  // }
  // ──────────────────────────────────────────────────────────────────────────────
  create (condo: Condo) {
      return this.http.post<string>(environment.endpointAPI + 'condominios', condo)
      .map(res => {
          return res;
      });
  }

  patch(condo: Condo) {
      return this.http.patch(environment.endpointAPI + 'condominios', condo , {headers: this.headers});
  }

  delete(username: string) {
      return this.http.delete(environment.endpointAPI + 'condominios/' + username);
  }

  createProperty (condo: string, propiedad: string, usuario: string) {
      return this.http.post<string>(environment.endpointAPI + 'propiedades/'
                                                            + condo + '/'
                                                            + propiedad + '/'
                                                            + usuario, {}).map(res => res);
  }

  getAllProperties (condo: string) {
      return this.http.get(environment.endpointAPI + 'propiedades/' + condo, {headers: this.headers});
  }

  deleteProperty(property: string) { 
    return this.http.delete(environment.endpointAPI + 'propiedades/' + property, {headers: this.headers}) ;
  }

}
