import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import { User } from '../shared/interfaces/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  passwordForm: FormGroup;
  loginForm: FormGroup;
  user: User;
  modalRef: BsModalRef;

  constructor(private modalService: BsModalService, private router: Router) {}

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
  }

  closeOpen(template: TemplateRef<any>) {
    this.modalRef.hide();
    this.modalRef = this.modalService.show(template);
  }

  login() {
    console.log('Login ' + JSON.stringify(this.loginForm.value));
    this.router.navigate(['/admin']);
    this.modalRef.hide();
  }

  newPassword() {
  }

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
      password: new FormControl([
        Validators.required,
        Validators.minLength(4),
      ]),
      confirm: new FormControl(),
      send: new FormControl(),
    });
  }

}
