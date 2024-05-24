export class ComposicionClass {
    id: number;
    idCuota: number;
    idConcepto: number;
    monto: number;
  
    constructor(
        id: number,
        idCuota: number,
        idConcepto: number,
        monto: number,
    ) {
      this.id = id;
      this.idCuota = idCuota;
      this.idConcepto = idConcepto;
      this.monto = monto;
    }
  }