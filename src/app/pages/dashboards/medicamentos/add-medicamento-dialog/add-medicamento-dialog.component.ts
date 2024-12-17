import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MedicamentoService } from '../medicamento.service.service'; // Servicio de Medicamentos
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-medicamento-dialog',
  templateUrl: './add-medicamento-dialog.component.html',
  styleUrls: ['./add-medicamento-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class AddMedicamentoDialogComponent {
  medicamentoForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<AddMedicamentoDialogComponent>,
    private fb: FormBuilder,
    private medicamentoService: MedicamentoService, // Servicio de medicamentos
    @Inject(MAT_DIALOG_DATA) public data: { medicamento?: any } // Parámetro opcional para edición
  ) {
    // Inicializamos el formulario con los datos recibidos o con valores por defecto
    this.medicamentoForm = this.fb.group({
      nombre: [this.data?.medicamento?.nombre || '', Validators.required],
      descripcion: [this.data?.medicamento?.descripcion || '', Validators.required],
      dosis: [this.data?.medicamento?.dosis || '', Validators.required]
    });
  }

  // Cerrar el modal
  onCancel(): void {
    this.dialogRef.close();
  }

  // Guardar el medicamento
  onSave(): void {
    if (this.medicamentoForm.valid) {
      this.agregarMedicamento(); // Llama al método para agregar el medicamento
    }
  }

  // Método para agregar el medicamento a la base de datos
  agregarMedicamento(): void {
    this.medicamentoService.addMedicamento(this.medicamentoForm.value).subscribe(
      response => {
        if (response.success) {
          // Mostrar el SweetAlert cuando se inserte correctamente
          Swal.fire({
            icon: 'success',
            title: 'Alimento agregado!',
            text: 'El medicamento se agregó correctamente a la base de datos',
            confirmButtonText: 'Ok'
          }).then(() => {
            // Cerrar el modal y recargar la lista
            this.dialogRef.close();
            window.location.reload();
          });
        }
      },
      error => {
        console.error('Error al agregar el medicamento', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al intentar agregar el medicamento. Por favor, inténtalo de nuevo.',
          confirmButtonText: 'Ok'
        });
      }
    );
  }
}
