import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';
import { LocalstorageService } from '../services/localstorage.service';
import { InquilinoComponent } from './inquilino/inquilino.component';
import { AdminMainComponent } from './admin/admin-main/admin-main.component';
import { PropietaryMainComponent } from './propietary/propietary-main/propietary-main.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AccordionModule, AccordionComponent, ModalModule } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CondominiosComponent } from './condominios/condominios.component';
import { RouterModule } from '@angular/router';
import { UploadCsvComponent } from './propietary/upload-csv/upload-csv.component';
import { ReadCsvComponent } from './propietary/read-csv/read-csv.component';
import { FilesComponent } from './files/files.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ListFilesComponent } from './list-files/list-files.component';
import { PropiedadesComponent } from './propiedades/propiedades.component';



@NgModule({
  imports: [
    CommonModule,
    AccordionModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    RouterModule
  ],
  declarations: [
    InquilinoComponent,
    AdminMainComponent,
    PropietaryMainComponent,
    ReadCsvComponent,
    UploadCsvComponent,
    UsuariosComponent,
    CondominiosComponent,
    UploadCsvComponent,
    ReadCsvComponent,
    FilesComponent,
    ListFilesComponent,
    PropiedadesComponent,
  ],
  providers: [LocalstorageService, AccordionComponent]
})
export class UsuariosModule { }
