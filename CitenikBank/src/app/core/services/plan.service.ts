import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { PlanClass } from '../models/plan';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  url: string = 'https://localhost:7106/api/planes';
  planSeleccionado: any;

  constructor(private http: HttpClient) {}
  listarPlanes(): Observable<any> {
    return this.http.get(this.url);
  }

  obtenerPlan(id: number): Observable<any> {
    return this.http.get(this.url + '/' + id);
  }

  obtenerPlanNombre(nombre: string): Observable<any> {
    return this.http.get(this.url + '/?nombre=' + nombre);
  }

  guardarPlan(plan: PlanClass): Observable<any> {
    return this.http.post(this.url, plan);
  }

  modificarPlan(idPlan: number, plan: PlanClass): Observable<any> {
    return this.http.put(this.url + '/' + idPlan, plan);
  }

  enviarPlanSeleccionado(plan: PlanClass): void {
    this.planSeleccionado = plan;
  }

  recibirPlanSeleccionado(): Observable<any> {
    return this.planSeleccionado;
  }
}
