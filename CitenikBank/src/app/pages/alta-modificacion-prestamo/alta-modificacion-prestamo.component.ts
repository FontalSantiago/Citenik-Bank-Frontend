//SISTEMA
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import Swal, { SweetAlertOptions } from 'sweetalert2';

//COMPONENTES
import { PlanClass } from 'src/app/core/models/plan';
import { CuotaClass } from 'src/app/core/models/cuota';
import { ClienteClass } from 'src/app/core/models/cliente';
import { PrestamoClass } from 'src/app/core/models/prestamo';

//SERVICIOS
import { PlanService } from 'src/app/core/services/plan.service';
import { PrestamoService } from 'src/app/core/services/prestamo.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { CuotaService } from 'src/app/core/services/cuota.service';

@Component({
  selector: 'app-alta-modificacion-prestamo',
  templateUrl: './alta-modificacion-prestamo.component.html',
  styleUrls: ['./alta-modificacion-prestamo.component.css'],
})
export class AltaModificacionPrestamoComponent implements OnInit {
  //VARIABLES DE DATOS
  edadCliente: number;
  idPrestamo: number;

  estadoCliente: string;
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
  Clientes: ClienteClass[] = [];
  PlanesFiltrados: PlanClass[] = [];
  CuotasGeneradas: CuotaClass[] = [];

  //VARIABLES DE CLASES
  ClienteFiltrado: ClienteClass = new ClienteClass(
    0,
    0,
    '',
    '',
    '',
    null,
    null
  );
  Plan: PlanClass = new PlanClass(0, '', 0, 0, 0, 0, 0, 0, 0, 0, 0, null, null);

  //FORMS PARA LA AGRUPACIÓN DE DATOS
  formRegistro: FormGroup;

  constructor(
    private formbuilder: FormBuilder,
    private servicioPlanes: PlanService,
    private servicioPrestamos: PrestamoService,
    private servicioClientes: ClienteService,
    private servicioUsuario: UsuarioService,
    private servicioCuotas: CuotaService
  ) {
    this.formRegistro = this.formbuilder.group({
      CUIT: new FormControl(null, [
        Validators.required,
        Validators.pattern('[0-9]{2}-[0-9]{8}-[0-9]{1}'),
      ]),
      nombre: new FormControl(null),
      edad: new FormControl(null),
      estado: new FormControl(null),
      plan: new FormControl(null, [Validators.required]),
      capital: new FormControl(null, [Validators.required]),
      cantidadCuotas: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[^,]*$'),
      ]),
      diaVencimiento: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[^,]*$'),
      ]),
      fechaOtorgamiento: new FormControl(null, Validators.required),
    });
  }

  get CUIT() {
    return this.formRegistro.get('CUIT');
  }

  get nombre() {
    return this.formRegistro.get('nombre');
  }

  get edad() {
    return this.formRegistro.get('edad');
  }

  get estado() {
    return this.formRegistro.get('estado');
  }

  get plan() {
    return this.formRegistro.get('plan');
  }

  get capital() {
    return this.formRegistro.get('capital');
  }

  get cantidadCuotas() {
    return this.formRegistro.get('cantidadCuotas');
  }

  get diaVencimiento() {
    return this.formRegistro.get('diaVencimiento');
  }

  get fechaOtorgamiento() {
    return this.formRegistro.get('fechaOtorgamiento');
  }

  ngOnInit(): void {
    this.obtenerPlanes();
    this.obtenerClientes();
  }

  //Verifica que el cliente posee mas de 18 años y se encuentra habilitado para otorgar un plan.
  validarEdadYEstadoCliente(): Boolean {
    if (this.edadCliente > 18 && this.estadoCliente == 'Habilitado') {
      return true;
    } else {
      return false;
    }
  }

  //Valida la cantidad de cuotas con la edad al finalizar el prestamo.
  validarEdadAlFinalizar(): Boolean {
    let edadMilisegundos: number;
    let cantidadCuotas: number = this.formRegistro.get('cantidadCuotas').value;
    let fechaOtorgamiento: Date =
      this.formRegistro.get('fechaOtorgamiento').value;
    if (cantidadCuotas != null || fechaOtorgamientoFormateada != null) {
      var fechaNacimiento = new Date(
        moment(this.ClienteFiltrado.fecha_nacimiento).format('YYYY-MM-DD')
      );
      var fechaOtorgamientoFormateada = new Date(
        moment(fechaOtorgamiento).format('YYYY-MM-DD')
      );
      edadMilisegundos = Math.abs(
        fechaOtorgamientoFormateada.getTime() - fechaNacimiento.getTime()
      );

      var meses = this.formRegistro.get('cantidadCuotas').value;
      var tiempoPrestamo = meses * 2629800000;
      var edadMilisegundosFinalizar = edadMilisegundos + tiempoPrestamo;
      var edadAlFinalizar = Math.floor(
        edadMilisegundosFinalizar / (1000 * 3600 * 24) / 365.25
      );
      if (this.Plan.edadMax != 0) {
        if (this.Plan.edadMax > edadAlFinalizar) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  //Verifica que existe algún cliente con el CUIT especificado.
  validarFiltrado(): Boolean {
    if (this.estadoCliente == null || this.edadCliente == null) return false;
    return true;
  }

  //Filtro de clientes por CUIT, calculando su edad y verificando su estado para otorgarles un plan.
  esFiltrar(event: Event): void {
    let txtBuscar = (event.target as HTMLInputElement).value;
    let filtro = txtBuscar
      .replace(/[^\w\s]/g, '')
      .trim()
      .toLowerCase();

    this.edadCliente = null;
    this.estadoCliente = null;
    this.Clientes.forEach((cliente) => {
      if (cliente.cuit.replace(/\-/g, '').includes(filtro) && filtro != '') {
        this.ClienteFiltrado = cliente;
        this.calcularEdad(cliente);
        this.obtenerEstado(cliente);
      }
    });
  }

  //Calcula la edad del cliente al dia de la fecha.
  calcularEdad(cliente: ClienteClass): void {
    let edadMilisegundos: any;
    var fechaNac = new Date(
      moment(cliente.fecha_nacimiento).format('YYYY-MM-DD')
    );
    edadMilisegundos = Math.abs(Date.now() - fechaNac.getTime());
    this.edadCliente = Math.floor(
      edadMilisegundos / (1000 * 3600 * 24) / 365.25
    );
  }

  //Almacena en una variable local los datos del plan que el usuario seleccione.
  obtenerDatosPlan(plan: PlanClass): void {
    let seccionAltaPrestamo = document.getElementById(
      'seccionAltaPrestamo'
    ) as HTMLElement | null;
    this.Plan = plan;
    seccionAltaPrestamo.hidden = false;
  }

  //Obtiene planes vigentes segun la fecha actual.
  obtenerPlanes(): void {
    var Planes: PlanClass[] = [];
    this.servicioPlanes.listarPlanes().subscribe((data) => {
      Planes = data;
      Planes.forEach((planes) => {
        {
          let fechaVigencia = moment(planes.vigenciaHasta).format('YYYY-MM-DD');
          let fechaActual = moment(new Date(Date.now())).format('YYYY-MM-DD');
          if (fechaVigencia >= fechaActual) {
            this.PlanesFiltrados.push(planes);
          }
        }
      });
    });
  }

  //Obtiene una lista de clientes.
  obtenerClientes(): void {
    this.servicioClientes.listarClientes().subscribe((data) => {
      this.Clientes = data;
    });
  }

  //Obtiene el estado actual del cliente y almacena un string en base al mismo.
  obtenerEstado(cliente: ClienteClass): void {
    if (cliente.estado == true) {
      this.estadoCliente = 'Habilitado';
    } else {
      this.estadoCliente = 'Deshabilitado';
    }
  }

  //Compara si un valor pasado por parametro está incluido en un rango.
  estaEntre(mayor: any, menor: any, entre: any): Boolean {
    let valorEntre;
    if (this.Plan.id != 0) {
      if (entre == null) {
        return true;
      } else {
        if (entre.toString().includes(',')) {
          let parteEntera = this.separarNumeroDecimal(entre, 0).replace(
            /\./g,
            ''
          );
          let parteDecimal = this.separarNumeroDecimal(entre, 1);
          valorEntre = parseFloat(parteEntera + '.' + parteDecimal);
        } else {
          valorEntre = parseInt(entre.toString().replace(/\./g, ''));
        }
        if ((menor > valorEntre && valorEntre < mayor) || valorEntre > mayor) {
          return false;
        } else {
          return true;
        }
      }
    } else {
      return true;
    }
  }

  //Separa de un numero su parte entera y su parte decimal.
  separarNumeroDecimal(numero: number, pos: number): string {
    var separador = numero.toString().split(',');
    var valor = separador[pos].trim();
    return valor;
  }

  //Modal de carga para generar simulación.
  ejecutarSwal(cantidadCuotas: number) {
    let tiempo = cantidadCuotas * 2000;
    let timerInterval;
    Swal.fire({
      title: 'Simulando...',
      timer: tiempo,
      timerProgressBar: true,
      showConfirmButton: false,
      imageUrl: './assets/cargando.gif',
      imageWidth: 100,
      imageHeight: 100,
      didOpen: () => {
        timerInterval = setInterval(() => {
          Swal.getTimerLeft();
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });
  }

  //Trae la lista de cuotas del prestamo generado
  listarCuotasConComposicion(): void {
    this.servicioCuotas.listarCuotas(this.idPrestamo).subscribe((data) => {
      this.CuotasGeneradas = data;
    });
  }

  //Realiza la simulación del prestamo y lista las cuotas que se generaron.
  generarSimulacionPrestamo(): void {
    if (this.servicioUsuario.obtenerToken() != null) {
      this.ejecutarSwal(this.formRegistro.get('cantidadCuotas').value);
      let capital: number;
      if (this.formRegistro.get('capital')?.value.toString().includes(',')) {
        let parteEnteraMax = this.separarNumeroDecimal(
          this.formRegistro.get('capital')?.value,
          0
        ).replace(/\./g, '');
        let parteDecimalMax = this.separarNumeroDecimal(
          this.formRegistro.get('capital')?.value,
          1
        );
        capital = parseFloat(parteEnteraMax + '.' + parteDecimalMax);
      } else {
        capital = parseInt(
          this.formRegistro.get('capital')?.value.toString().replace(/\./g, '')
        );
      }
      let Prestamo: PrestamoClass = new PrestamoClass(
        0,
        this.Plan.id,
        this.ClienteFiltrado.id,
        capital,
        this.formRegistro.get('cantidadCuotas').value,
        this.formRegistro.get('fechaOtorgamiento').value,
        this.formRegistro.get('diaVencimiento').value,
        ''
      );
      this.servicioPrestamos.guardarPrestamo(Prestamo).subscribe((data) => {
        this.idPrestamo = data.id;
        Swal.fire({
          text: 'Simulación generada.',
          icon: 'success',
          position: 'top',
          showConfirmButton: true,
          confirmButtonColor: '#0f425b',
          confirmButtonText: 'Continuar',
        } as SweetAlertOptions).then((result) => {
          if (result.value == true) {
            this.listarCuotasConComposicion();
          }
          return;
        });
      });
    } else {
      location.reload();
    }
  }

  //Confirma la simulación del prestamo generando modificando su estado a vigente.
  confirmarPrestamo(): void {
    if (this.servicioUsuario.obtenerToken() != null) {
      this.servicioPrestamos
        .actualizarPrestamo(this.idPrestamo)
        .subscribe(() => {
          Swal.fire({
            text: 'El prestamo ha sido confirmado con éxito.',
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
    } else {
      location.reload();
    }
  }
}
