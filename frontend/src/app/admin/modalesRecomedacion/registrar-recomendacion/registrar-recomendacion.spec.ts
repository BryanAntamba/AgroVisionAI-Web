import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarRecomendacion } from './registrar-recomendacion';

describe('RegistrarRecomendacion', () => {
  let component: RegistrarRecomendacion;
  let fixture: ComponentFixture<RegistrarRecomendacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarRecomendacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarRecomendacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
