export class PrestamoClass {
    id: number;
    idPlan: number;
    idCliente: number;
    capital: number;
    cantidadCuotas: number;
    fechaOtorgamiento: Date;
    diaVencimiento: number;
    estado: string;
    
  constructor(
    id: number,
    idPlan: number,
    idCliente: number,
    capital: number,
    cantidadCuotas: number,
    fechaOtorgamiento: Date,
    diaVencimiento: number,
    estado: string){
      this.id = id;
      this.idPlan = idPlan;
      this.idCliente = idCliente;
      this.capital = capital;
      this.cantidadCuotas = cantidadCuotas;
      this.fechaOtorgamiento = fechaOtorgamiento;
      this.diaVencimiento = diaVencimiento;
      this.estado = estado
  }
}