import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearRetiroRequest, RetiroResponse } from '../models/retiro.interface';

@Injectable({
  providedIn: 'root',
})
export class RetirosService {
  private readonly apiUrl = 'http://localhost:3004/retiros';

  constructor(private readonly http: HttpClient) {}

  crearSolicitud(payload: CrearRetiroRequest): Observable<RetiroResponse> {
    return this.http.post<RetiroResponse>(this.apiUrl, payload);
  }

  obtenerPorId(id: string): Observable<RetiroResponse> {
    return this.http.get<RetiroResponse>(`${this.apiUrl}/${id}`);
  }

  obtenerPorUsuarioId(usuarioId: string): Observable<RetiroResponse[]> {
    return this.http.get<RetiroResponse[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }
}
