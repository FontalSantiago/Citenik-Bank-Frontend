import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';

import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MenuComponent } from './shared/menu/menu.component';
import { CarouselComponent } from './shared/carousel/carousel.component';
import { AppRoutingModule } from './app-routing.module';
import { AltaClienteComponent } from './pages/alta-cliente/alta-cliente.component';
import { ConsultarClienteComponent } from './pages/consultar-cliente/consultar-cliente.component';
import { HomeComponent } from './pages/_home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { ModalComponent } from './shared/modal/modal.component';
import { SortDirective } from './shared/others/directive/sort.directive';
import { AltaModificacionPlanComponent } from './pages/alta-modificacion-plan/alta-modificacion-plan.component';
import { ConsultarPlanComponent } from './pages/consultar-plan/consultar-plan.component';
import { SeparatorDirective } from './shared/others/directive/separator.directive';
import { IngresarUsuarioComponent } from './pages/ingresar-usuario/ingresar-usuario.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './core/interceptors/auth-interceptor.service';
import { AltaModificacionPrestamoComponent } from './pages/alta-modificacion-prestamo/alta-modificacion-prestamo.component';
import { ConsultarPrestamoComponent } from './pages/consultar-prestamo/consultar-prestamo.component';
import { ConsultarPrestamoIndividualComponent } from './pages/consultar-prestamo-individual/consultar-prestamo-individual.component';
import { ConsultarPagarPrestamoComponent } from './pages/consultar-pagar-prestamo/consultar-pagar-prestamo.component';
import { ConsultarEstadisticaComponent } from './pages/consultar-estadistica/consultar-estadistica.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    MenuComponent,
    CarouselComponent,
    AltaClienteComponent,
    ConsultarClienteComponent,
    AltaModificacionPlanComponent,
    ConsultarPlanComponent,
    HomeComponent,
    ModalComponent,
    SortDirective,
    SeparatorDirective,
    IngresarUsuarioComponent,
    AltaModificacionPrestamoComponent,
    ConsultarPrestamoComponent,
    ConsultarPrestamoIndividualComponent,
    ConsultarPagarPrestamoComponent,
    ConsultarEstadisticaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    TextMaskModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
