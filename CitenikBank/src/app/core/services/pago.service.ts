import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PagoService {
  url: string = 'https://citenikback.azurewebsites.net/api/pagos';
  constructor(private http: HttpClient) {}

  obtenerCuotaPagar(idPrestamo: number, fechaPago: string): Observable<any> {
    return this.http.get(
      this.url + '?idPrestamo=' + idPrestamo + '&fechaPago=' + fechaPago
    );
  }
  pagarCuota(idPrestamo: number, fechaPago: Date): Observable<any> {
    return this.http.post(
      this.url + '?idPrestamo=' + idPrestamo + '&fechaPago=' + fechaPago,
      fechaPago
    );
  }
}
