import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from './clientes.model';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private apiUrl = 'https://ppi.miclickderecho.com/plantilla/MomentoValorativo2/api_pipe/api.php';

  constructor(private http: HttpClient) { }

  // Obtener todos los clientes
  getClientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}?obtenerClientess=true`);
  }

  // Agregar un nuevo cliente
  addCliente(cliente: Cliente): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}?agregarCliente=true`, cliente, { headers });
  }

  // Actualizar un cliente existente
  updateCliente(cliente: Cliente): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.apiUrl}?actualizarCliente=true&id_cliente=${cliente.id_cliente}`, cliente, { headers });
  }

  // Eliminar un cliente
  deleteCliente(id_cliente: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}?eliminarCliente=true&id_cliente=${id_cliente}`);
  }
}
