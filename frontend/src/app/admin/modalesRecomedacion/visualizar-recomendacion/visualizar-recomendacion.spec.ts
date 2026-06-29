import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarRecomendacion } from './visualizar-recomendacion';

describe('VisualizarRecomendacion', () => {
  let component: VisualizarRecomendacion;
  let fixture: ComponentFixture<VisualizarRecomendacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarRecomendacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarRecomendacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
