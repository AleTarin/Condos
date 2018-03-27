import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { LocalstorageService } from '../../services/localstorage.service';
import { AccordionModule, ModalModule, BsModalService } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { User } from '../../shared/interfaces/user';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit, OnDestroy {
  timerSubscription: Subscription;
  userSubscription: Subscription;

  adminCondo: string;
  adminName: string;
  toBeDeleted: string;

  editForm: FormGroup;
  userForm: FormGroup;

  inquilinoCheck: boolean;
  admiCheck: boolean;
  propCheck: boolean;

  modalRef: any;
  user: any;

  createMessage: string;

  constructor(
    private storage: LocalstorageService, private UserServ: UserService , private modalService: BsModalService) { }

  ngOnInit() {
    this.userForm = new FormGroup({ // __________________ To create new user
      username: new FormControl('', [ Validators.required , Validators.minLength(4), Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)]),
      name:  new FormControl('', [ Validators.required , Validators.minLength(4)]),
      paterno: new FormControl('', [ Validators.required , Validators.minLength(4)]),
      materno: new FormControl('', [ Validators.required , Validators.minLength(4)]),
      rfc: new FormControl('', [ Validators.required , Validators.minLength(4)]),
      aniversario: new FormControl('', [ Validators.required , Validators.minLength(4)]),
      tipo_persona: new FormControl('', [ Validators.required ]),
      tel_movil:  new FormControl('', [ Validators.required , Validators.minLength(4)]),
      tel_directo: new FormControl('', [ Validators.required , Validators.minLength(4)]),
      calle: new FormControl('', [ Validators.required , Validators.minLength(4)]),
      num_exterior: new FormControl('', [ Validators.required , Validators.minLength(4)]),
      num_interior: new FormControl('', [ Validators.required , Validators.minLength(4)]),
      colonia: new FormControl('', [ Validators.required , Validators.minLength(4)]),
      ciudad: new FormControl('', [ Validators.required , Validators.minLength(4)]),
      localidad: new FormControl('', [ Validators.required , Validators.minLength(4)]),
      estado: new FormControl('', [ Validators.required , Validators.minLength(4)]),
      pais: new FormControl('', [ Validators.required , Validators.minLength(4)]),
      codigo_postal: new FormControl('', [ Validators.required , Validators.maxLength(5), Validators.minLength(5)] ),
      metodo_pago: new FormControl('', [ Validators.required , Validators.minLength(4) ]),
      uso_cfdi: new FormControl('', [ Validators.required ]),
      num_cuenta: new FormControl('', [ Validators.required , Validators.minLength(4)]),
      clabe_cuenta: new FormControl('', [ Validators.required , Validators.minLength(4)]),
      nombre_banco_cuenta: new FormControl('', [ Validators.required , Validators.minLength(4)]),
      nombre_sat_cuenta:  new FormControl('', [ Validators.required , Validators.minLength(4)]),
      estatus:  new FormControl('', [ Validators.required ]),
      tipo: new FormGroup({
        admin: new FormControl(false),
        inquilino: new FormControl(true),
        propietario: new FormControl(false)
      }),
      propiedad: new FormControl('')
    });

    this.editForm = new FormGroup({ // __________________ To edit the user
      username: new FormControl(''),
      password: new FormControl(''),
      name:  new FormControl(''),
      paterno: new FormControl(''),
      materno: new FormControl(''),
      rfc: new FormControl(''),
      aniversario: new FormControl(''),
      tipo_persona: new FormControl(''),
      tel_movil:  new FormControl(''),
      tel_directo: new FormControl(''),
      calle: new FormControl(''),
      num_exterior: new FormControl(''),
      num_interior: new FormControl(''),
      colonia: new FormControl(''),
      ciudad: new FormControl(''),
      localidad: new FormControl(''),
      estado: new FormControl(''),
      pais: new FormControl(''),
      codigo_postal: new FormControl(''),
      metodo_pago: new FormControl(''),
      uso_cfdi: new FormControl(''),
      num_cuenta: new FormControl(''),
      clabe_cuenta: new FormControl(''),
      nombre_banco_cuenta: new FormControl(''),
      nombre_sat_cuenta:  new FormControl(''),
      estatus:  new FormControl(''),
      tipo: new FormGroup({
        admin: new FormControl(),
        inquilino: new FormControl(),
        propietario: new FormControl()
      }),
      propiedad: new FormControl()
    });

    const usuarioPrueba = new User('ale.tarin10@gmail.com', 'admin');
    this.UserServ.patch(usuarioPrueba).subscribe(usuario => {
      console.log(usuario);
    });

    this.subscribeToData();

    this.adminName = this.storage.getfromLocalStorage('currentUser')['admin'][0]['username'];
    this.adminCondo = this.storage.getfromLocalStorage('currentUser')['admin'][0]['condominio'];

    this.user = this.storage.getfromLocalStorage('currentUser')['admin'];
  }

  refreshData() {
    this.userSubscription = this.UserServ.getAllAdmin(this.adminName, this.adminCondo)
    .subscribe(users => {
      this.user = users;
    } );
  }

  subscribeToData() {
    this.timerSubscription = Observable.timer(200)
      .subscribe(() => this.refreshData());
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  openModal(template: TemplateRef<any>, user?: string) {
    if ( user ) {
      this.toBeDeleted = user;
    }
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
    this.toBeDeleted = null;
  }


  deleteUser(user: string) {
    this.UserServ.delete(this.toBeDeleted).subscribe();
    this.refreshData();
    this.closeModal();
  }

  newUser() {
    const adminData = this.userForm.get('tipo').value.admin ? this.adminCondo : false;
    const propData = this.userForm.get('tipo').value.propietario ? this.adminCondo : false;
    const inquilData = this.userForm.get('tipo').value.inquilino ? {
      nombre_condo: this.adminCondo,
      propiedad: this.propiedad.value} : false;

     const nuevoUsuario = new User(
      this.username.value,
      this.password.value,
      this.nombre.value,
      this.paterno.value,
      this.materno.value,
      this.rfc.value,
      this.aniversario.value,
      this.tipo_persona.value,
      this.tel_movil.value,
      this.tel_directo.value,
      this.calle.value,
      this.num_exterior.value,
      this.num_interior.value,
      this.colonia.value,
      this.ciudad.value,
      this.localidad.value,
      this.codigo_postal.value,
      this.estado.value,
      this.pais.value,
      this.metodo_pago.value,
      this.uso_cfdi.value,
      this.num_cuenta.value,
      this.clabe_cuenta.value,
      this.nombre_banco_cuenta.value,
      this.nombre_sat_cuenta.value,
      this.estatus.value,
      adminData,
      propData,
      inquilData
    );

    this.UserServ.create(nuevoUsuario).subscribe(res => this.createMessage = res);
    this.resetUserData();
    this.refreshData();
  }

  resetUserData(): any {
    this.userForm.reset();
  }

  // ──────────────────────────────────────────────────────────────────────GETTERS─────
  // ___________________________________________________________________ New User______
  get username() { return this.userForm.get('username'); }
  get password() { return this.userForm.get('password'); }
  get nombre() { return this.userForm.get('name'); }
  get paterno() { return this.userForm.get('paterno'); }
  get materno() { return this.userForm.get('materno'); }
  get rfc() { return this.userForm.get('rfc'); }
  get aniversario() { return this.userForm.get('aniversario'); }
  get tipo_persona() { return this.userForm.get('tipo_persona'); }
  get tel_movil() { return this.userForm.get('tel_movil'); }
  get tel_directo() { return this.userForm.get('tel_directo'); }
  get calle() { return this.userForm.get('calle'); }
  get num_exterior() { return this.userForm.get('num_exterior'); }
  get num_interior() { return this.userForm.get('num_interior'); }
  get colonia() { return this.userForm.get('colonia'); }
  get ciudad() { return this.userForm.get('ciudad'); }
  get localidad() { return this.userForm.get('localidad'); }
  get codigo_postal() { return this.userForm.get('codigo_postal'); }
  get estado() { return this.userForm.get('estado'); }
  get pais() { return this.userForm.get('pais'); }
  get metodo_pago() { return this.userForm.get('metodo_pago'); }
  get uso_cfdi() { return this.userForm.get('uso_cfdi'); }
  get num_cuenta() { return this.userForm.get('num_cuenta'); }
  get clabe_cuenta() { return this.userForm.get('clabe_cuenta'); }
  get nombre_banco_cuenta() { return this.userForm.get('nombre_banco_cuenta'); }
  get nombre_sat_cuenta() { return this.userForm.get('nombre_sat_cuenta'); }
  get estatus() { return this.userForm.get('estatus'); }
  get admin() { return this.userForm.get('tipo').value['admin']; }
  get propietario() { return this.userForm.get('tipo').value['admin']; }
  get inquilino() { return this.userForm.get('tipo').value['admin']; }
  get propiedad() { return this.userForm.get('propiedad'); }

  // ___________________________________________________________________ Edit User______
  get usernameEdit() { return this.editForm.get('username'); }
  get passwordEdit() { return this.editForm.get('password'); }
  get adminEdit() { return this.editForm.get('tipo').value['admin']; }
  get propietarioEdit() { return this.editForm.get('tipo').value['admin']; }
  get inquilinoEdit() { return this.editForm.get('tipo').value['admin']; }
  get propiedadEdit() { return this.editForm.get('propiedad'); }

}
