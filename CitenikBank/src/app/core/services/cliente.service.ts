import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClienteClass } from '../models/cliente';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private url: string = 'https://citenikback.azurewebsites.net/api/clientes';

  constructor(private http: HttpClient) {}

  listarClientes(): Observable<any> {
    return this.http.get(this.url);
  }

  obtenerCliente(id: number): Observable<any> {
    return this.http.get(this.url + '/' + id);
  }

  verificarCliente(CUIT: string): Observable<any> {
    return this.http.get(this.url + '/?CUIT=' + CUIT);
  }

  guardarCliente(cliente: ClienteClass): Observable<any> {
    return this.http.post(this.url, cliente);
  }

  modificarCliente(idCliente: number, cliente: ClienteClass): Observable<any> {
    return this.http.put(this.url + '/' + idCliente, cliente);
  }
}
