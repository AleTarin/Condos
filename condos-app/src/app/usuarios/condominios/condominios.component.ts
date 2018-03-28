import { Component, OnInit } from '@angular/core';
import { CondosService } from '../../services/condos/condos.service';
import { Condo, Propiedad } from '../../shared/interfaces/condo';


@Component({
  selector: 'app-condominios',
  templateUrl: './condominios.component.html',
  styleUrls: ['./condominios.component.scss']
})
export class CondominiosComponent implements OnInit {

  condos: any;
  constructor(private condoService: CondosService) { }

  ngOnInit() {
    // Obtiene todos los condominios
    this.condoService.getAll().subscribe(condos => {
      console.log('get all', condos);
    });

    // Obtiene todos los condominios administrados por un usuario (el que se utilizara en la pantalla)
    this.condoService.getByUser('ale.tarin10@gmail.com').subscribe(condos => {
      console.log('get by user', condos);
      // Lo guardamos en la variable condos para usarlo en el template
      this.condos = condos;
    });

    const newCondo = new Condo(
      'Alejandro',
      'SA de CV',
      '8181818181',
      '83838383',
      'calle_condo',
      'numext',
      'numint',
      'colonia_condo',
      'ciudad_condo',
      'ciudad_condo',
      '66666',
      'Mexico',
      'path a la imag',
      'activo',
      []
    );

    // Create, crear un nuevo condominio, recibe un objeto condominio
    // this.condoService.create(newCondo).subscribe(res => {
    //   console.log('Create condo', res);
    // });

    // Patch, se utiliza para actualizar el condominio, pasa un objeto condominio con los nuevos datos
    // this.condoService.patch(newCondo).subscribe(res => {
    //   console.log('Patch condo');
    // });
  }

}
