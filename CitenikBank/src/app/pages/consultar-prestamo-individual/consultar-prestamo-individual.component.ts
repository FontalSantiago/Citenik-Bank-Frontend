//SISTEMA
import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import localeEsAr from '@angular/common/locales/es-AR';
import { registerLocaleData } from '@angular/common';
import * as moment from 'moment';

//COMPONENTES
import { CuotaClass } from 'src/app/core/models/cuota';
import { PrestamoClass } from 'src/app/core/models/prestamo';
import { ClienteClass } from 'src/app/core/models/cliente';
import { PlanClass } from 'src/app/core/models/plan';
import { ComposicionDetalladaClass } from 'src/app/core/models/composicionDetallada';

//SERVICIOS
import { CuotaService } from 'src/app/core/services/cuota.service';
import { PrestamoService } from 'src/app/core/services/prestamo.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { PlanService } from 'src/app/core/services/plan.service';

registerLocaleData(localeEsAr, 'es-Ar');
@Component({
  selector: 'app-consultar-prestamo-individual',
  templateUrl: './consultar-prestamo-individual.component.html',
  styleUrls: ['./consultar-prestamo-individual.component.css'],
})
export class ConsultarPrestamoIndividualComponent implements OnInit {
  //VARIABLES DE DATOS
  @Output() PrestamoConsultaSeleccionado: any;
  tipoOrdenamiento: number = 1;
  idCuotaSeleccionada: number;
  currentPage = 1; 
  itemsPerPage = 50; 
  maxSize = 5;

  titulo: string;
  propiedadOrdenamiento: string = 'id';

  tieneCuotaPagar: boolean = false;

  //VARIABLES DE OBJETOS LIST
  ComposicionesCuota: ComposicionDetalladaClass[] = [];
  CuotasPrestamo: CuotaClass[] = [];

  //VARIABLES DE CLASES
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
  ClienteSeleccionado: ClienteClass = new ClienteClass(
    0,
    0,
    '',
    '',
    '',
    new Date(),
    true
  );
  PlanSeleccionado: PlanClass = new PlanClass(
    0,
    '',
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    new Date(),
    new Date()
  );

  //FORMULARIOS PARA AGRUPACIÓN DE DATOS
  formConsulta: FormGroup;

  constructor(
    private servicioPrestamos: PrestamoService,
    private servicioClientes: ClienteService,
    private servicioPlanes: PlanService,
    private servicioCuotas: CuotaService,
    private formBuilder: FormBuilder
  ) {
    this.formConsulta = this.formBuilder.group({
      idPrestamo: new FormControl(null),
      monto: new FormControl(null),
      cantidadCuotas: new FormControl(null),
      fechaOtorgamiento: new FormControl(null),
      nombreCliente: new FormControl(null),
      CUIT: new FormControl(null),
      fechaNacimiento: new FormControl(null),
      nombrePlan: new FormControl(null),
      TNA: new FormControl(null),
      costoOtorgamiento: new FormControl(null),
      cuotaPrecancelacion: new FormControl(null),
      multaPrecancelacion: new FormControl(null),
    });
  }

  ngOnInit(): void {
    scrollTo(0, 0);
    this.recibirDatosPrestamo();
    if (this.PrestamoConsultaSeleccionado == undefined) {
      location.href = '/consultar-prestamo';
    }
    this.obtenerCuotasPrestamo();
  }

  //Almacena en una variable local el prestamo seleccionado en la pantalla de Consulta y en base a el se desplegara toda su información.
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

      this.servicioPrestamos
        .obtenerPrestamo(this.PrestamoConsultaSeleccionado.id)
        .subscribe((data) => {
          this.PrestamoSeleccionado = data;
          this.obtenerDatosPrestamo();
        });
    }
  }

  //Obtiene las cuotas del prestamo que se consulto y las muestra en un listado.
  obtenerCuotasPrestamo() {
    this.servicioCuotas
      .listarCuotas(this.PrestamoConsultaSeleccionado.id)
      .subscribe((data) => {
        this.CuotasPrestamo = data;

        this.CuotasPrestamo.forEach((cuota) => {
          if (cuota.fechaPago == null) {
            this.tieneCuotaPagar = true;
          }
        });
      });
  }

  //Almacena el id de la cuota que fue seleccionado en la tabla de cuotas de un prestamo particular dentro de la variable local.
  esFilaSeleccionada(idCuota: number) {
    this.idCuotaSeleccionada = idCuota;
  }

  //Metodos para grilla
  //Almacena en una variable la propiedad por la cual se quiere ordenar la consulta de clientes.
  ordenarPor(propiedad: string) {
    this.tipoOrdenamiento =
      propiedad === this.propiedadOrdenamiento ? this.tipoOrdenamiento * -1 : 1;
    this.propiedadOrdenamiento = propiedad;
  }

  //En base a la propiedad por la que se quiera ordenar y el tipo de orden muestra un icono.
  ordenarIcono(propiedad: string) {
    if (propiedad === this.propiedadOrdenamiento) {
      return this.tipoOrdenamiento === 1 ? '🠉' : '🠋';
    }
    return '🠋🠉';
  }

  //Separa de un numero su parte entera y su parte decimal.
  separarNumeroDecimal(numero: number, pos: number): string {
    var separador = numero.toString().split(',');
    var valor = separador[pos].trim();
    return valor;
  }

  //Obtiene los datos del Cliente y el Plan asociados al Prestamo consultado para visualizarlos en detalle.
  async obtenerDatosPrestamo() {
    await this.servicioClientes
      .obtenerCliente(this.PrestamoSeleccionado.idCliente)
      .subscribe(async (data) => {
        data.fecha_nacimiento = moment(data.fecha_nacimiento)
          .format('YYYY-MM-DD')
          .toString();
        this.ClienteSeleccionado = data;
      });

    await this.servicioPlanes
      .obtenerPlan(this.PrestamoSeleccionado.idPlan)
      .subscribe(async (data) => {
        data.tna = new Intl.NumberFormat('es-Ar', {
          style: 'currency',
          currency: 'ARS',
        })
          .format(data.tna)
          .replace('$', '')
          .trim();

        data.costoOtorgamiento = new Intl.NumberFormat('es-Ar', {
          style: 'currency',
          currency: 'ARS',
        }).format(data.costoOtorgamiento);
        this.PlanSeleccionado = data;

        data.precanMulta = new Intl.NumberFormat('es-Ar', {
          style: 'currency',
          currency: 'ARS',
        })
          .format(data.precanMulta)
          .replace('$', '')
          .trim();
      });
  }

  //Envia los datos del préstamo seleccionado a la página donde se visualizaran los datos a detalle.
  enviarDatos() {
    let capitalPrestamo = this.PrestamoConsultaSeleccionado.capital
      .replace('$', '')
      .trim();
    if (capitalPrestamo.toString().includes(',')) {
      let parteEnteraMax = this.separarNumeroDecimal(
        capitalPrestamo,
        0
      ).replace(/\./g, '');
      let parteDecimalMax = this.separarNumeroDecimal(capitalPrestamo, 1);
      capitalPrestamo = parseFloat(parteEnteraMax + '.' + parteDecimalMax);
    } else {
      capitalPrestamo = parseInt(capitalPrestamo.toString().replace(/\./g, ''));
    }
    this.PrestamoConsultaSeleccionado.capital = capitalPrestamo;
    this.servicioPrestamos.enviarPrestamoSeleccionado(
      this.PrestamoConsultaSeleccionado
    );
  }

  //Metodos para grilla
  //Permite abrir un Modal u otro en función del titulo pasado como parametro.
  abrirModal(opcion: string) {
    if (opcion == 'Ver Composición') {
      this.titulo = opcion;
    }
  }

  //Obtiene las composiciones de la cuota que se selecciona, visualizando por pantalla cada una de sus composiciones.
  obtenerComposicionesCuota() {
    this.servicioCuotas
      .listarComposicionesCuota(
        this.PrestamoConsultaSeleccionado.id,
        this.idCuotaSeleccionada
      )
      .subscribe((data) => {
        this.ComposicionesCuota = data;
      });
  }
  get pages() {
    const pageCount = Math.ceil(this.ComposicionesCuota.length / this.itemsPerPage);
    const pages = [];

    for (let i = 1; i <= pageCount; i++) {
      pages.push(i);
    }

    return pages;
  }
}
