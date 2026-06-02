import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarRecomendacion } from './editar-recomendacion';

describe('EditarRecomendacion', () => {
  let component: EditarRecomendacion;
  let fixture: ComponentFixture<EditarRecomendacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarRecomendacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarRecomendacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
