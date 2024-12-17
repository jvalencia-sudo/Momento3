import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebaPipeComponent } from './prueba-pipe.component';

describe('PruebaPipeComponent', () => {
  let component: PruebaPipeComponent;
  let fixture: ComponentFixture<PruebaPipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PruebaPipeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PruebaPipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
