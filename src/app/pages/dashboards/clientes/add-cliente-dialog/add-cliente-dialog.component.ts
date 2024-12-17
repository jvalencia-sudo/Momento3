import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ClientesService } from '../clientes.service.service'; // Cambiado a ClientesService
import { CommonModule } from '@angular/common'; // Asegúrate de importar CommonModule
import Swal from 'sweetalert2'; // Importamos SweetAlert2

@Component({
  selector: 'app-add-cliente-dialog',
  templateUrl: './add-cliente-dialog.component.html',
  styleUrls: ['./add-cliente-dialog.component.scss'],
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
export class AddClienteDialogComponent {
  clienteForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<AddClienteDialogComponent>,
    private fb: FormBuilder,
    private clienteService: ClientesService,
    @Inject(MAT_DIALOG_DATA) public data: { cliente?: any } // Hacemos opcional el parámetro cliente
  ) {
    // Inicializamos el formulario con los datos recibidos o con valores por defecto
    this.clienteForm = this.fb.group({
      cedula: [this.data?.cliente?.cedula || '', Validators.required],
      nombres: [this.data?.cliente?.nombres || '', Validators.required],
      apellidos: [this.data?.cliente?.apellidos || '', Validators.required],
      direccion: [this.data?.cliente?.direccion || '', Validators.required],
      telefono: [this.data?.cliente?.telefono || '', Validators.required]
    });
  }

  // Cerrar el modal
  onCancel(): void {
    this.dialogRef.close();
  }

  // Guardar el cliente
  onSave(): void {
    if (this.clienteForm.valid) {
      this.agregarCliente(); // Llama al método para agregar el cliente
    }
  }

  // Método para agregar el cliente a la base de datos
  agregarCliente(): void {
    this.clienteService.addCliente(this.clienteForm.value).subscribe(
      response => {
        if (response.success) {
          // Mostrar el SweetAlert cuando se inserte correctamente
          Swal.fire({
            icon: 'success',
            title: '¡Cliente agregado!',
            text: 'El cliente se agregó correctamente a la base de datos',
            confirmButtonText: 'Ok'
          }).then(() => {
            // Cerrar el modal y recargar la lista
            this.dialogRef.close();
            window.location.reload();
          });
        }
      },
      error => {
        console.error('Error al agregar el cliente', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al intentar agregar el cliente. Por favor, inténtalo de nuevo.',
          confirmButtonText: 'Ok'
        });
      }
    );
  }
}
