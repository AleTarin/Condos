import { Component, OnInit, TemplateRef } from '@angular/core';
import { LocalstorageService } from '../../services/localstorage.service';
import { AccordionModule, ModalModule, BsModalService } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  editForm: FormGroup;
  userForm: FormGroup;

  inquilinoCheck: boolean;
  admiCheck: boolean;
  propCheck: boolean;

  modalRef: any;
  user: any;

  constructor(
    private storage: LocalstorageService, private modalService: BsModalService) { }

  ngOnInit() {
    this.userForm = new FormGroup({ // __________________ To create new user
      username: new FormControl('', [
        Validators.required
      ]),
      password: new FormControl('', Validators.required),
      tipo: new FormGroup({
        admin: new FormControl(false),
        inquilino: new FormControl(false),
        propietario: new FormControl(false)
      }),
      cuarto: new FormControl()
    });

    this.editForm = new FormGroup({ // __________________ To edit the user
      username: new FormControl('', [
        Validators.required
      ]),
      password: new FormControl('', Validators.required),
      tipo: new FormGroup({
        admin: new FormControl(false),
        inquilino: new FormControl(false),
        propietario: new FormControl(false)
      }),
      cuarto: new FormControl()
    });

    this.user = this.storage.getfromLocalStorage('currentUser')['admin'];
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
  }

  deleteUser(user: any) {

  }

  // ──────────────────────────────────────────────────────────────────────GETTERS─────
  // ___________________________________________________________________ New User______
  get username() { return this.userForm.get('username'); }
  get password() { return this.userForm.get('password'); }
  get admin() { return this.userForm.get('tipo').value['admin']; }
  get propietario() { return this.userForm.get('tipo').value['admin']; }
  get inquilino() { return this.userForm.get('tipo').value['admin']; }
  get cuarto() { return this.userForm.get('cuarto'); }
  // ___________________________________________________________________ Edit User______
  get usernameEdit() { return this.editForm.get('username'); }
  get passwordEdit() { return this.editForm.get('password'); }
  get adminEdit() { return this.editForm.get('tipo').value['admin']; }
  get propietarioEdit() { return this.editForm.get('tipo').value['admin']; }
  get inquilinoEdit() { return this.editForm.get('tipo').value['admin']; }
  get cuartoEdit() { return this.editForm.get('cuarto'); }

}
