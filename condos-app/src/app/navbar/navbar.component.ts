import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef, BsDropdownModule } from 'ngx-bootstrap';
import { User } from '../shared/interfaces/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';
import { LocalstorageService } from '../services/localstorage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  username: any;
  // Mensajes para el login
  mensajeOlvido: String;
  mensajeNewPass: String;

  actualPassword: String;

  userLogin: User;
  userForgot: User;
  userPassword: User;
  user: User;

  // Switches
  loginError: boolean;

  // Forms
  passwordForm: FormGroup;
  forgotForm: FormGroup;
  loginForm: FormGroup;

  // Referencia para lanzar el modal
  modalRef: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private storage: LocalstorageService,
    private router: Router,
    public auth: AuthService,
    public userService: UserService) {
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
  }

  isLogged() {
    return this.storage.getfromLocalStorage('currentUser') !== null;
  }
  //
  // ─────────────────────────── FUNCION QUE CIERRA EL MODAL ACTUAL Y ABRE OTRO ─────
  closeOpen(template: TemplateRef<any>) {
    this.modalRef.hide();
    this.modalRef = this.modalService.show(template);
  }
  //
  // ───────────────────────────────────────────────── FUNCION PARA HACER LOGIN ─────
  login() {
    const username = this.loginForm.controls['username'].value;
    const password = this.loginForm.controls['password'].value;
    this.auth.login(username, password).subscribe(res => {
      if (res) {
        this.loginError = false;
        this.storage.saveToLocalStorage('username', username);
        this.router.navigate(['/' + res]);
        this.modalRef.hide();
        this.userService.getByUsername(username).subscribe(user => {
          this.user = user;
        });
      } else {
        this.loginError = true;
      }
    });
  }
  //
  // ──────────────────────────────────────────────── FUNCION PARA HACER LOGOUT ─────
  logout() {
    this.auth.logout();
    this.router.navigate(['/home']);
  }
  //
  // _______________________________________ Funcion para guardar mandar correo en caso de solicitar la contraseña
  newPassword() {
    this.auth.cambiarPassword(this.username,
    this.passwordForm.controls['password_actual'].value ,
    this.passwordForm.controls['confirm'].value)
    .subscribe( res => this.mensajeNewPass = res);
  }
  //
  // ___________________________________________________________ Funcion para recuperar la contraseña por la api
  forgotPassword() {
    this.auth.correoOlvidePassword(this.forgotForm.controls['username'].value)
    .subscribe( res => this.mensajeOlvido = res);
  }
  //
  // ___________________________ Funcion de ayuda para determinar si la contraseña y la confirmación son iguales
  confirmPassword() {
    return  this.userPassword &&
            this.userPassword.password &&
            this.userPassword.confirm &&
            this.userPassword.confirm === this.userPassword.password;
  }

  ngOnInit() {
    // const nombre_usuario = this.storage.getfromLocalStorage('username');
    // _____________________________________________________________________ Inicizalizar donde guardar la info
    this.userLogin = new User();
    this.userPassword = new User();
    this.userForgot = new User();
    this.username = this.storage.getfromLocalStorage('username');

    // ____________________________________________________________________________Form para el modal de login
    this.loginForm = new FormGroup({
      username: new FormControl(
        this.userLogin.username, [
        Validators.required,
        Validators.minLength(4),
      ]),
      password: new FormControl(
        this.userLogin.password, [
        Validators.required,
        Validators.minLength(4)]
      ),
      login: new FormControl(true),
    });
    // ________________________________________________________ Form para el modal de asignar una nueva contraseña
    this.passwordForm = new FormGroup({
      password_actual: new FormControl(
        this.actualPassword, [
        Validators.required,
        Validators.minLength(4),
      ]),
      password: new FormControl(
        this.userPassword.password, [
        Validators.required,
        Validators.minLength(4),
      ]),
      confirm: new FormControl(
        this.userPassword.confirm, [
          Validators.required,
          Validators.minLength(4),
        ]),
      send: new FormControl(),
    });
     // ______________________________________________ Form para el modal pedir una la contraseña actual
    this.forgotForm = new FormGroup({
      username: new FormControl(
        this.userForgot.username, [
        Validators.required,
        Validators.minLength(4),
      ]),
      send: new FormControl(),
    }); // ____________________________________________________________________________________________
  }
}
