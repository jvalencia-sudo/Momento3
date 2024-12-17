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
import { AddMascotaDialogComponent } from './add-mascota-dialog/add-mascota-dialog.component'; // Importamos el componente del modal
import { FormsModule } from '@angular/forms';
import { VexScrollbarComponent } from '@vex/components/vex-scrollbar/vex-scrollbar.component';
import { DashboardAnalyticsService } from './dashboard-analytics.service.service';
import { Mascota } from './mascota.model'; // Importamos el modelo Mascota
import { MatSort } from '@angular/material/sort'; // Importamos MatSort
import { MatPaginatorModule } from '@angular/material/paginator'; // Importamos MatPaginatorModule
import { CommonModule } from '@angular/common'; // Importar CommonModule
import Swal from 'sweetalert2';


@Component({
  selector: 'vex-dashboard-analytics',
  templateUrl: './dashboard-analytics.component.html',
  styleUrls: ['./dashboard-analytics.component.scss'],
  standalone: true,
  imports: [
    VexSecondaryToolbarComponent,
    VexBreadcrumbsComponent,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule, // Importamos el módulo
    VexScrollbarComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    CommonModule
  ]
})
export class DashboardAnalyticsComponent {
  searchTerm: string = '';
  selectedRaza: string = '';
  razas: string[] = ['Bulldog', 'Golden Retriever', 'Beagle', 'Labrador'];
  displayedColumns: string[] = ['id', 'nombre', 'raza', 'edad', 'peso', 'cliente', 'medicamento', 'acciones'];
  dataSource = new MatTableDataSource<Mascota>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private configService: VexConfigService,
    private dashboardService: DashboardAnalyticsService,
    private dialog: MatDialog, // Inyectamos MatDialog
  ) { }

  ngOnInit() {
    this.footerVisibleChange(false);
    this.obtenerMascotas();
  }

  obtenerMascotas() {
    this.dashboardService.getMascotas().subscribe(
      (data: any) => {
        if (data && Array.isArray(data.mascotas)) {
          this.dataSource.data = data.mascotas;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error => {
        console.error('Error al obtener las mascotas', error);
        this.dataSource.data = [];
      }
    );
  }

  applyFilter() {
    this.dataSource.filterPredicate = (data: Mascota, filter: string) => {
      const searchString = filter.toLowerCase();
      const matchesSearchTerm = data.nombre_mascota.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRaza = this.selectedRaza ? data.raza === this.selectedRaza : true;
      return matchesSearchTerm && matchesRaza;
    };
    this.dataSource.filter = `${this.searchTerm}${this.selectedRaza}`;
  }

  onSearchTermChange() {
    this.applyFilter();
  }

  onRazaChange() {
    this.applyFilter();
  }

  footerVisibleChange(change: boolean): void {
    this.configService.updateConfig({
      footer: {
        visible: false
      }
    });
  }

  // Método para abrir el modal
  agregarMascota(): void {
    const dialogRef = this.dialog.open(AddMascotaDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Llama al servicio para agregar la nueva mascota a la base de datos
        this.dashboardService.addMascota(result).subscribe(
          response => {
            // Refresca la tabla si se agrega correctamente
            this.obtenerMascotas();
          },
          error => {
            console.error('Error al agregar la mascota', error);
          }
        );
      }
    });
  }

  openAddMascotaModal() {
    const dialogRef = this.dialog.open(AddMascotaDialogComponent, {
      width: '800px',
      data: {} // No pasamos una mascota para la creación
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obtenerMascotas();
      }
    });
  }

  openEditMascotaModal(mascota: Mascota) {
    const dialogRef = this.dialog.open(AddMascotaDialogComponent, {
      width: '800px',
      data: { mascota }, // Pasamos directamente la mascota, incluyendo id_cliente y id_medicamento
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si es una edición, llama al servicio para actualizar la mascota
        this.dashboardService.updateMascota(result).subscribe(
          () => {
            Swal.fire('Actualizado', 'La mascota ha sido actualizada correctamente.', 'success');
            this.obtenerMascotas(); // Refresca la lista de mascotas
          },
          error => {
            Swal.fire('Error', 'Ocurrió un error al intentar actualizar la mascota.', 'error');
          }
        );
      }
    });
  }

  eliminarMascota(id_mascota: number) {
    // Confirmación antes de eliminar
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',   // Color del botón de confirmación (rojo)
      cancelButtonColor: '#3085d6', // Color del botón de cancelación (azul)
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamar al servicio para eliminar la mascota
        this.dashboardService.deleteMascota(id_mascota).subscribe(
          () => {
            Swal.fire('Eliminado', 'La mascota ha sido eliminada correctamente.', 'success');
            this.obtenerMascotas(); // Refrescar la lista de mascotas
          },
          error => {
            console.error('Error al eliminar la mascota', error);
            Swal.fire('Error', 'Ocurrió un error al intentar eliminar la mascota.', 'error');
          }
        );
      }
    });
  }
}