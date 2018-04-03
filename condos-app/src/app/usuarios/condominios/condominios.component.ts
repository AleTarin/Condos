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

  username: string;
  condos: Condo[];

    // Obtiene todos los condominios
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

  // _______________________________________________________________LIFE CYCLE's FUNCTIONS
  ngOnInit() {

    this.createNewForm();
    this.username = this.storage.getfromLocalStorage('currentUser')['admin'][0].username;
    this.condoService.getByUser(this.username).subscribe(condos => {
      this.condos = condos;
    });
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

  // _________________________________________________________________________ DATA MANAGEMENT FUNCTIONS
  refreshData() {
    this.condoService.getByUser(this.username).subscribe(condos => {
      this.condos = condos;
    });
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
      [],
      this.username
    );

    this.condoService.create(nuevoCondominio).subscribe(res => {
      if (res['status'] === 'ok') {
        this.resetCondoData();
        this.refreshData();
      }
      this.createMessage = res['data'];
    } );
  }

  patchCondominio() {
    const editCondo = new Condo(
      this.nombreEdit.value,
      this.razon_socialEdit.value,
      this.tel_movilEdit.value,
      this.tel_directoEdit.value,
      this.calleEdit.value,
      this.num_exteriorEdit.value,
      this.num_interiorEdit.value,
      this.coloniaEdit.value,
      this.ciudadEdit.value,
      this.localidadEdit.value,
      this.codigo_postalEdit.value,
      this.estadoEdit.value,
      this.paisEdit.value,
      'path a la img',
      this.estatusEdit.value,
      []
    );

    this.condoService.patch(editCondo).subscribe(res => {
      this.patchMessage = res['data'];
    });
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
