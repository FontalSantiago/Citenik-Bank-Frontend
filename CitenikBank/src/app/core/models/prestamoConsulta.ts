export class PrestamoConsultaClass {
  id: number;
  cuit: string;
  nombre: string;
  capital: number;
  cantidadCuotas: number;
  cuotasPagas: number;
  cuotasVencidasImpagas: number;
  fechaOtorgamiento: Date;
  estado: string;

  constructor(
    id: number,
    cuit: string,
    nombre: string,
    capital: number,
    cantidadCuotas: number,
    cuotasPagas: number,
    cuotasVencidasImpagas: number,
    fechaOtorgamiento: Date,
    estado: string
  ) {
    this.id = id;
    this.cuit = cuit;
    this.nombre = nombre;
    this.capital = capital;
    this.cantidadCuotas = cantidadCuotas;
    this.cuotasPagas = cuotasPagas;
    this.cuotasVencidasImpagas = cuotasVencidasImpagas;
    this.fechaOtorgamiento = fechaOtorgamiento;
    this.estado = estado;
  }
}
