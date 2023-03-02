import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProspectosDetalleComponent } from './pages/prospectos-detalle/prospectos-detalle.component';
import { ProspectosComponent } from './pages/prospectos/prospectos.component';

const routes: Routes = [
  {path:'', component: ProspectosComponent},
  {path:'prospectos', component: ProspectosComponent},
  {path:'prospectos/:valuar/:id', component: ProspectosDetalleComponent},
  {path:'prospectos-detalle', component: ProspectosDetalleComponent},
  {path:'prospectos-detalle/:id', component: ProspectosDetalleComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
