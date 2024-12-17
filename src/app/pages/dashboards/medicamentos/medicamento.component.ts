import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { VexConfigService } from '@vex/config/vex-config.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { AddMedicamentoDialogComponent } from './add-medicamento-dialog/add-medicamento-dialog.component';
import { FormsModule } from '@angular/forms';
import { VexScrollbarComponent } from '@vex/components/vex-scrollbar/vex-scrollbar.component';
import { MedicamentoService } from './medicamento.service.service';
import { Medicamento } from './medicamento.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';

@Component({
  selector: 'vex-medicamentos',
  standalone: true,
  templateUrl: './medicamento.component.html',
  styleUrls: ['./medicamento.component.scss'],
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
export class MedicamentoComponent {
  searchTerm: string = '';
  displayedColumns: string[] = ['id_medicamento', 'nombre', 'descripcion', 'dosis', 'acciones'];
  dataSource = new MatTableDataSource<Medicamento>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private configService: VexConfigService,
    private medicamentoService: MedicamentoService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.footerVisibleChange(false);
    this.obtenerMedicamentos();
  }

  obtenerMedicamentos() {
    this.medicamentoService.getMedicamentos().subscribe(
      (data: any) => {
        if (data && Array.isArray(data.medicamentos)) {
          this.dataSource.data = data.medicamentos;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error => {
        console.error('Error al obtener los medicamentos', error);
        this.dataSource.data = [];
      }
    );
  }

  applyFilter() {
    this.dataSource.filterPredicate = (data: Medicamento, filter: string) => {
      return data.nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
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

  generarReporte() {
    const data = this.dataSource.filteredData.map(medicamento => ({
      'ID': medicamento.id_medicamento,
      'Nombre': medicamento.nombre,
      'Descripción': medicamento.descripcion,
      'Dosis': medicamento.dosis
    }));

    const csv = this.convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'reporte_medicamentos.csv');
  }

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

  openAddMedicamentoModal() {
    const dialogRef = this.dialog.open(AddMedicamentoDialogComponent, {
      width: '800px',
      data: {} // No pasamos ningún medicamento para la creación
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obtenerMedicamentos();
      }
    });
  }

  eliminarMedicamento(id_medicamento: number) {
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
        this.medicamentoService.deleteMedicamento(id_medicamento).subscribe(
          () => {
            Swal.fire('Eliminado', 'El medicamento ha sido eliminado correctamente.', 'success');
            this.obtenerMedicamentos();
          },
          error => {
            console.error('Error al eliminar el medicamento', error);
            Swal.fire('Error', 'Ocurrió un error al intentar eliminar el medicamento.', 'error');
          }
        );
      }
    });
  }
}
