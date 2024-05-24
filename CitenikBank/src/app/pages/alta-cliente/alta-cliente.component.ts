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
import { ClienteClass } from 'src/app/core/models/cliente';

//SERVICIOS
import { ClienteService } from 'src/app/core/services/cliente.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.component.html',
  styleUrls: ['./alta-cliente.component.css'],
})
export class AltaClienteComponent implements OnInit {
  //VARIABLES DE DATOS
  nombreCompleto: string = '';
  CUITRegistrado: string = '';
  fechaRegistrado: string = '';

  esCUITValido: boolean = true;
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
  caracteresValidos =
    "La primera letra del nombre debe ser Mayúscula, y no se admiten: 1-9 ! # $ % & ' ( ) * + , - . / : ; < = > ? @ [  ] ^ _` { | } ~";

  //VARIABLES DE DATOS
  existeCliente: ClienteClass[] = [];

  //FORMS PARA LA AGRUPACIÓN DE DATOS
  formRegistro: FormGroup;

  constructor(
    private formbuilder: FormBuilder,
    private servicioRegistrar: ClienteService,
    private servicioUsuario: UsuarioService
  ) {
    this.formRegistro = this.formbuilder.group({
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

  get nombre() {
    return this.formRegistro.get('nombre');
  }

  get apellido() {
    return this.formRegistro.get('apellido');
  }

  get CUIT() {
    return this.formRegistro.get('CUIT');
  }

  get fecha_nacimiento() {
    return this.formRegistro.get('fecha_nacimiento');
  }

  ngOnInit(): void {
    this.esCUITCUILValido();
  }

  //Valida que el CUIT/CUIL ingresado por el cliente tenga el formato correcto y sea existente.
  esCUITCUILValido(): Boolean {
    if (this.formRegistro.valid == false) return false;

    if (this.formRegistro.controls['CUIT'].value.length != 13) return false;

    let resultado = 0;
    let cuit_nro = this.formRegistro.get('CUIT')?.value.replace('-', '');
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

  //Valida que el usuario que se está registrando no exista, a traves de su CUIT/CUIL.
  esClienteGuardar(): void {
    if (
      this.servicioUsuario.obtenerToken() != null
    ) {
      let CUIT = this.formRegistro.get('CUIT')?.value;
      this.servicioRegistrar.verificarCliente(CUIT).subscribe((data) => {
        this.existeCliente = data;
        console.log(this.existeCliente);
      });
    }
  }

  //Guarda los datos del cliente a registrar para luego poder visualizarlos en el apartado de confirmación.
  datosModalGuardar() {
    this.nombreCompleto =
      this.formRegistro.get('nombre')?.value +
      ' ' +
      this.formRegistro.get('apellido')?.value;
    this.CUITRegistrado = this.formRegistro.get('CUIT')?.value;
    this.fechaRegistrado = this.formRegistro.get('fecha_nacimiento')?.value;
  }

  //Registra al cliente con los datos que se rellenaron en los campos del formulario devolviendo un mensaje de éxito al confirmar.
  confirmarCliente(): void {
    if (this.servicioUsuario.obtenerToken() != null) {
      let Cliente: ClienteClass = new ClienteClass(
        0,
        0,
        this.formRegistro.get('apellido')?.value,
        this.formRegistro.get('nombre')?.value,
        this.formRegistro.get('CUIT')?.value,
        this.formRegistro.get('fecha_nacimiento')?.value,
        true
      );
      this.servicioRegistrar.guardarCliente(Cliente).subscribe((data) => {
        Swal.fire({
          text:
            'El cliente ' +
            data.nombre +
            ' ha sido registrado con éxito con el número de legajo: ' +
            data.legajo,
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
