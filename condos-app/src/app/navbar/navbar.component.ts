import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import { User } from '../shared/interfaces/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  mensajeOlvido: any;
  mensajeNewPass: any;
  mensaje: string;
  loginError: boolean;
  passwordForm: FormGroup;
  forgotForm: FormGroup;
  loginForm: FormGroup;
  user: any;
  modalRef: BsModalRef;

  constructor(private modalService: BsModalService, private router: Router, public auth: AuthService, public userService: UserService) {
  }

  // Funciones para abrir y cerrar modales -----------------------
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
  }

  isLogged() {
    return localStorage.getItem('currentUser') !== null ;
  }

  closeOpen(template: TemplateRef<any>) {
    this.modalRef.hide();
    this.modalRef = this.modalService.show(template);
  }
  // --------------------------------------------------------------------------

  // Funcion que se ejecuta al hacer login
  login() {
    const username = this.loginForm.controls['username'].value;
    const password = this.loginForm.controls['password'].value;
    this.auth.login(username, password).subscribe(res => {
      if (res) {
        this.loginError = false;
        this.router.navigate(['/' + res]);
        this.modalRef.hide();
      } else {
        this.loginError = true;
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/home']);
  }

  // Funcion para guardar mandar correo en caso de solicitar la contraseña
  newPassword() {

    this.auth.cambiarPassword(this.passwordForm.controls['username'].value,
    this.passwordForm.controls['password_actual'].value ,
    this.passwordForm.controls['confirm'].value)
    .subscribe( res => this.mensajeNewPass = res);
  }

  forgotPassword() {
    this.auth.correoOlvidePassword(this.forgotForm.controls['username'].value)
    .subscribe( res => this.mensajeOlvido = res);
  }

  // Funcion de ayuda para determinar si la contraseña y la confirmación son iguales
  confirmPassword() {
    return this.user && this.user.password && this.user.confirm && this.user.confirm === this.user.password;
  }



  ngOnInit() {
    this.user = new User();
    this.loginForm = new FormGroup({
      username: new FormControl(this.user.username, [
        Validators.required,
        Validators.minLength(4),
      ]),
      password: new FormControl( this.user.password, [
        Validators.required,
        Validators.minLength(4)]
      ),
      login: new FormControl(true),
    });

    this.passwordForm = new FormGroup({
      username: new FormControl(
        this.user.username, [
        Validators.required,
        Validators.minLength(4),
      ]),
      password_actual: new FormControl(
       [
        Validators.required,
        Validators.minLength(4),
      ]),
      password: new FormControl(
        this.user.password, [
        Validators.required,
        Validators.minLength(4),
      ]),
      confirm: new FormControl(
        this.user.password, [
          Validators.required,
          Validators.minLength(4),
        ]),
      send: new FormControl(),
    });

    this.forgotForm = new FormGroup({
      username: new FormControl([
        Validators.required,
        Validators.minLength(4),
      ]),
      send: new FormControl(),
    });
  }

}
