import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarRecomendacion } from './eliminar-recomendacion';

describe('EliminarRecomendacion', () => {
  let component: EliminarRecomendacion;
  let fixture: ComponentFixture<EliminarRecomendacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminarRecomendacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EliminarRecomendacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
