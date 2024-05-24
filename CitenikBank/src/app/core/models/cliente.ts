export class ClienteClass {
  id: number;
  legajo: number;
  apellido: string;
  nombre: string;
  cuit: string;
  fecha_nacimiento: Date;
  estado: boolean;

  constructor(
    id: number,
    legajo: number,
    apellido: string,
    nombre: string,
    cuit: string,
    fecha_nacimiento: Date,
    estado: boolean
  ) {
    this.id = id;
    this.legajo = legajo;
    this.apellido = apellido;
    this.nombre = nombre + ' ' + this.apellido;
    this.cuit = cuit;
    this.fecha_nacimiento = fecha_nacimiento;
    this.estado = estado;
  }
}
