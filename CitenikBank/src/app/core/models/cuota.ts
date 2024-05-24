export class CuotaClass {
    id: number;
    idPrestamo: number;
    nrocuota: number;
    fechaPago: Date;
    fechaVencimiento: Date;
    
    constructor(
        id: number,
        idPrestamo: number,
        nrocuota: number,
        fechaPago: Date,
        fechaVencimiento: Date,
      ) {
        this.id= id;
        this.idPrestamo= idPrestamo;
        this.nrocuota= nrocuota;
        this.fechaPago= fechaPago;
        this.fechaVencimiento= fechaVencimiento;
      }    
  }
  