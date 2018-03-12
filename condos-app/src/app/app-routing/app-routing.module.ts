import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomePageComponent } from '../welcome/welcome-page/welcome-page.component';
import { AdminMainComponent } from '../usuarios/admin/admin-main/admin-main.component';
import { PropietaryMainComponent } from '../usuarios/propietary/propietary-main/propietary-main.component';
import { InquilinoComponent } from '../usuarios/inquilino/inquilino.component';

const routes: Routes = [
  {path: 'home', component: WelcomePageComponent},
  {path: 'admin', component: AdminMainComponent},
  {path: 'propietario', component: PropietaryMainComponent},
  {path: 'inquilino', component: InquilinoComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
