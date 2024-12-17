import { Injectable } from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { NavigationItem } from './navigation-item.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationLoaderService {
  private readonly _items: BehaviorSubject<NavigationItem[]> =
    new BehaviorSubject<NavigationItem[]>([]);

  get items$(): Observable<NavigationItem[]> {
    return this._items.asObservable();
  }

  constructor(private readonly layoutService: VexLayoutService) {
    this.loadNavigation();
  }

  loadNavigation(): void {
    this._items.next([
      {
        type: 'subheading',
        label: 'Dashboards',
        children: [
          {
            type: 'link',
            label: 'Porcinos',
            route: '/',
            icon: 'mat:pets', // Ícono representativo de mascotas
            routerLinkActiveOptions: { exact: true }
          },
          {
            type: 'link',
            label: 'Clientes',
            route: '/dash',
            icon: 'mat:people', // Ícono representativo de personas/clientes
            routerLinkActiveOptions: { exact: true }
          },
          {
            type: 'link',
            label: 'Alimentos',
            route: '/pipe',
            icon: 'mat:medical_services', // Ícono representativo de medicamentos/servicios médicos
            routerLinkActiveOptions: { exact: true }
          }
        ]
      }
    ]);
  }
}
