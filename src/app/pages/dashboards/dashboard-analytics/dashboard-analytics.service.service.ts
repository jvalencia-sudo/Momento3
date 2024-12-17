import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mascota } from './mascota.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardAnalyticsService {
  private apiUrl = 'https://ppi.miclickderecho.com/plantilla/MomentoValorativo2/api_pipe/api.php';

  constructor(private http: HttpClient) { }

  getMascotas(): Observable<any> {
    return this.http.get(`${this.apiUrl}?consultarMascotas=true`);
  }

  // Método para agregar una nueva mascota
  addMascota(mascota: Mascota): Observable<any> {
    return this.http.post(`${this.apiUrl}?agregarMascota=true`, mascota);
  }

  getClientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}?obtenerClientes=true`);
  }

  getMedicamentos(): Observable<any> {
    return this.http.get(`${this.apiUrl}?obtenerMedicamentos=true`);
  }

  // Método para eliminar una mascota por id
  deleteMascota(id_mascota: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}?eliminarMascota=true&id_mascota=${id_mascota}`);
  }

  updateMascota(mascota: Mascota): Observable<any> {
    return this.http.put(`${this.apiUrl}/mascotas/${mascota.id_mascota}`, mascota);
  }
}
