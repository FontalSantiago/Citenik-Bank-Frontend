//SISTEMA
import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import localeEsAr from '@angular/common/locales/es-AR';
import { registerLocaleData } from '@angular/common';
import * as moment from 'moment';

//COMPONENTES
import { CuotaClass } from 'src/app/core/models/cuota';
import { PrestamoClass } from 'src/app/core/models/prestamo';
import { ComposicionDetalladaClass } from 'src/app/core/models/composicionDetallada';
import { CuotaVencidaClass } from 'src/app/core/models/cuotaVencida';

//SERVICIOS
import { PrestamoService } from 'src/app/core/services/prestamo.service';
import { PagoService } from 'src/app/core/services/pago.service';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { CuotaService } from 'src/app/core/services/cuota.service';

registerLocaleData(localeEsAr, 'es-Ar');

@Component({
  selector: 'app-consultar-pagar-prestamo',
  templateUrl: './consultar-pagar-prestamo.component.html',
  styleUrls: ['./consultar-pagar-prestamo.component.css'],
})
export class ConsultarPagarPrestamoComponent implements OnInit {
  //VARIABLES DE DATOS
  @Output() PrestamoConsultaSeleccionado: any;

  tipoOrdenamiento: number = 1;
  montoTotal: number = 0;

  fechaActual = moment(new Date()).format('YYYY-MM-DD').toString();
  titulo: string;
  propiedadOrdenamiento: string = 'id';

  //VARIABLES DE OBJETOS LIST
  ComposicionesCuota: ComposicionDetalladaClass[] = [];
  CuotasPrestamo: CuotaClass[] = [];

  //VARIABLES DE CLASES
  cuotaVencida: CuotaVencidaClass = new CuotaVencidaClass(
    0,
    0,
    0,
    new Date(),
    new Date(),
    0,
    0
  );

  PrestamoSeleccionado: PrestamoClass = new PrestamoClass(
    0,
    0,
    0,
    0,
    0,
    new Date(),
    0,
    ''
  );
  composicionVencimiento: ComposicionDetalladaClass =
    new ComposicionDetalladaClass(4, 'Interes Punitorio', 0);

  //FORMULARIOS PARA AGRUPACIÓN DE DATOS
  formConsulta: FormGroup;

  constructor(
    private servicioPrestamos: PrestamoService,
    private servicioPagos: PagoService,
    private servicioCuotas: CuotaService,
    private formBuilder: FormBuilder
  ) {
    this.formConsulta = this.formBuilder.group({
      idPrestamo: new FormControl(null),
      monto: new FormControl(null),
      cantidadCuotas: new FormControl(null),
      fechaOtorgamiento: new FormControl(null),
      nroCuota: new FormControl(null),
      fechaVencimiento: new FormControl(null),
      montoCuota: new FormControl(null),
      montoPagar: new FormControl(null),
      fechaPago: new FormControl(null),
    });
  }

  get fechaPago() {
    return this.formConsulta.get('fechaPago');
  }

  async ngOnInit(): Promise<void> {
    scrollTo(0, 0);
    this.recibirDatosPrestamo();
    if (this.PrestamoConsultaSeleccionado == undefined) {
      location.href = '/consultar-prestamo';
    }
    await this.obtenerDatosPrestamo();
    await this.calcularInteresPunitorio();
  }

  //Almacena en una variable local el préstamo seleccionado en la pantalla de Consulta y en base a el se desplegará toda su información.
  recibirDatosPrestamo() {
    this.PrestamoConsultaSeleccionado =
      this.servicioPrestamos.recibirPrestamoSeleccionado();

    if (this.PrestamoConsultaSeleccionado != undefined) {
      this.PrestamoConsultaSeleccionado.fechaOtorgamiento = moment(
        this.PrestamoConsultaSeleccionado.fechaOtorgamiento
      )
        .format('YYYY-MM-DD')
        .toString();

      this.PrestamoConsultaSeleccionado.capital = new Intl.NumberFormat(
        'es-Ar',
        {
          style: 'currency',
          currency: 'ARS',
        }
      ).format(this.PrestamoConsultaSeleccionado.capital);
    }
  }

  //Obtiene los datos de la cuota a pagar, para poder visualizarlos.
  async obtenerDatosPrestamo() {
    await this.servicioPagos
      .obtenerCuotaPagar(this.PrestamoConsultaSeleccionado.id, this.fechaActual)
      .subscribe(async (data) => {
        data.result.value.fechaVen = moment(data.result.value.fechaVen)
          .format('YYYY-MM-DD')
          .toString();
        data.result.value.monto = new Intl.NumberFormat('es-Ar', {
          style: 'currency',
          currency: 'ARS',
        }).format(data.result.value.monto);
        data.result.value.fechaPago = this.fechaActual;

        this.cuotaVencida = await data.result.value;
      });
  }

  //Obtiene las composiciones de la cuota que se selecciona, visualizando por pantalla cada una de ellas.
  async obtenerComposicionesCuota() {
    await this.servicioCuotas
      .listarComposicionesCuota(
        this.PrestamoConsultaSeleccionado.id,
        this.cuotaVencida.id
      )
      .subscribe(async (data) => {
        if (this.cuotaVencida.interesPunitorio != null) {
          data.push(this.composicionVencimiento);
        }
        this.ComposicionesCuota = await data;
      });
  }

  //Metodos para grilla
  //Almacena en una variable la propiedad por la cual se quiere ordenar la consulta de préstamos.
  ordenarPor(propiedad: string) {
    this.tipoOrdenamiento =
      propiedad === this.propiedadOrdenamiento ? this.tipoOrdenamiento * -1 : 1;
    this.propiedadOrdenamiento = propiedad;
  }

  //En base a la propiedad por la que se quiera ordenar y el tipo de orden muestra un ícono.
  ordenarIcono(propiedad: string) {
    if (propiedad === this.propiedadOrdenamiento) {
      return this.tipoOrdenamiento === 1 ? '🠉' : '🠋';
    }
    return '🠋🠉';
  }
  //Metodos para grilla

  //Metodos para grilla

  //Calcula el interes punitorio, por defecto calcula para el dia de la fecha actual.
  async calcularInteresPunitorio() {
    let fechaPago = moment(this.formConsulta.get('fechaPago')?.value)
      .format('YYYY-MM-DD')
      .toString();

    await this.servicioPagos
      .obtenerCuotaPagar(this.PrestamoConsultaSeleccionado.id, fechaPago)
      .subscribe(async (data) => {
        data.result.value.fechaVen = moment(data.result.value.fechaVen)
          .format('YYYY-MM-DD')
          .toString();
        data.result.value.fechaPago = moment(fechaPago)
          .format('YYYY-MM-DD')
          .toString();
        if (data.result.value.interesPunitorio > 0) {
          this.composicionVencimiento.monto =
            data.result.value.interesPunitorio;
        } else {
          this.composicionVencimiento.monto = 0;
        }
        this.cuotaVencida = await data.result.value;
        await this.obtenerComposicionesCuota();
      });
  }

  //Confirmación del pago del prestamo, alerta en pantalla. Añade fecha de pago seleccionada.
  pagarPrestamo() {
    let fechaPago = this.formConsulta.get('fechaPago')?.value;

    let montoPagar = new Intl.NumberFormat('es-Ar', {
      style: 'currency',
      currency: 'ARS',
    }).format(this.cuotaVencida.montoPagar);

    this.servicioPagos
      .pagarCuota(this.PrestamoConsultaSeleccionado.id, fechaPago)
      .subscribe(async (data) => {
        Swal.fire({
          text:
            'Se pagó la cuota Nº ' +
            this.cuotaVencida.nroCuota +
            ' del préstamo N° ' +
            this.PrestamoConsultaSeleccionado.id +
            ' por un monto total de' +
            montoPagar,
          icon: 'success',
          position: 'top',
          showConfirmButton: true,
          confirmButtonColor: '#0f425b',
          confirmButtonText: 'Aceptar',
        } as SweetAlertOptions).then((result) => {
          if (result.value == true) {
            return location.reload();
          }
        });
      });
  }
}
