import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomePageComponent } from '../welcome/welcome-page/welcome-page.component';
import { AdminMainComponent } from '../usuarios/admin/admin-main/admin-main.component';
import { PropietaryMainComponent } from '../usuarios/propietary/propietary-main/propietary-main.component';
import { InquilinoComponent } from '../usuarios/inquilino/inquilino.component';
import { UsuariosComponent } from '../usuarios/usuarios/usuarios.component';
import { CondominiosComponent } from '../usuarios/condominios/condominios.component';
import { ReadCsvComponent } from '../usuarios/propietary/read-csv/read-csv.component';
import { UploadCsvComponent } from '../usuarios/propietary/upload-csv/upload-csv.component';
import { FilesComponent } from '../usuarios/files/files.component';

const routes: Routes = [
  {path: 'home', component: WelcomePageComponent},
  {path: 'admin', component: AdminMainComponent},
  {path: 'propietario', component: PropietaryMainComponent},
  {path: 'inquilino', component: InquilinoComponent},
  {path: 'usuarios', component: UsuariosComponent},
  {path: 'condominios', component: CondominiosComponent},
  {path: 'presupuestos', component: ReadCsvComponent},
  {path: 'documentos', component: FilesComponent},
  {path: 'upload-presupuestos', component: UploadCsvComponent},
  // {path: '', redirectTo: 'home', pathMatch: 'full'},
  // {path: '**', redirectTo: 'home', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
