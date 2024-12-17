import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { VexConfigService } from '@vex/config/vex-config.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort'; // Cambiado MatSort por MatSortModule
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog'; // Importar MatDialogModule
import { AddClienteDialogComponent } from './add-cliente-dialog/add-cliente-dialog.component'; // Importamos el componente del modal
import { FormsModule } from '@angular/forms';
import { VexScrollbarComponent } from '@vex/components/vex-scrollbar/vex-scrollbar.component';
import { ClientesService } from './clientes.service.service'; // Importamos el servicio ClientesService
import { Cliente } from './clientes.model'; // Importamos el modelo Cliente
import { MatSort } from '@angular/material/sort'; // Importamos MatSort
import { MatPaginatorModule } from '@angular/material/paginator'; // Importamos MatPaginatorModule
import { CommonModule } from '@angular/common'; // Importar CommonModule
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver'; // Asegúrate de instalar esta librería: npm install file-saver

@Component({
  selector: 'vex-clientes',
  standalone: true,
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
  imports: [
    VexSecondaryToolbarComponent,
    VexBreadcrumbsComponent,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    VexScrollbarComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    CommonModule,
    MatDialogModule
  ]
})
export class ClientesComponent {
  searchTerm: string = '';
  displayedColumns: string[] = ['id_cliente', 'cedula', 'nombres', 'apellidos', 'direccion', 'telefono', 'acciones'];
  dataSource = new MatTableDataSource<Cliente>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private configService: VexConfigService,
    private dashboardService: ClientesService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.footerVisibleChange(false);
    this.obtenerClientes(); // Cambiamos a obtenerClientes()
  }

  obtenerClientes() {
    this.dashboardService.getClientes().subscribe(
      (data: any) => {
        if (data && Array.isArray(data.clientes)) {
          this.dataSource.data = data.clientes;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error => {
        console.error('Error al obtener los clientes', error);
        this.dataSource.data = [];
      }
    );
  }

  applyFilter() {
    this.dataSource.filterPredicate = (data: Cliente, filter: string) => {
      return data.nombres.toLowerCase().includes(this.searchTerm.toLowerCase());
    };
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  onSearchTermChange() {
    this.applyFilter();
  }

  footerVisibleChange(change: boolean): void {
    this.configService.updateConfig({
      footer: {
        visible: false
      }
    });
  }

  // Función para generar el reporte en formato CSV
  generarReporte() {
    const data = this.dataSource.filteredData.map(cliente => ({
      'ID': cliente.id_cliente,
      'Cédula': cliente.cedula,
      'Nombres': cliente.nombres,
      'Apellidos': cliente.apellidos,
      'Dirección': cliente.direccion,
      'Teléfono': cliente.telefono
    }));

    const csv = this.convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'reporte_clientes.csv');
  }

   // Función para convertir los datos a CSV
   convertToCSV(objArray: any[]) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = '';

    // Encabezados
    for (const index in array[0]) {
      if (array[0].hasOwnProperty(index)) {
        row += index + ',';
      }
    }
    row = row.slice(0, -1);
    str += row + '\r\n';

    // Filas
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (const index in array[i]) {
        if (array[i].hasOwnProperty(index)) {
          line += array[i][index] + ',';
        }
      }
      line = line.slice(0, -1);
      str += line + '\r\n';
    }
    return str;
  }

  // Método para abrir el modal para agregar un cliente
  agregarCliente(): void {
    const dialogRef = this.dialog.open(AddClienteDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dashboardService.addCliente(result).subscribe(
          () => {
            this.obtenerClientes();
          },
          error => {
            console.error('Error al agregar el cliente', error);
          }
        );
      }
    });
  }

  openEditClienteModal(cliente: Cliente) {
    const dialogRef = this.dialog.open(AddClienteDialogComponent, {
      width: '800px',
      data: { cliente }, // Pasamos los datos del cliente a editar
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dashboardService.updateCliente(result).subscribe(
          () => {
            Swal.fire('Actualizado', 'El cliente ha sido actualizado correctamente.', 'success');
            this.obtenerClientes(); // Refresca la lista de clientes
          },
          error => {
            Swal.fire('Error', 'Ocurrió un error al intentar actualizar el cliente.', 'error');
          }
        );
      }
    });
  }

  eliminarCliente(id_cliente: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then(result => {
      if (result.isConfirmed) {
        this.dashboardService.deleteCliente(id_cliente).subscribe(
          () => {
            Swal.fire('Eliminado', 'El cliente ha sido eliminado correctamente.', 'success');
            this.obtenerClientes();
          },
          error => {
            console.error('Error al eliminar el cliente', error);
            Swal.fire('Error', 'Ocurrió un error al intentar eliminar el cliente.', 'error');
          }
        );
      }
    });
  }

  openAddClienteModal() {
    const dialogRef = this.dialog.open(AddClienteDialogComponent, {
      width: '800px',
      data: {} // No pasamos ningún cliente para la creación
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obtenerClientes(); // Refresca la tabla si se agrega un cliente
      }
    });
  }
}
