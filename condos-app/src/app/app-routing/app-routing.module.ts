import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomePageComponent } from '../welcome/welcome-page/welcome-page.component';
import { AdminMainComponent } from '../admin/admin-main/admin-main.component';
import { PropietaryMainComponent } from '../propietary/propietary-main/propietary-main.component';

const routes: Routes = [
  {path: 'home', component: WelcomePageComponent},
  {path: 'admin', component: AdminMainComponent},
  {path: 'propietary', component: PropietaryMainComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
