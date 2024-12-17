import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicamento } from './medicamento.model';

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {

  private apiUrl = 'https://ppi.miclickderecho.com/plantilla/MomentoValorativo2/api_pipe/api.php';

  constructor(private http: HttpClient) { }

  getMedicamentos(): Observable<any> {
    return this.http.get(`${this.apiUrl}?obtenerMedicamentoss=true`);
  }

  addMedicamento(medicamento: Medicamento): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}?agregarMedicamento=true`, medicamento, { headers });
  }

  updateMedicamento(medicamento: Medicamento): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.apiUrl}?actualizarMedicamento=true&id_medicamento=${medicamento.id_medicamento}`, medicamento, { headers });
  }

  deleteMedicamento(id_medicamento: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}?eliminarMedicamento=true&id_medicamento=${id_medicamento}`);
  }
}
