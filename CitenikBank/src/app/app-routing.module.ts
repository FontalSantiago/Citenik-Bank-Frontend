//SISTEMA
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//COMPONENTES
import { AltaClienteComponent } from './pages/alta-cliente/alta-cliente.component';
import { ConsultarClienteComponent } from './pages/consultar-cliente/consultar-cliente.component';
import { HomeComponent } from './pages/_home/home.component';
import { AltaModificacionPlanComponent } from './pages/alta-modificacion-plan/alta-modificacion-plan.component';
import { ConsultarPlanComponent } from './pages/consultar-plan/consultar-plan.component';
import { IngresarUsuarioComponent } from './pages/ingresar-usuario/ingresar-usuario.component';
import { AltaModificacionPrestamoComponent } from './pages/alta-modificacion-prestamo/alta-modificacion-prestamo.component';
import { ConsultarPrestamoComponent } from './pages/consultar-prestamo/consultar-prestamo.component';
import { ConsultarPrestamoIndividualComponent } from './pages/consultar-prestamo-individual/consultar-prestamo-individual.component';
import { RouteguardsGuard } from './routeguards.guard';
import { ConsultarPagarPrestamoComponent } from './pages/consultar-pagar-prestamo/consultar-pagar-prestamo.component';
import { ConsultarEstadisticaComponent } from './pages/consultar-estadistica/consultar-estadistica.component';


//RUTAS
const routes: Routes = [
  {path: '', component: IngresarUsuarioComponent},
  {path: 'home', component: HomeComponent, canActivate: [RouteguardsGuard]},
  {path: 'alta-cliente', component: AltaClienteComponent, canActivate: [RouteguardsGuard]},
  {path: 'consultar-cliente', component: ConsultarClienteComponent, canActivate: [RouteguardsGuard]},
  {path: 'alta-modificacion-plan', component: AltaModificacionPlanComponent, canActivate: [RouteguardsGuard]},
  {path: 'consultar-plan', component: ConsultarPlanComponent, canActivate: [RouteguardsGuard]},
  {path: 'alta-modificacion-prestamo', component: AltaModificacionPrestamoComponent, canActivate: [RouteguardsGuard]},
  {path: 'consultar-prestamo', component: ConsultarPrestamoComponent, canActivate: [RouteguardsGuard]},
  {path: 'consultar-prestamo-individual', component: ConsultarPrestamoIndividualComponent, canActivate: [RouteguardsGuard]},
  {path: 'consultar-pagar-prestamo', component: ConsultarPagarPrestamoComponent, canActivate: [RouteguardsGuard]},
  {path: 'consultar-estadistica', component: ConsultarEstadisticaComponent, canActivate: [RouteguardsGuard]},
   {path: '', redirectTo: '/', pathMatch: 'full'},
  {path: '**', redirectTo: '/', pathMatch: 'full'},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
