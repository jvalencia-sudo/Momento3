export interface Mascota {
  id_mascota: number;
  nombre_mascota: string;
  raza: string;
  edad: number;
  peso: number;
  nombre_cliente: string;
  nombre_medicamento?: string; // Opcional si puede estar vacío
}

export interface ModalData {
  id: number;
  nombre: string;
  raza: string;
  edad: number;
  peso: string;
  cliente: string;
  medicamento?: string; // Opcional si puede estar vacío
}
