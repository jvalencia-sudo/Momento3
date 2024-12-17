import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';  // Importamos MatSelectModule
import { MatOptionModule } from '@angular/material/core';    // Importamos MatOptionModule
import { MatDialog } from '@angular/material/dialog';
import { DashboardAnalyticsService } from '../dashboard-analytics.service.service';
import { CommonModule } from '@angular/common'; // Asegúrate de importar CommonModule
import Swal from 'sweetalert2'; // Importamos SweetAlert2

@Component({
  selector: 'app-add-mascota-dialog',
  templateUrl: './add-mascota-dialog.component.html',
  styleUrls: ['./add-mascota-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,  // Asegúrate de que MatSelectModule esté en imports
    MatOptionModule,  // Asegúrate de que MatOptionModule esté en imports
    ReactiveFormsModule,
    CommonModule
  ]
})
export class AddMascotaDialogComponent {
  mascotaForm: FormGroup;
  clientes: any[] = [];
  medicamentos: any[] = [];
  isEditMode: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<AddMascotaDialogComponent>,
    private fb: FormBuilder,
    private dashboardService: DashboardAnalyticsService,
    @Inject(MAT_DIALOG_DATA) public data: { mascota?: any } // Hacemos opcional el parámetro mascota
  ) {
    // Inicializamos el formulario con los datos recibidos o con valores por defecto
    this.mascotaForm = this.fb.group({
      nombre: [this.data?.mascota?.nombre_mascota || '', Validators.required],
      raza: [this.data?.mascota?.raza || '', Validators.required],
      edad: [this.data?.mascota?.edad || '', Validators.required],
      peso: [this.data?.mascota?.peso || '', Validators.required],
      cliente: [this.data?.mascota?.id_cliente || '', Validators.required], // Preseleccionamos el cliente
      medicamento: [this.data?.mascota?.id_medicamento || ''] // Preseleccionamos el medicamento
    });

    // Llamamos a los métodos para cargar clientes y medicamentos
    this.loadClientes();
    this.loadMedicamentos();
  }

  loadClientes(): void {
    this.dashboardService.getClientes().subscribe({
      next: (response) => {
        if (response.success) {
          this.clientes = response.clientes; // Asigna la lista de clientes

          // Verificar si el id_cliente existe en los clientes cargados
          if (this.data?.mascota?.id_cliente) {
            const clienteSeleccionado = this.clientes.find(cliente => cliente.id_cliente === this.data.mascota.id_cliente);

            // Si se encuentra el cliente, establecerlo en el formulario
            if (clienteSeleccionado) {
              this.mascotaForm.patchValue({
                cliente: clienteSeleccionado.id_cliente
              });
            }
          }
        } else {
          console.error('Error al cargar los clientes:', response.message);
        }
      },
      error: (error) => {
        console.error('Error al cargar los clientes:', error);
      }
    });
  }

  loadMedicamentos(): void {
    this.dashboardService.getMedicamentos().subscribe({
      next: (response) => {
        if (response.success) {
          this.medicamentos = response.medicamentos; // Asigna la lista de medicamentos

          // Verificar si el id_medicamento existe en los medicamentos cargados
          if (this.data?.mascota?.id_medicamento) {
            const medicamentoSeleccionado = this.medicamentos.find(medicamento => medicamento.id_medicamento === this.data.mascota.id_medicamento);

            // Si se encuentra el medicamento, establecerlo en el formulario
            if (medicamentoSeleccionado) {
              this.mascotaForm.patchValue({
                medicamento: medicamentoSeleccionado.id_medicamento
              });
            }
          }
        } else {
          console.error('Error al cargar los medicamentos:', response.message);
        }
      },
      error: (error) => {
        console.error('Error al cargar los medicamentos:', error);
      }
    });
  }

  // Cerrar el modal
  onCancel(): void {
    this.dialogRef.close();
  }

  // Guardar la mascota
  onSave(): void {
    if (this.mascotaForm.valid) {
      this.agregarMascota(); // Llama al método para agregar la mascota
    }
  }

  // Método para agregar la mascota a la base de datos
  agregarMascota(): void {
    this.dashboardService.addMascota(this.mascotaForm.value).subscribe(
      response => {
        if (response.success) {
          // Mostrar el SweetAlert cuando se inserte correctamente
          Swal.fire({
            icon: 'success',
            title: 'Porcino agregado!',
            text: 'La mascota se agregó correctamente a la base de datos',
            confirmButtonText: 'Ok'
          }).then(() => {
            // Cerrar el modal y recargar la página
            this.dialogRef.close();
            window.location.reload();
          });
        }
      },
      error => {
        console.error('Error al agregar la mascota', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al intentar agregar la mascota. Por favor, inténtalo de nuevo.',
          confirmButtonText: 'Ok'
        });
      }
    );
  }
}
