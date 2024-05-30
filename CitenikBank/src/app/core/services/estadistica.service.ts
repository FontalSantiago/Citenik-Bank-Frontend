import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstadisticaService {
  url: string = 'https://localhost:7106/api/estadisticas';

  constructor(private http: HttpClient) {}

  consultaPrestamosActivosPlan(): Observable<any> {
    return this.http.get(this.url + '/prestamosActivosPlan');
  }

  consultaPrestamosActivosCapital(): Observable<any> {
    return this.http.get(this.url + '/prestamosActivosCapital');
  }

  consultaTotalPorConceptoCapital(): Observable<any> {
    return this.http.get(this.url + '/totalPorConceptoCapital');
  }

  consultaTotalPorConceptoInteres(): Observable<any> {
    return this.http.get(this.url + '/totalPorConceptoInteresFinanciero');
  }

  consultaTotalPorConceptoPunitorio(): Observable<any> {
    return this.http.get(this.url + '/totalPorConceptoInteresPunitorio');
  }

  consultaClientesMayorDeuda(): Observable<any> {
    return this.http.get(this.url + '/clientesMayorDeuda');
  }

  consultaPrestamosConMayorRentabilidad(): Observable<any> {
    return this.http.get(this.url + '/prestamosConMayorRentabilidad');
  }
}
