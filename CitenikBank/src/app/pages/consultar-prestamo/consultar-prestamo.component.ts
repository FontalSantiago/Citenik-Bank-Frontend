//SISTEMA
import { Component, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';

//COMPONENTES
import { PrestamoConsultaClass } from 'src/app/core/models/prestamoConsulta';

//SERVICIOS
import { PrestamoService } from 'src/app/core/services/prestamo.service';

@Component({
  selector: 'app-consultar-prestamo',
  templateUrl: './consultar-prestamo.component.html',
  styleUrls: ['./consultar-prestamo.component.css'],
})
export class ConsultarPrestamoComponent implements OnInit {
  //VARIABLES DE DATOS
  tipoOrdenamiento = 1;
  propiedadOrdenamiento: string = 'id';
  paginaActual = 1;
  itemsPorPagina = 50;
  tamanoMaximo = 5;
  mascaraCUIT = [
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
  ];

  //VARIABLES DE OBJETOS LIST
  PrestamosConsulta: PrestamoConsultaClass[] = [];
  PrestamosFiltrados: PrestamoConsultaClass[] = [];
  PrestamosMultiplesFiltrados: PrestamoConsultaClass[] = [];
  PrestamoSeleccionado: PrestamoConsultaClass;
  PlanesListados: string[] = [];

  //FORMS PARA LA AGRUPACIÓN DE DATOS
  formConsulta: FormGroup;

  constructor(
    private fb: FormBuilder,
    private servicioPrestamo: PrestamoService
  ) {
    this.formConsulta = this.fb.group({
      CUIT: new FormControl(null),
      nombrePlan: new FormControl(null),
      capitalMin: new FormControl(null),
      capitalMax: new FormControl(null),
      fechaOtorgamientoDesde: new FormControl(null),
      fechaOtorgamientoHasta: new FormControl(null),
      cuotasPagas: new FormControl(null),
      cuotasVencidasImpagas: new FormControl(null),
      fechaPago: new FormControl(null),
    });
  }

  get CUIT() {
    return this.formConsulta.get('CUIT');
  }

  get nombrePlan() {
    return this.formConsulta.get('nombrePlan');
  }

  get capitalMin() {
    return this.formConsulta.get('capitalMin');
  }

  get capitalMax() {
    return this.formConsulta.get('capitalMax');
  }

  get fechaOtorgamientoDesde() {
    return this.formConsulta.get('fechaOtorgamientoDesde');
  }

  get fechaOtorgamientoHasta() {
    return this.formConsulta.get('fechaOtorgamientoHasta');
  }
  get cuotasPagas() {
    return this.formConsulta.get('cuotasPagas');
  }

  get cuotasVencidasImpagas() {
    return this.formConsulta.get('cuotasVencidasImpagas');
  }

  get fechaPago() {
    return this.formConsulta.get('fechaPago');
  }

  //Verifica la cantidad de páginas, y en base a esto realiza el paginado.
  get pages() {
    const cantidadPaginas = Math.ceil(
      this.PrestamosMultiplesFiltrados.length / this.itemsPorPagina
    );
    const paginas = [];

    for (let i = 1; i <= cantidadPaginas; i++) {
      paginas.push(i);
    }
    return paginas;
  }

  ngOnInit(): void {
    this.obtenerPrestamos();
  }

  //Valida que exista algún préstamo que responda a algún filtro especificado.
  validarFiltrado(): Boolean {
    if (this.PrestamosMultiplesFiltrados.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  //Consulta los ID de los préstamos que se encuentran registrados, buscando sus cuotas y guardando los datos en una lista de Prestamos.
  obtenerPrestamos() {
    this.servicioPrestamo.listarPrestamos().subscribe((data) => {
      this.PrestamosConsulta = data;
      this.PrestamosConsulta.forEach((prestamo) => {
        if (prestamo.estado == 'vigente') {
          this.PrestamosFiltrados.push(prestamo);
        }
        this.PrestamosMultiplesFiltrados = this.PrestamosFiltrados;
        if (!this.PlanesListados.includes(prestamo.nombre)) {
          this.PlanesListados.push(prestamo.nombre);
        }
      });
    });
  }

  //Almacena los datos del préstamo que fue seleccionado en la tabla de prestamos filtrados dentro de variables locales.
  esfilaSeleccionada(prestamo: PrestamoConsultaClass) {
    this.PrestamoSeleccionado = prestamo;
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
  //Metodos para grilla

  //Separa de un numero su parte entera y su parte decimal.
  separarNumeroDecimal(numero: number, pos: number): string {
    var separador = numero.toString().split(',');
    var valor = separador[pos].trim();
    return valor;
  }

  //Filtra los prestamos por CUIT de cliente, Nombre de plan, Capital Inicial, Estado de Préstamo y Estado de Cuotas.
  esFiltrar(
    CUIT: string,
    nombrePlan: string,
    capitalMin: string,
    capitalMax: string,
    fechaOtorgamientoDesde: string,
    fechaOtorgamientoHasta: string,
    cuotasPagas: boolean,
    cuotasVencidasImpagas: boolean
  ) {
    let capitalPrestamoMin: number;
    let capitalPrestamoMax: number;

    if (capitalMin != null && capitalMin != '') {
      if (capitalMin.toString().includes(',')) {
        let parteEnteraMax = this.separarNumeroDecimal(
          parseInt(capitalMin),
          0
        ).replace(/\./g, '');
        let parteDecimalMax = this.separarNumeroDecimal(
          parseInt(capitalMin),
          1
        );
        capitalPrestamoMin = parseFloat(parteEnteraMax + '.' + parteDecimalMax);
      } else {
        capitalPrestamoMin = parseInt(capitalMin.toString().replace(/\./g, ''));
      }
    }

    if (capitalMax != null && capitalMax != '') {
      if (capitalMax.toString().includes(',')) {
        let parteEnteraMax = this.separarNumeroDecimal(
          parseInt(capitalMax),
          0
        ).replace(/\./g, '');
        let parteDecimalMax = this.separarNumeroDecimal(
          parseInt(capitalMax),
          1
        );
        capitalPrestamoMax = parseFloat(parteEnteraMax + '.' + parteDecimalMax);
      } else {
        capitalPrestamoMax = parseInt(capitalMax.toString().replace(/\./g, ''));
      }
    }

    this.PrestamosMultiplesFiltrados = this.PrestamosFiltrados;

    if (CUIT != null) {
      this.PrestamosMultiplesFiltrados =
        this.PrestamosMultiplesFiltrados.filter((x) =>
          x.cuit.replace(/\-/g, '').includes(CUIT.replace(/\-/g, ''))
        );
    }

    if (nombrePlan != null) {
      this.PrestamosMultiplesFiltrados =
        this.PrestamosMultiplesFiltrados.filter((x) =>
          x.nombre.includes(nombrePlan)
        );
    }

    if (capitalPrestamoMin != undefined && capitalPrestamoMax != undefined) {
      this.PrestamosMultiplesFiltrados =
        this.PrestamosMultiplesFiltrados.filter(
          (x) =>
            capitalPrestamoMin <= x.capital && x.capital <= capitalPrestamoMax
        );
    } else {
      if (capitalPrestamoMin != undefined) {
        this.PrestamosMultiplesFiltrados =
          this.PrestamosMultiplesFiltrados.filter(
            (x) => x.capital >= capitalPrestamoMin
          );
      } else {
        if (capitalPrestamoMax != undefined)
          this.PrestamosMultiplesFiltrados =
            this.PrestamosMultiplesFiltrados.filter(
              (x) => x.capital <= capitalPrestamoMax
            );
      }
    }

    if (
      fechaOtorgamientoDesde != null &&
      fechaOtorgamientoDesde != '' &&
      fechaOtorgamientoHasta != null &&
      fechaOtorgamientoHasta != ''
    ) {
      this.PrestamosMultiplesFiltrados =
        this.PrestamosMultiplesFiltrados.filter(
          (x) =>
            moment(fechaOtorgamientoDesde).format('YYYY-MM-DD') <=
              moment(x.fechaOtorgamiento).format('YYYY-MM-DD') &&
            moment(x.fechaOtorgamiento).format('YYYY-MM-DD') <=
              moment(fechaOtorgamientoHasta).format('YYYY-MM-DD')
        );
    } else {
      if (fechaOtorgamientoDesde != null && fechaOtorgamientoDesde != '') {
        this.PrestamosMultiplesFiltrados =
          this.PrestamosMultiplesFiltrados.filter(
            (x) =>
              moment(x.fechaOtorgamiento).format('YYYY-MM-DD') >=
              moment(fechaOtorgamientoDesde).format('YYYY-MM-DD')
          );
      } else {
        if (fechaOtorgamientoHasta != null && fechaOtorgamientoHasta != '') {
          this.PrestamosMultiplesFiltrados =
            this.PrestamosMultiplesFiltrados.filter(
              (x) =>
                moment(x.fechaOtorgamiento).format('YYYY-MM-DD') <=
                moment(fechaOtorgamientoHasta).format('YYYY-MM-DD')
            );
        }
      }
    }

    if (cuotasPagas == true) {
      this.PrestamosMultiplesFiltrados =
        this.PrestamosMultiplesFiltrados.filter((x) => x.cuotasPagas > 0);
    }

    if (cuotasVencidasImpagas == true) {
      this.PrestamosMultiplesFiltrados =
        this.PrestamosMultiplesFiltrados.filter(
          (x) => x.cuotasVencidasImpagas > 0
        );
    }
  }

  //Envia los datos del préstamo seleccionado a la página donde se visualizaran los datos a detalle.
  enviarDatos() {
    this.servicioPrestamo.enviarPrestamoSeleccionado(this.PrestamoSeleccionado);
  }

  //Valida que el préstamo no tenga cuotas a pagar, de ser así se oculta el botón pagar.
  validarPago(prestamo: PrestamoConsultaClass): Boolean {
    if (prestamo.cantidadCuotas == prestamo.cuotasPagas) {
      return false;
    } else {
      return true;
    }
  }
}
