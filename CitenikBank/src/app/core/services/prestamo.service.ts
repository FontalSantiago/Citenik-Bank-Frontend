import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { PrestamoClass } from 'src/app/core/models/prestamo';
import { PrestamoConsultaClass } from '../models/prestamoConsulta';

@Injectable({
  providedIn: 'root',
})
export class PrestamoService {
  url: string = 'https://citenikback.azurewebsites.net/api/prestamos';

  prestamoSeleccionado: any;

  constructor(private http: HttpClient) {}

  listarPrestamos(): Observable<any> {
    return this.http.get(this.url);
  }

  obtenerPrestamo(id: number): Observable<any> {
    return this.http.get(this.url + '/' + id);
  }

  guardarPrestamo(prestamo: PrestamoClass): Observable<any> {
    return this.http.post(this.url, prestamo);
  }

  actualizarPrestamo(idPrestamo: number): Observable<any> {
    return this.http.patch(
      this.url + '?id=' + idPrestamo,
      idPrestamo
    );
  }

  enviarPrestamoSeleccionado(prestamo: PrestamoConsultaClass): void {
    this.prestamoSeleccionado = prestamo;
  }

  recibirPrestamoSeleccionado(): Observable<any> {
    return this.prestamoSeleccionado;
  }
}
