export class CuotaVencidaClass {
    id: number;
    nroCuota: number;
    monto: number;
    fechaVen: Date;
    fechaPago: Date;
    montoPagar: number;
    interesPunitorio: number;
    
    constructor(
        id: number,
        nroCuota: number,
        monto: number,
        fechaVen: Date,
        fechaPago: Date,
        montoPagar: number,
        interesPunitorio: number,
      ) {
        this.id= id;
        this.nroCuota= nroCuota;
        this.monto= monto;
        this.fechaVen= fechaVen;
        this.fechaPago= fechaPago;
        this.montoPagar= montoPagar;
        this.interesPunitorio= interesPunitorio;

      }    
  }
  