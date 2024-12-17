export interface Cliente {
  id_cliente: number;
  cedula: string;  // La cédula puede ser texto si contiene caracteres como guiones
  nombres: string;
  apellidos: string;  // Apellidos debe ser string, no number
  direccion: string;
  telefono: string;
}
