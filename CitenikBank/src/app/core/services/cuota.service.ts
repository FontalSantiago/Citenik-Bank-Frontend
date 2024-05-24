import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CuotaService {
  url: string = 'https://citenikback.azurewebsites.net/api/prestamo';

  constructor(private http: HttpClient) {}

  listarCuotas(idPrestamo: number): Observable<any> {
    return this.http.get(this.url + '/' + idPrestamo + '/cuotas');
  }

  listarComposicionesCuota(
    idPrestamo: number,
    idCuota: number
  ): Observable<any> {
    return this.http.get(this.url + '/' + idPrestamo + '/cuotas/' + idCuota);
  }
}
