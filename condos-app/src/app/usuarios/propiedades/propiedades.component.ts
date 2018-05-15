import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Condo } from '../../shared/interfaces/condo';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { LocalstorageService } from '../../services/localstorage.service';
import { CondosService } from '../../services/condos/condos.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-propiedades',
  templateUrl: './propiedades.component.html',
  styleUrls: ['./propiedades.component.scss']
})
export class PropiedadesComponent implements OnInit, OnDestroy {
  properties: Object;
  condo: string;
  username: string;
  condos: Condo[];
  propiedadForm: FormGroup;
  modalRef: any;
  toBeDeleted: string;

  timerSubscription: Subscription;
  propertySubscription: Subscription;

  createMessage: string;

  constructor(
    private storage: LocalstorageService, private condoService: CondosService ,
    private modalService: BsModalService, private route: ActivatedRoute) {
    this.condo = this.route.snapshot.params.condominio;
    }

  // _______________________________________________________________LIFE CYCLE's FUNCTIONS
  ngOnInit() {

    this.createNewForm();
    this.username = this.storage.getfromLocalStorage('username');
    this.condoService.getAllProperties(this.condo).subscribe(
      properties => {
        this.properties = properties;
      }
    );
  }

  ngOnDestroy() {
    if (this.propertySubscription) {
      this.propertySubscription.unsubscribe();
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  // _________________________________________________________________________ DATA MANAGEMENT FUNCTIONS
  refreshData() {
    this.condoService.getAllProperties(this.condo).subscribe(
      properties => {
        this.properties = properties;
      }
    );
  }

  subscribeToData() {
    this.timerSubscription = Observable.timer(200)
      .subscribe(() => this.refreshData());
  }

  deleteProperty() {
    this.condoService.deleteProperty(this.toBeDeleted).subscribe();
    this.closeModal();
    this.subscribeToData();
  }

  newPropiedad() {

    this.condoService.createProperty(this.condo, this.nombre.value, this.username).subscribe(res => {
      this.resetCondoData();
      this.subscribeToData();
      this.createMessage = res;
    } );
  }


  // _______________________________________________ FUNCTIONS TO CREATE REACTIVE FORMS
  createNewForm() {
    this.propiedadForm = new FormGroup({ // __________________ To create new condominio
      name: new FormControl('', [ Validators.required , Validators.minLength(1)]),
    });
  }

  resetCondoData(): any {
    this.propiedadForm.reset();
  }

  // ________________________________________________________ MODAL MANAGMENT FUNCTIONS
  openModal(template: TemplateRef<any>, property?: string) {
    if ( property ) {
      this.toBeDeleted = property;
    }
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
    this.toBeDeleted = null;
  }

  // ──────────────────────────────────────────────────────────────────────GETTERS─────
  // ___________________________________________________________________ New Condo______
  get nombre() { return this.propiedadForm.get('name'); }
}
