export class PlanClass {
    id: number;
    nombre: string;
    tna: number;
    cuotasMax: number;
    cuotasMin: number;
    montoMax: number;
    montoMin: number;
    edadMax: number;
    precanCuota: number;
    precanMulta: number;
    costoOtorgamiento: number;
    vigenciaDesde: Date;
    vigenciaHasta: Date;
    
    constructor(
        id: number,
        nombre: string,
        TNA: number,
        cuotasMax: number,
        cuotasMin: number,
        montoMax: number,
        montoMin: number,
        edadMax: number,
        precanCuota: number,
        precanMulta: number,
        costoOtorgamiento: number,
        vigenciaDesde: Date,
        vigenciaHasta: Date,
      ) {
        this.id= id;
        this.nombre= nombre;
        this.tna= TNA;
        this.cuotasMax= cuotasMax;
        this.cuotasMin= cuotasMin;
        this.montoMax= montoMax;
        this.montoMin= montoMin;
        this.edadMax= edadMax;
        this.precanCuota= precanCuota;
        this.precanMulta= precanMulta;
        this.costoOtorgamiento= costoOtorgamiento;
        this.vigenciaDesde= vigenciaDesde;
        this.vigenciaHasta= vigenciaHasta;
      }    
  }
  