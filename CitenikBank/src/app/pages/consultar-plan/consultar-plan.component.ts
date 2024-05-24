//SISTEMA
import { Component, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import localeEsAr from '@angular/common/locales/es-AR';
import { registerLocaleData } from '@angular/common';

//COMPONENTES
import { PlanClass } from 'src/app/core/models/plan';

//SERVICIOS
import { PlanService } from 'src/app/core/services/plan.service';

registerLocaleData(localeEsAr, 'es-Ar');
@Component({
  selector: 'app-consultar-plan',
  templateUrl: './consultar-plan.component.html',
  styleUrls: ['./consultar-plan.component.css'],
})
export class ConsultarPlanComponent implements OnInit {
  //VARIABLES DE OBJETOS LIST
  Planes: PlanClass[] = [];
  PlanesFiltrados: PlanClass[] = [];
  PlanesMultiplesFiltrados: PlanClass[] = [];

  //VARIABLES DE DATOS
  propiedadOrdenamiento: string = 'id';
  opcionFiltrado: string = '';
  @Output() planSeleccionado: any;
  mostrarBotonAceptar: boolean = false;
  tipoOrdenamiento = 1;
  paginaActual = 1;
  itemsPorPagina = 50;
  tamanoMaximo = 5;

  //FORMS PARA LA AGRUPACIÓN DE DATOS
  formConsulta: FormGroup;

  constructor(private fb: FormBuilder, private servicioPlan: PlanService) {
    this.formConsulta = this.fb.group({
      nombre: new FormControl(null, Validators.required),
      TNA: new FormControl(null),
      edadMax: new FormControl(null),
      costoOtorgamiento: new FormControl(null),
      capital: new FormControl(null),
      cuota: new FormControl(null),
      vigencia: new FormControl(null),
    });
  }

  get nombre() {
    return this.formConsulta.get('nombre');
  }

  get TNA() {
    return this.formConsulta.get('TNA');
  }

  get edadMax() {
    return this.formConsulta.get('edadMax');
  }

  get costoOtorgamiento() {
    return this.formConsulta.get('costoOtorgamiento');
  }

  get capital() {
    return this.formConsulta.get('capital');
  }

  get cuota() {
    return this.formConsulta.get('cuota');
  }

  get vigencia() {
    return this.formConsulta.get('vigencia');
  }
  
  //Verifica la cantidad de páginas, y en base a esto realiza el paginado.
  get pages() {
    const cantidadPaginas = Math.ceil(
      this.PlanesMultiplesFiltrados.length / this.itemsPorPagina
    );
    const paginas = [];

    for (let i = 1; i <= cantidadPaginas; i++) {
      paginas.push(i);
    }
    return paginas;
  }

  ngOnInit(): void {
    this.obtenerPlanes();
  }

  //Consulta los planes que se encuentran registrados y los guarda en una lista de Planes.
  obtenerPlanes() {
    this.servicioPlan.listarPlanes().subscribe((data) => {
      this.Planes = data;
      this.PlanesFiltrados = this.Planes;
      this.PlanesMultiplesFiltrados = this.PlanesFiltrados;
    });
  }

  //Separa de un numero su parte entera y su parte decimal.
  separarNumeroDecimal(numero: number, pos: number): string {
    var separador = numero.toString().split(',');
    var valor = separador[pos].trim();
    return valor;
  }

  //Filtra los planes por Nombre, Edad Máxima, TNA, Montos Mínimos y Máximos, y Cuotas Mínimas y Máximas.
  esFiltrar(
    nombre: string,
    TNA: string,
    edadMax: string,
    costoOtorgamiento: string,
    capital: string,
    cuota: string,
    vigencia: string
  ) {
    let capitalPlan: number;
    let cuotaPlan: number;
    let costoOtorgamientoPlan: number;

    if (costoOtorgamiento != null && costoOtorgamiento != '') {
      if (costoOtorgamiento.toString().includes(',')) {
        let parteEnteraMax = this.separarNumeroDecimal(
          parseInt(costoOtorgamiento),
          0
        ).replace(/\./g, '');
        let parteDecimalMax = this.separarNumeroDecimal(
          parseInt(costoOtorgamiento),
          1
        );
        costoOtorgamientoPlan = parseFloat(
          parteEnteraMax + '.' + parteDecimalMax
        );
      } else {
        costoOtorgamientoPlan = parseInt(
          costoOtorgamiento.toString().replace(/\./g, '')
        );
      }
    }

    if (capital != null && capital != '') {
      if (capital.toString().includes(',')) {
        let parteEnteraMax = this.separarNumeroDecimal(
          parseInt(capital),
          0
        ).replace(/\./g, '');
        let parteDecimalMax = this.separarNumeroDecimal(parseInt(capital), 1);
        capitalPlan = parseFloat(parteEnteraMax + '.' + parteDecimalMax);
      } else {
        capitalPlan = parseInt(capital.toString().replace(/\./g, ''));
      }
    }

    if (cuota != null && cuota != '') {
      if (cuota.toString().includes(',')) {
        let parteEnteraMax = this.separarNumeroDecimal(
          parseInt(cuota),
          0
        ).replace(/\./g, '');
        let parteDecimalMax = this.separarNumeroDecimal(parseInt(cuota), 1);
        cuotaPlan = parseFloat(parteEnteraMax + '.' + parteDecimalMax);
      } else {
        cuotaPlan = parseInt(cuota.toString().replace(/\./g, ''));
      }
    }

    this.PlanesMultiplesFiltrados = this.PlanesFiltrados;

    if (nombre != null) {
      this.PlanesMultiplesFiltrados = this.PlanesMultiplesFiltrados.filter(
        (x) => x.nombre.replace(/\-/g, '').includes(nombre.replace(/\-/g, ''))
      );
    }

    if (TNA != null) {
      this.PlanesMultiplesFiltrados = this.PlanesMultiplesFiltrados.filter(
        (x) => x.tna.toString().includes(TNA)
      );
    }

    if (edadMax != null) {
      this.PlanesMultiplesFiltrados = this.PlanesMultiplesFiltrados.filter(
        (x) => x.edadMax.toString().includes(edadMax)
      );
    }

    if (costoOtorgamientoPlan != null) {
      this.PlanesMultiplesFiltrados = this.PlanesMultiplesFiltrados.filter(
        (x) => x.costoOtorgamiento < costoOtorgamientoPlan
      );
    }

    if (capitalPlan != undefined) {
      this.PlanesMultiplesFiltrados = this.PlanesMultiplesFiltrados.filter(
        (x) => capitalPlan >= x.montoMin && x.montoMax >= capitalPlan
      );
    }

    if (cuotaPlan != undefined) {
      this.PlanesMultiplesFiltrados = this.PlanesMultiplesFiltrados.filter(
        (x) => cuotaPlan >= x.cuotasMin && x.cuotasMax >= cuotaPlan
      );
    }

    if (vigencia != null && vigencia != '') {
      this.PlanesMultiplesFiltrados = this.PlanesMultiplesFiltrados.filter(
        (x) =>
          moment(vigencia).format('YYYY-MM-DD') >=
            moment(x.vigenciaDesde).format('YYYY-MM-DD') &&
          moment(x.vigenciaHasta).format('YYYY-MM-DD') >=
            moment(vigencia).format('YYYY-MM-DD')
      );
    }
  }

  //Filtra los planes en base a la fecha de busqueda pasada por parámetro.
  esFiltrarVigencia(event: Event) {
    let fechaBusqueda = (event.target as HTMLInputElement).value;
    this.PlanesFiltrados = [];
    this.Planes.forEach((plan) => {
      if (
        moment(plan.vigenciaDesde).format('YYYY-MM-DD') <= fechaBusqueda &&
        fechaBusqueda <= moment(plan.vigenciaHasta).format('YYYY-MM-DD')
      ) {
        this.PlanesFiltrados.push(plan);
      }
      if (fechaBusqueda == '') {
        this.PlanesFiltrados = this.Planes;
      }
    });
  }

  //Valida que exista algún plan que responda a algún filtro especificado.
  validarFiltrado(): Boolean {
    if (this.PlanesMultiplesFiltrados.length == 0) return false;
    return true;
  }

  //Almacena los datos del plan que fue seleccionado en la tabla de planes filtrados dentro de variables locales.
  esfilaSeleccionada(plan: PlanClass) {
    this.planSeleccionado = plan;
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

  //Envia los datos del plan seleccionado al componente encargado de realizar la modificación.
  enviarDatos() {
    // return '/alta-modificacion-plan/'
    this.servicioPlan.enviarPlanSeleccionado(this.planSeleccionado);
  }
}
