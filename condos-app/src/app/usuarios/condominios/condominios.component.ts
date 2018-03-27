import { Component, OnInit } from '@angular/core';
import { CondosService } from '../../services/condos/condos.service';
import { Condo, Propiedad } from '../../shared/interfaces/condo';


@Component({
  selector: 'app-condominios',
  templateUrl: './condominios.component.html',
  styleUrls: ['./condominios.component.scss']
})
export class CondominiosComponent implements OnInit {

  constructor(private condoService: CondosService) { }

  ngOnInit() {
    this.condoService.getAll().subscribe(condos => {
      console.log('get all', condos);
    });

    this.condoService.getByUser('ale.tarin10@gmail.com').subscribe(condos => {
      console.log('get by user', condos);
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

    this.condoService.create(newCondo).subscribe(res => {
      console.log('Create condo', res);
    });

    this.condoService.patch(newCondo).subscribe(res => {
      console.log('Patch condo');
    });
  }

}
