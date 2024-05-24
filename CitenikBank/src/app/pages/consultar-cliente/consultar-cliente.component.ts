//SISTEMA
import { Component, HostListener, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import Swal, { SweetAlertOptions } from 'sweetalert2';

//COMPONENTES
import { ClienteClass } from 'src/app/core/models/cliente';

//SERVICIOS
import { ClienteService } from 'src/app/core/services/cliente.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-consultar-cliente',
  templateUrl: './consultar-cliente.component.html',
  styleUrls: ['./consultar-cliente.component.css'],
})
export class ConsultarClienteComponent implements OnInit {
  //VARIABLES DE OBJETOS LIST
  Clientes: ClienteClass[] = [];
  ClientesFiltrados: ClienteClass[] = [];
  ClientesMultiplesFiltrados: ClienteClass[] = [];
  ClienteSeleccionado: ClienteClass;

  //VARIABLES DE DATOS
  titulo: string = '';
  validadorCamposModif: string = '';
  nombreCompletoSelec: string = '';
  propiedadOrdenamiento: string = 'id';
  caracteresValidos: string =
    "La primera letra del nombre debe ser Mayúscula, y no se admiten: 1-9 ! # $ % & ' ( ) * + , - . / : ; < = > ¿? @ [  ] ^ _` { | } ~";

  tipoOrdenamiento: number = 1;
  idSeleccionado: number = 0;
  legajoSeleccionado: number = 0;
  paginaActual = 1;
  itemsPorPagina = 50;
  tamanoMaximo = 5;

  fechaNacimientoSelec: any;

  esCUITValido: boolean = true;
  existeCliente: boolean = false;

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

  //FORMS PARA LA AGRUPACIÓN DE DATOS
  formModificar: FormGroup;

  constructor(
    private fb: FormBuilder,
    private servicioUsuario: UsuarioService,
    private servicioConsultar: ClienteService
  ) {
    this.formModificar = this.fb.group({
      CUITConsulta: new FormControl(null),
      nombreCliente: new FormControl(null),
      legajo: new FormControl(null),
      nombre: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[A-Z][A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$"),
      ]),
      apellido: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[A-Z][A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$"),
      ]),
      CUIT: new FormControl(null, [
        Validators.required,
        Validators.pattern('[0-9]{2}-[0-9]{8}-[0-9]{1}'),
      ]),
      fecha_nacimiento: new FormControl(null, Validators.required),
    });
  }

  get CUITConsulta() {
    return this.formModificar.get('CUITConsulta');
  }

  get nombreCliente() {
    return this.formModificar.get('nombreCliente');
  }

  get legajo() {
    return this.formModificar.get('legajo');
  }

  get nombre() {
    return this.formModificar.get('nombre');
  }

  get apellido() {
    return this.formModificar.get('apellido');
  }

  get CUIT() {
    return this.formModificar.get('CUIT');
  }

  get fecha_nacimiento() {
    return this.formModificar.get('fecha_nacimiento');
  }

  //Verifica la cantidad de páginas, y en base a esto realiza el paginado.
  get pages() {
    const cantidadPaginas = Math.ceil(
      this.ClientesMultiplesFiltrados.length / this.itemsPorPagina
    );
    const paginas = [];

    for (let i = 1; i <= cantidadPaginas; i++) {
      paginas.push(i);
    }
    return paginas;
  }

  ngOnInit(): void {
    this.obtenerClientes();
  }

  //Consulta los clientes que se encuentran registrados y los guarda en una lista de Clientes.
  obtenerClientes() {
    this.servicioConsultar.listarClientes().subscribe((data) => {
      this.Clientes = data;
      this.Clientes.forEach((cliente) => {
        cliente.apellido = this.separarNombreApellido(cliente.nombre, 1);
        cliente.nombre = this.separarNombreApellido(cliente.nombre, 0);
        if (cliente.estado == true) {
          this.ClientesFiltrados.push(cliente);
        }
        this.ClientesMultiplesFiltrados = this.ClientesFiltrados;
      });
    });
  }

  //Separa Nombre y Apellido de nombreCompleto.
  separarNombreApellido(nombreCompleto: string, pos: number): string {
    var separador = nombreCompleto.split(' ');
    var valor = separador[pos].trim();
    return valor;
  }

  //Filtro de clientes por Nombre, Apellido y CUIT, identificando previamente aquellos que se encuentren activos.
  esFiltrar(CUIT: string, nombreCliente: string, legajo: string) {
    this.ClientesMultiplesFiltrados = this.ClientesFiltrados;
    if (CUIT != null) {
      this.ClientesMultiplesFiltrados = this.ClientesMultiplesFiltrados.filter(
        (x) => x.cuit.replace(/\-/g, '').includes(CUIT.replace(/\-/g, ''))
      );
    }
    if (nombreCliente != null) {
      this.ClientesMultiplesFiltrados = this.ClientesMultiplesFiltrados.filter(
        (x) => x.nombre.includes(nombreCliente)
      );
    }

    if (legajo != null) {
      this.ClientesMultiplesFiltrados = this.ClientesMultiplesFiltrados.filter(
        (x) => x.legajo.toString().includes(legajo)
      );
    }
  }

  //Almacena los datos del cliente que fue seleccionado en la tabla de clientes filtrados dentro de variables locales.
  esfilaSeleccionada(cliente: ClienteClass) {
    this.ClienteSeleccionado = cliente;
    this.idSeleccionado = cliente.id;
    this.nombreCompletoSelec = cliente.nombre + ' ' + cliente.apellido;
    this.legajoSeleccionado = cliente.legajo;
    this.fechaNacimientoSelec = moment(cliente.fecha_nacimiento)
      .format('YYYY-MM-DD')
      .toString();
  }

  //Permite abrir un Modal u otro en función del titulo pasado como parametro.
  abrirModal(opcion: string) {
    if (opcion == 'Ver Mas') {
      this.titulo = opcion;
      this.existeCliente = false;
      this.bloquearEditar();
    } else {
      if (opcion == 'Desactivar') {
        this.titulo = opcion;
      } else {
        this.titulo = opcion;
      }
    }
  }

  //Valida que exista algún cliente que responda a algún filtro especificado.
  validarFiltrado(): Boolean {
    if (this.ClientesMultiplesFiltrados.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  //Valida que el CUIT/CUIL ingresado por el cliente tenga el formato correcto y sea existente.
  esCUITCUILValido(): Boolean {
    if (this.formModificar.controls['CUIT'].value.length != 13) return false;

    let resultado = 0;
    let cuit_nro = this.formModificar.get('CUIT')?.value.replace('-', '');
    const codes = '6789456789';
    let verificador = parseInt(cuit_nro[cuit_nro.length - 1]);

    for (let x = 0; x < 10; x++) {
      let digitoValidador = parseInt(codes.substring(x, x + 1));

      if (isNaN(digitoValidador)) digitoValidador = 0;

      let digito = parseInt(cuit_nro.substring(x, x + 1));

      if (isNaN(digito)) digito = 0;

      let digitoValidacion = digitoValidador * digito;
      resultado += digitoValidacion;
    }
    resultado = resultado % 11;
    this.esCUITValido = resultado == verificador;
    return this.esCUITValido;
  }

  //Valida que la fecha de nacimiento ingresada por el usuario no sea mayor que la fecha actual.
  esMayor(fechaNacimiento: any): Boolean {
    if (fechaNacimiento > moment(Date.now()).format('YYYY-MM-DD').toString()) {
      return false;
    } else {
      return true;
    }
  }

  //Valida que los campos de modificación se encuentren correctamente ingresados.
  validarControles(): string {
    if (
      this.formModificar.valid == false &&
      this.formModificar.get('nombre')?.enabled == true &&
      this.formModificar.get('nombre')?.enabled &&
      this.formModificar.get('CUIT')?.enabled &&
      this.formModificar.get('fecha_nacimiento')?.enabled
    ) {
      return (this.validadorCamposModif = '2');
    } else {
      return (this.validadorCamposModif = '1');
    }
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
    } else {
      return '🠋🠉';
    }
  }
  //Metodos para grilla

  //Bloquea los campos ante una consulta.
  bloquearEditar(): void {
    this.formModificar.get('nombre')?.disable();
    this.formModificar.get('apellido')?.disable();
    this.formModificar.get('CUIT')?.disable();
    this.formModificar.get('fecha_nacimiento')?.disable();
  }

  //Desbloquea los campos para su modificación.
  desbloquearEditar(): void {
    this.formModificar.get('nombre')?.enable();
    this.formModificar.get('apellido')?.enable();
    this.formModificar.get('CUIT')?.enable();
    this.formModificar.get('fecha_nacimiento')?.enable();
  }

  //Modificación del cliente seleccionado.
  modificarCliente(accion: string) {
    if (this.servicioUsuario.obtenerToken() != null) {
      let Cliente: ClienteClass = new ClienteClass(
        this.idSeleccionado,
        this.legajoSeleccionado,
        this.formModificar.get('apellido')?.value,
        this.formModificar.get('nombre')?.value,
        this.formModificar.get('CUIT')?.value,
        this.formModificar.get('fecha_nacimiento')?.value,
        true
      );

      if (accion == 'desactivar') {
        Cliente.apellido = this.ClienteSeleccionado.apellido;
        Cliente.nombre =
          this.ClienteSeleccionado.nombre + ' ' + Cliente.apellido;
        Cliente.cuit = this.ClienteSeleccionado.cuit;
        Cliente.fecha_nacimiento = this.fechaNacimientoSelec;
        Cliente.estado = false;
      }
      console.log(Cliente);

      this.servicioConsultar
        .modificarCliente(this.idSeleccionado, Cliente)
        .subscribe(() => {
          Swal.fire({
            text:
              'El cliente ' +
              Cliente.nombre +
              ' ' +
              Cliente.apellido +
              ' de legajo: ' +
              this.legajoSeleccionado +
              ' ha sido modificado con éxito.',
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

  //Valida que el usuario que se está registrando no exista, a traves de su CUIT/CUIL.
  esClienteAceptar(event: Event): void {
    let CUIT = (event.target as HTMLInputElement).value;
    this.servicioConsultar.verificarCliente(CUIT).subscribe((data) => {
      this.existeCliente = data;
    });
  }
}
