import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { CondosService } from '../../services/condos/condos.service';
import { Condo } from '../../shared/interfaces/condo';
import { LocalstorageService } from '../../services/localstorage.service';
import { AccordionModule, ModalModule, BsModalService } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-condominios',
  templateUrl: './condominios.component.html',
  styleUrls: ['./condominios.component.scss']
})
export class CondominiosComponent implements OnInit, OnDestroy{

  editForm: FormGroup;
  condominioForm: FormGroup;

  modalRef: any;
  condominio: any;

  toBeDeleted: string;

  timerSubscription: Subscription;
  condoSubscription: Subscription;

  
  createMessage: string;

  constructor(
    private storage: LocalstorageService, private condoService: CondosService , private modalService: BsModalService) { }
ngOnInit() {
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

    this.condominioForm = new FormGroup({ // __________________ To create new condominio
      name: new FormControl('', [ Validators.required , Validators.minLength(4), Validators.email]),
      razon: new FormControl('', [Validators.required, Validators.minLength(4)]),
      short_name:  new FormControl('', [ Validators.required , Validators.minLength(4)]),
      tel_oficina: new FormControl('', [ Validators.required , Validators.minLength(4)]),
      tel_movil: new FormControl('', [ Validators.required , Validators.minLength(4)]),
      codigo_postal: new FormControl('', [ Validators.required , Validators.minLength(4)]),
      calle: new FormControl('', [ Validators.required , Validators.minLength(4)]),
      num_exterior: new FormControl('', [ Validators.required ]),
      num_interior:  new FormControl('', [ Validators.required , Validators.minLength(4)]),
      colonia: new FormControl('', [ Validators.required , Validators.minLength(4)]),
      ciudad: new FormControl('', [ Validators.required , Validators.minLength(4)]),
      localidad: new FormControl('', [ Validators.required , Validators.minLength(4)]),
      estado: new FormControl('', [ Validators.required , Validators.minLength(4)]),
      pais: new FormControl('', [ Validators.required , Validators.minLength(4)])
    });

    this.editForm = new FormGroup({ // __________________ To edit the condominio
      name: new FormControl(''),
      razon: new FormControl(''),
      short_name:  new FormControl(''),
      tel_oficina: new FormControl(''),
      tel_movil: new FormControl(''),
      codigo_postal: new FormControl(''),
      calle: new FormControl(''),
      num_exterior: new FormControl(''),
      num_interior:  new FormControl(''),
      colonia: new FormControl(''),
      ciudad: new FormControl(''),
      localidad: new FormControl(''),
      estado: new FormControl(''),
      pais: new FormControl('')
    });
    this.condoService.create(newCondo).subscribe(res => {
      console.log('Create condo', res);
    });

    // Patch, se utiliza para actualizar el condominio, pasa un objeto condominio con los nuevos datos
    // this.condoService.patch(newCondo).subscribe(res => {
    //   console.log('Patch condo');
    // });
  }
  refreshData() {
    this.condoSubscription = this.condoService.getAll()
    .subscribe(condominios => {
      this.condominio = condominios;
    } );
  }

  subscribeToData() {
    this.timerSubscription = Observable.timer(200)
      .subscribe(() => this.refreshData());
  }

  ngOnDestroy() {
    if (this.condoSubscription) {
      this.condoSubscription.unsubscribe();
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  openModal(template: TemplateRef<any>, condominio?: string) {
    if ( condominio ) {
      this.toBeDeleted = condominio;
    }
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
    this.toBeDeleted = null;
  }


  deleteUser(condominio: string) {
    this.condoService.delete(this.toBeDeleted).subscribe();
    this.refreshData();
    this.closeModal();
  }
  newCondominio() {
    //const adminData = this.condominioForm.get('tipo').value.admin ? this.adminCondo : false;
    //const propData = this.userForm.get('tipo').value.propietario ? this.adminCondo : false;
    //const inquilData = this.userForm.get('tipo').value.inquilino ? {
      //nombre_condo: this.adminCondo,
      //propiedad: this.propiedad.value} : false;

     const nuevoCondominio = new Condo(
      this.nombre.value,
      this.razon_social.value,
      this.tel_movil.value,
      this.tel_directo.value,
      this.calle.value,
      this.num_exterior.value,
      this.num_interior.value,
      this.colonia.value,
      this.localidad.value,
      this.codigo_postal.value,
      this.estado.value,
      this.pais.value,
      this.image.value,
      this.estatus.value,
      this.propiedades.value
      //adminData,
      //propData,
      //inquilData
    );

    this.condoService.create(nuevoCondominio).subscribe(res => this.createMessage = res);
    this.resetUserData();
    this.refreshData();
  }

  resetUserData(): any {
    this.condominioForm.reset();
  }


  // ──────────────────────────────────────────────────────────────────────GETTERS─────
  // ___________________________________________________________________ New User______
  get nombre() { return this.condominioForm.get('nombre'); }
  get razon_social() { return this.condominioForm.get('razon_social'); }
  get tel_movil() { return this.condominioForm.get('tel_movil'); }
  get tel_directo() { return this.condominioForm.get('tel_directo'); }
  get calle() { return this.condominioForm.get('calle'); }
  get num_exterior() { return this.condominioForm.get('num_exterior'); }
  get num_interior() { return this.condominioForm.get('num_interior'); }
  get colonia() { return this.condominioForm.get('colonia'); }
  get localidad() { return this.condominioForm.get('localidad'); }
  get codigo_postal() { return this.condominioForm.get('codigo_postal'); }
  get estado() { return this.condominioForm.get('estado'); }
  get pais() { return this.condominioForm.get('pais'); }
  get image() { return this.condominioForm.get('image'); }
  get estatus() { return this.condominioForm.get('estatus'); }
  get propiedades() { return this.condominioForm.get('porpiedades'); }

  // ___________________________________________________________________ Edit User______
  

}
