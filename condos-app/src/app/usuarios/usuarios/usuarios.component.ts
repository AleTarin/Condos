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
  toBeUpdated: string;
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
  oldUser: User;

  createMessage: string;
  patchMessage: string;

  constructor(
    private storage: LocalstorageService, private UserServ: UserService , private modalService: BsModalService) { }

  ngOnInit() {
    this.createNewForm();
    // const usuarioPrueba = new User('ale.tarin10@gmail.com', 'admin');
    // this.UserServ.patch(usuarioPrueba).subscribe(usuario => {
    //   console.log(usuario);
    // });

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

  openEdit(template: TemplateRef<any>, user: string) {
      this.UserServ.getByUsername(user).subscribe( usuario => {
        this.oldUser = usuario;
        if (usuario) {
          this.createEditForm(usuario);
          this.modalRef = this.modalService.show(template);
          console.log(usuario);
        }
      });
  }

  closeModal() {
    this.modalRef.hide();
    this.toBeDeleted = null;
  }

  createEditForm( usuario: User) {
    this.editForm = new FormGroup({ // __________________ To edit the user
      username: new FormControl(usuario.username),
      password: new FormControl(usuario.password),
      name:  new FormControl(usuario.nombre),
      paterno: new FormControl(usuario.paterno),
      materno: new FormControl(usuario.materno),
      rfc: new FormControl(usuario.rfc),
      aniversario: new FormControl(usuario.aniversario),
      tipo_persona: new FormControl(usuario.tipo_persona),
      tel_movil:  new FormControl(usuario.tel_movil),
      tel_directo: new FormControl(usuario.tel_directo),
      calle: new FormControl(usuario.calle),
      num_exterior: new FormControl(usuario.num_exterior),
      num_interior: new FormControl(usuario.num_interior),
      colonia: new FormControl(usuario.colonia),
      ciudad: new FormControl(usuario.ciudad),
      localidad: new FormControl(usuario.localidad),
      estado: new FormControl(usuario.estado),
      pais: new FormControl(usuario.pais),
      codigo_postal: new FormControl(usuario.codigo_postal),
      metodo_pago: new FormControl(usuario.metodo_pago),
      uso_cfdi: new FormControl(usuario.uso_cfdi),
      num_cuenta: new FormControl(usuario.num_cuenta),
      clabe_cuenta: new FormControl(usuario.clabe_cuenta),
      nombre_banco_cuenta: new FormControl(usuario.nombre_banco_cuenta),
      nombre_sat_cuenta:  new FormControl(usuario.nombre_sat_cuenta),
      estatus:  new FormControl(usuario.estatus),
      tipo: new FormGroup({
        admin: new FormControl(),
        inquilino: new FormControl(),
        propietario: new FormControl()
      }),
      propiedad: new FormControl()
    });
  }

  createNewForm() {
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
        inquilino: new FormControl(false),
        propietario: new FormControl(false)
      }),
      propiedad: new FormControl('')
    });
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

    this.UserServ.create(nuevoUsuario).subscribe(res => {
      this.createMessage = res['data'];
      if (res['status'] !== 'error') {
        this.resetUserData();
      }
    });
    this.refreshData();
  }

  patchUser() {
    const editUsuario = new User(
      this.usernameEdit.value,
      this.passwordEdit.value,
      this.nombreEdit.value,
      this.paternoEdit.value,
      this.maternoEdit.value,
      this.rfcEdit.value,
      this.aniversarioEdit.value,
      this.tipo_personaEdit.value,
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
      this.metodo_pagoEdit.value,
      this.uso_cfdiEdit.value,
      this.num_cuentaEdit.value,
      this.clabe_cuentaEdit.value,
      this.nombre_banco_cuentaEdit.value,
      this.nombre_sat_cuentaEdit.value,
      this.estatusEdit.value,
    );
    this.UserServ.patch(editUsuario).subscribe(res => {
      this.patchMessage = res['data'];
    });
    // this.refreshData();
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
  get nombreEdit() { return this.editForm.get('name'); }
  get paternoEdit() { return this.editForm.get('paterno'); }
  get maternoEdit() { return this.editForm.get('materno'); }
  get rfcEdit() { return this.editForm.get('rfc'); }
  get aniversarioEdit() { return this.editForm.get('aniversario'); }
  get tipo_personaEdit() { return this.editForm.get('tipo_persona'); }
  get tel_movilEdit() { return this.editForm.get('tel_movil'); }
  get tel_directoEdit() { return this.editForm.get('tel_directo'); }
  get calleEdit() { return this.editForm.get('calle'); }
  get num_exteriorEdit() { return this.editForm.get('num_exterior'); }
  get num_interiorEdit() { return this.editForm.get('num_interior'); }
  get coloniaEdit() { return this.editForm.get('colonia'); }
  get ciudadEdit() { return this.editForm.get('ciudad'); }
  get localidadEdit() { return this.editForm.get('localidad'); }
  get codigo_postalEdit() { return this.editForm.get('codigo_postal'); }
  get estadoEdit() { return this.editForm.get('estado'); }
  get paisEdit() { return this.editForm.get('pais'); }
  get metodo_pagoEdit() { return this.editForm.get('metodo_pago'); }
  get uso_cfdiEdit() { return this.editForm.get('uso_cfdi'); }
  get num_cuentaEdit() { return this.editForm.get('num_cuenta'); }
  get clabe_cuentaEdit() { return this.editForm.get('clabe_cuenta'); }
  get nombre_banco_cuentaEdit() { return this.editForm.get('nombre_banco_cuenta'); }
  get nombre_sat_cuentaEdit() { return this.editForm.get('nombre_sat_cuenta'); }
  get estatusEdit() { return this.editForm.get('estatus'); }

}
