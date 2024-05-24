//SISTEMA
import { Component, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import localeEsAr from '@angular/common/locales/es-AR';
import { registerLocaleData } from '@angular/common';

//COMPONENTES
import { PlanClass } from 'src/app/core/models/plan';

//SERVICIOS
import { PlanService } from 'src/app/core/services/plan.service';
import * as moment from 'moment';
import { UsuarioService } from 'src/app/core/services/usuario.service';

registerLocaleData(localeEsAr, 'es-Ar');
@Component({
  selector: 'app-alta-modificacion-plan',
  templateUrl: './alta-modificacion-plan.component.html',
  styleUrls: ['./alta-modificacion-plan.component.css'],
})
export class AltaModificacionPlanComponent implements OnInit {
  //VARIABLES DE DATOS
  caracteresValidos: string =
    "La primera letra del nombre debe ser Mayúscula, y no se admiten: 1-9 ! # $ % & ' ( ) * + , - . / : ; < = > ? @ [  ] ^ _` { | } ~";
  nombreRegistrado: string = '';
  vigenciaDesdeRegistrado: string = '';
  vigenciaHastaRegistrado: string = '';
  modoFormulario: string = 'A';


  TNARegistrado: number = 0;
  @Output() planSeleccionado: any;

  //VARIABLES DE OBJETOS LIST
  existePlan: PlanClass[] = [];

  //FORMS PARA LA AGRUPACIÓN DE DATOS
  formRegistro: FormGroup;

  constructor(
    private fb: FormBuilder,
    private servicioPlan: PlanService,
    private servicioUsuario: UsuarioService
  ) {
    this.formRegistro = this.fb.group({
      nombre: new FormControl(null, [Validators.required]),
      TNA: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[0-9]+([,])?([0-9]+)?$'),
      ]),
      cuotasMax: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[^,]*$'),
      ]),
      cuotasMin: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[^,]*$'),
      ]),
      montoMax: new FormControl(null, [Validators.required]),
      montoMin: new FormControl(null, [Validators.required]),
      edadMax: new FormControl(null, [Validators.pattern('^[^,]*$')]),
      precanCuota: new FormControl(null, [Validators.pattern('[0-9]+')]),

      precanMulta: new FormControl(null, [
        Validators.pattern('^[0-9]+([,])?([0-9]+)?$'),
      ]),
      costoOtorgamiento: new FormControl(null, []),
      vigenciaDesde: new FormControl(null, Validators.required),
      vigenciaHasta: new FormControl(null),
    });
  }

  get nombre() {
    return this.formRegistro.get('nombre');
  }

  get TNA() {
    return this.formRegistro.get('TNA');
  }

  get cuotasMax() {
    return this.formRegistro.get('cuotasMax');
  }

  get cuotasMin() {
    return this.formRegistro.get('cuotasMin');
  }

  get montoMax() {
    return this.formRegistro.get('montoMax');
  }

  get montoMin() {
    return this.formRegistro.get('montoMin');
  }

  get edadMax() {
    return this.formRegistro.get('edadMax');
  }

  get precanCuota() {
    return this.formRegistro.get('precanCuota');
  }

  get precanMulta() {
    return this.formRegistro.get('precanMulta');
  }

  get costoOtorgamiento() {
    return this.formRegistro.get('costoOtorgamiento');
  }

  get vigenciaDesde() {
    return this.formRegistro.get('vigenciaDesde');
  }

  get vigenciaHasta() {
    return this.formRegistro.get('vigenciaHasta');
  }

  set vigenciaHasta(vigenciaHasta) {
    this.formRegistro.get('vigenciaHasta')?.setValue(vigenciaHasta);
  }

  ngOnInit(): void {
    this.recibirDatosModificacion();
  }

  //Valida que los campos del formulario sean correctamente ingresados.
  validarFormulario(): Boolean {
    if (this.formRegistro.valid == false) {
      return false;
    } else {
      return true;
    }
  }

  //Compara dos parámetros validando que el primero sea menor que el segundo.
  comparador(mayor: any, menor: any, letra: any): Boolean {
    let montoMax: number;
    let montoMin: number;
    if (menor != null && mayor != null) {
      if (letra == 'M') {
        if (mayor.toString().includes(',')) {
          let parteEnteraMax = this.separarNumeroDecimal(
            this.formRegistro.get('montoMax')?.value,
            0
          ).replace(/\./g, '');
          let parteDecimalMax = this.separarNumeroDecimal(
            this.formRegistro.get('montoMax')?.value,
            1
          );
          montoMax = parseFloat(parteEnteraMax + '.' + parteDecimalMax);
        } else {
          montoMax = parseInt(mayor.toString().replace(/\./g, ''));
        }
        if (menor.toString().includes(',')) {
          let parteEnteraMin = this.separarNumeroDecimal(
            this.formRegistro.get('montoMin')?.value,
            0
          ).replace(/\./g, '');
          let parteDecimalMin = this.separarNumeroDecimal(
            this.formRegistro.get('montoMin')?.value,
            1
          );
          montoMin = parseFloat(parteEnteraMin + '.' + parteDecimalMin);
        } else {
          montoMin = parseInt(menor.toString().replace(/\./g, ''));
        }
        if (montoMin > montoMax) {
          return false;
        }
      } else {
        if (letra == 'C') {
          if (parseInt(menor) > parseInt(mayor)) {
            return false;
          }
        } else {
          if (letra == 'F') {
            if (menor > mayor) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  esFechaActual(vigenciaHasta: any): Boolean {
    if (vigenciaHasta < moment(Date.now()).format('YYYY-MM-DD').toString()) {
      return false;
    } else {
      return true;
    }
  }

  //Compara si un parámetro está incluido en un rango.
  estaEntre(mayor: any, menor: any, entre: any): Boolean {
    if (entre == null) {
      return true;
    } else {
      if ((menor >= entre && entre < mayor) || entre >= mayor) {
        return false;
      } else {
        return true;
      }
    }
  }

  //Valida si se ingreso algo en el campo de Fecha Hasta.
  validarNull(hasta: any): Boolean {
    if (hasta == '') {
      return false;
    }
    return true;
  }

  esPlanGuardar(): void {
    if (this.servicioUsuario.obtenerToken() != null) {
      let nombre = this.formRegistro.get('nombre')?.value;
      this.servicioPlan.obtenerPlanNombre(nombre).subscribe((data) => {
        this.existePlan = data;
      });
    }
  }

  //Guarda los datos del plan a registrar para luego poder visualizarlos en el apartado de confirmación.
  datosModalGuardar(): void {
    this.nombreRegistrado = this.formRegistro.get('nombre')?.value;
    this.TNARegistrado = this.formRegistro.get('TNA')?.value;
    this.vigenciaDesdeRegistrado =
      this.formRegistro.get('vigenciaDesde')?.value;
    this.vigenciaHastaRegistrado =
      this.formRegistro.get('vigenciaHasta')?.value;
  }

  //Guarda en una variable los datos del plan a modificar para luego poder visualizarlos en pantalla.
  recibirDatosModificacion(): void {
    this.planSeleccionado = this.servicioPlan.recibirPlanSeleccionado();
    if (this.planSeleccionado != undefined) {
      this.planSeleccionado.tna = new Intl.NumberFormat('es-Ar', {
        style: 'currency',
        currency: 'ARS',
      })
        .format(this.planSeleccionado.tna)
        .replace('$', '')
        .trim();

      this.planSeleccionado.montoMax = new Intl.NumberFormat('es-Ar', {
        style: 'currency',
        currency: 'ARS',
      })
        .format(this.planSeleccionado.montoMax)
        .replace('$', '')
        .trim();

      this.planSeleccionado.montoMin = new Intl.NumberFormat('es-Ar', {
        style: 'currency',
        currency: 'ARS',
      })
        .format(this.planSeleccionado.montoMin)
        .replace('$', '')
        .trim();

      this.planSeleccionado.costoOtorgamiento = new Intl.NumberFormat('es-Ar', {
        style: 'currency',
        currency: 'ARS',
      })
        .format(this.planSeleccionado.costoOtorgamiento)
        .replace('$', '')
        .trim();

      this.planSeleccionado.precanMulta = new Intl.NumberFormat('es-Ar', {
        style: 'currency',
        currency: 'ARS',
      })
        .format(this.planSeleccionado.precanMulta)
        .replace('$', '')
        .trim();

      this.modoFormulario = 'M';
      this.planSeleccionado.vigenciaDesde = moment(
        this.planSeleccionado.vigenciaDesde
      )
        .format('YYYY-MM-DD')
        .toString();

      if (this.planSeleccionado.vigenciaHasta != null) {
        this.planSeleccionado.vigenciaHasta = moment(
          this.planSeleccionado.vigenciaHasta
        )
          .format('YYYY-MM-DD')
          .toString();
      }
      this.bloquearEditar();
    }
  }
  //Separa de un numero su parte entera y su parte decimal.
  separarNumeroDecimal(numero: number, pos: number): string {
    var separador = numero.toString().split(',');
    var valor = separador[pos].trim();
    return valor;
  }

  //Registra al plan con los datos que se rellenaron en los campos del formulario devolviendo un mensaje de éxito al confirmar.
  confirmarPlan(): void {
    if (this.servicioUsuario.obtenerToken() != null) {
      let montoMax: number;
      let montoMin: number;
      let TNA = this.formRegistro.get('TNA')?.value.replace(/\,/g, '.');
      if (this.formRegistro.get('montoMax')?.value.toString().includes(',')) {
        let parteEnteraMax = this.separarNumeroDecimal(
          this.formRegistro.get('montoMax')?.value,
          0
        ).replace(/\./g, '');
        let parteDecimalMax = this.separarNumeroDecimal(
          this.formRegistro.get('montoMax')?.value,
          1
        );
        montoMax = parseFloat(parteEnteraMax + '.' + parteDecimalMax);
      } else {
        montoMax = parseInt(
          this.formRegistro.get('montoMax')?.value.toString().replace(/\./g, '')
        );
      }

      if (this.formRegistro.get('montoMin')?.value.toString().includes(',')) {
        let parteEnteraMin = this.separarNumeroDecimal(
          this.formRegistro.get('montoMin')?.value,
          0
        ).replace(/\./g, '');
        let parteDecimalMin = this.separarNumeroDecimal(
          this.formRegistro.get('montoMin')?.value,
          1
        );
        montoMin = parseFloat(parteEnteraMin + '.' + parteDecimalMin);
      } else {
        montoMin = parseInt(
          this.formRegistro.get('montoMin')?.value.toString().replace(/\./g, '')
        );
      }

      let costoOtorgamiento = this.formRegistro.get('costoOtorgamiento')?.value;
      let precanMulta = this.formRegistro.get('precanMulta')?.value;

      if (costoOtorgamiento.toString().includes(',')) {
        let parteEnteraMax = this.separarNumeroDecimal(
          costoOtorgamiento,
          0
        ).replace(/\./g, '');
        let parteDecimalMax = this.separarNumeroDecimal(costoOtorgamiento, 1);
        costoOtorgamiento = parseFloat(parteEnteraMax + '.' + parteDecimalMax);
      } else {
        costoOtorgamiento = parseInt(
          costoOtorgamiento.toString().replace(/\./g, '')
        );
      }

      if (precanMulta != null && precanMulta.toString().includes(',')) {
        precanMulta.replace(/\./g, ',');
      }

      let Plan: PlanClass = new PlanClass(
        0,
        this.formRegistro.get('nombre')?.value,
        TNA,
        this.formRegistro.get('cuotasMax')?.value,
        this.formRegistro.get('cuotasMin')?.value,
        montoMax,
        montoMin,
        this.formRegistro.get('edadMax')?.value,
        this.formRegistro.get('precanCuota')?.value,
        precanMulta,
        costoOtorgamiento,
        this.formRegistro.get('vigenciaDesde')?.value,
        this.formRegistro.get('vigenciaHasta')?.value
      );
      this.servicioPlan.guardarPlan(Plan).subscribe((data) => {
        Swal.fire({
          text: 'El plan ' + data.nombre + ' ha sido registrado con éxito.',
          icon: 'success',
          position: 'top',
          showConfirmButton: true,
          confirmButtonColor: '#0f425b',
          confirmButtonText: 'Aceptar',
        } as SweetAlertOptions).then((result) => {
          if (result.value == true) {
            return (location.href = '/consultar-plan');
          }
          return;
        });
      });
    } else {
      location.reload();
    }
  }

  //Modificación del plan seleccionado.
  modificarPlan(): void {
    if (this.servicioUsuario.obtenerToken() != null) {
      let montoMax: number;
      let montoMin: number;
      let TNA = this.formRegistro.get('TNA')?.value.replace(/\,/g, '.');
      if (this.formRegistro.get('montoMax')?.value.toString().includes(',')) {
        let parteEnteraMax = this.separarNumeroDecimal(
          this.formRegistro.get('montoMax')?.value,
          0
        ).replace(/\./g, '');
        let parteDecimalMax = this.separarNumeroDecimal(
          this.formRegistro.get('montoMax')?.value,
          1
        );
        montoMax = parseFloat(parteEnteraMax + '.' + parteDecimalMax);
      } else {
        montoMax = parseInt(
          this.formRegistro.get('montoMax')?.value.toString().replace(/\./g, '')
        );
      }

      if (this.formRegistro.get('montoMin')?.value.toString().includes(',')) {
        let parteEnteraMin = this.separarNumeroDecimal(
          this.formRegistro.get('montoMin')?.value,
          0
        ).replace(/\./g, '');
        let parteDecimalMin = this.separarNumeroDecimal(
          this.formRegistro.get('montoMin')?.value,
          1
        );
        montoMin = parseFloat(parteEnteraMin + '.' + parteDecimalMin);
      } else {
        montoMin = parseInt(
          this.formRegistro.get('montoMin')?.value.toString().replace(/\./g, '')
        );
      }
      let costoOtorgamiento = this.formRegistro.get('costoOtorgamiento')?.value;
      let precanMulta = this.formRegistro
        .get('precanMulta')
        ?.value.replace(/\,/g, '.');

      if (costoOtorgamiento.toString().includes(',')) {
        let parteEnteraMax = this.separarNumeroDecimal(
          costoOtorgamiento,
          0
        ).replace(/\./g, '');
        let parteDecimalMax = this.separarNumeroDecimal(costoOtorgamiento, 1);
        costoOtorgamiento = parseFloat(parteEnteraMax + '.' + parteDecimalMax);
      } else {
        costoOtorgamiento = parseInt(
          costoOtorgamiento.toString().replace(/\./g, '')
        );
      }

      if (precanMulta != null && precanMulta.toString().includes(',')) {
        precanMulta.replace(/\./g, ',');
      }

      let Plan: PlanClass = new PlanClass(
        this.planSeleccionado.id,
        this.formRegistro.get('nombre')?.value,
        TNA,
        this.formRegistro.get('cuotasMax')?.value,
        this.formRegistro.get('cuotasMin')?.value,
        montoMax,
        montoMin,
        this.formRegistro.get('edadMax')?.value,
        this.formRegistro.get('precanCuota')?.value,
        precanMulta,
        costoOtorgamiento,
        this.formRegistro.get('vigenciaDesde')?.value,
        this.formRegistro.get('vigenciaHasta')?.value
      );
      this.servicioPlan
        .modificarPlan(this.planSeleccionado.id, Plan)
        .subscribe((data) => {
          Swal.fire({
            text:
              'El plan ' +
              this.formRegistro.get('nombre')?.value +
              ' ha sido modificado con éxito.',
            icon: 'success',
            position: 'top',
            showConfirmButton: true,
            confirmButtonColor: '#0f425b',
            confirmButtonText: 'Aceptar',
          } as SweetAlertOptions).then((result) => {
            if (result.value == true) {
              return (location.href = '/consultar-plan');
            }
            return;
          });
        });
    } else {
      location.reload();
    }
  }

  //Bloquea los campos ante una consulta.
  bloquearEditar(): void {
    this.formRegistro.get('nombre')?.disable();
    this.formRegistro.get('TNA')?.disable();
    this.formRegistro.get('cuotasMax')?.disable();
    this.formRegistro.get('cuotasMin')?.disable();
    this.formRegistro.get('montoMax')?.disable();
    this.formRegistro.get('montoMin')?.disable();
    this.formRegistro.get('edadMax')?.disable();
    this.formRegistro.get('precanCuota')?.disable();
    this.formRegistro.get('precanMulta')?.disable();
    this.formRegistro.get('costoOtorgamiento')?.disable();
    this.formRegistro.get('vigenciaDesde')?.disable();
    this.formRegistro.get('vigenciaHasta')?.disable();
  }

  //Desbloquea los campos para su modificación.
  desbloquearEditar(): void {
    this.formRegistro.get('nombre')?.enable();
    this.formRegistro.get('TNA')?.enable();
    this.formRegistro.get('cuotasMax')?.enable();
    this.formRegistro.get('cuotasMin')?.enable();
    this.formRegistro.get('montoMax')?.enable();
    this.formRegistro.get('montoMin')?.enable();
    this.formRegistro.get('edadMax')?.enable();
    this.formRegistro.get('precanCuota')?.enable();
    this.formRegistro.get('precanMulta')?.enable();
    this.formRegistro.get('costoOtorgamiento')?.enable();
    this.formRegistro.get('vigenciaDesde')?.enable();
    this.formRegistro.get('vigenciaHasta')?.enable();
  }
}
